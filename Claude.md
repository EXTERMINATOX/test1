# claude.md — Prop Bills Shop

> **Lis ce fichier en premier.** Il contient tout ce que tu dois savoir sur ce projet avant de modifier quoi que ce soit.

---

## 🏗️ Structure du projet

```
prop-bills-shop/
│
├── index.html                  ← Page principale (boutique + panier + formulaire de commande)
├── pages/
│   ├── product-info.html       ← Page produit (specs, photos, tests qualité)
│   ├── reviews.html            ← Avis clients (formulaire + grille de reviews)
│   └── delivery-info.html      ← Informations livraison (étapes, FAQ, calculateur)
│
├── assets/
│   ├── css/
│   │   └── shared.css          ← ⭐ CSS partagé — tokens, composants communs
│   ├── js/
│   │   ├── shared.js           ← ⭐ JS partagé — utilitaires, language switcher, Discord
│   │   └── reviews-data.js     ← Base de données des avis clients (buildDatabase())
│   └── images/                 ← Toutes les images (placeholder — voir section Images)
│
├── claude.md                   ← Ce fichier (contexte pour Claude IA)
└── README.md                   ← Documentation GitHub
```

---

## 🎨 Design System

### Polices
- **Display / titres** : `Fraunces` (serif, italique expressif)
- **Corps / UI** : `Plus Jakarta Sans` (sans-serif)
- **Code / monospace** : `JetBrains Mono`
- Chargées via Google Fonts — lien dans chaque `<head>`

### Palette principale
| Variable CSS | Valeur | Usage |
|---|---|---|
| `--indigo` | `#4f46e5` | Couleur brand principale, boutons CTA |
| `--indigo2` | `#6366f1` | Hover states |
| `--indigo3` | `#818cf8` | Textes sur fond sombre, accents |
| `--night` | `#07091c` | Fond hero / nav |
| `--emerald` | `#059669` | Succès, livraison gratuite |
| `--amber` | `#d97706` | Avertissements, étoiles |
| `--rose` | `#dc2626` | Erreurs, suppressions |
| `--orange` | `#ea580c` | Accents secondaires |

### Variables utilitaires
- `--ip`, `--ib` — indigo en fond/bordure translucides
- `--ep`, `--eb` — emerald en fond/bordure translucides
- `--ap`, `--ab` — amber en fond/bordure translucides
- `--rp` — rose en fond translucide
- `--r4` `--r8` `--r12` `--r16` `--r20` — border-radius standards
- `--ease` — transition standard (`.2s cubic-bezier(.4,0,.2,1)`)
- `--sh-sm`, `--sh-md`, `--sh-xl` — box-shadows

> **Règle d'or :** Ne jamais coder une couleur en dur dans une page. Toujours utiliser les variables CSS de `shared.css`.

### Composants partagés (dans `shared.css`)
- `.nav` — barre de navigation sticky (pages secondaires)
- `.nav-logo`, `.nav-back` — logo et lien retour dans la nav
- `.lang-sw` + `.lb` — toggle de langue EN/FR
- `.kicker` — badge de section en capsule
- `.sec-eye`, `.sec-title`, `.sec-rule`, `.sec-desc` — en-têtes de section
- `.btn-primary`, `.btn-ghost` — boutons
- `.fi`, `.fg` — champs de formulaire
- `.cta-block`, `.cta-block-inner`, `.cta-block-btns` — bloc CTA de fin de page
- Animations : `.fu` (fadeUp) + classes de délai `.d1` à `.d5`

---

## 🌐 Système de langues (EN/FR)

Chaque page est **bilingue** (anglais + français canadien).

### Comment ça fonctionne
1. Les textes sont dans un objet `T = { en: {...}, fr: {...} }` dans le `<script>` de chaque page.
2. La fonction `setLang(l)` parcourt cet objet et met à jour le DOM via `setText(id, val)` et `setHTML(id, val)`.
3. `PBS.switchLang(l)` (dans `shared.js`) gère les boutons toggle et la persistance dans `localStorage`.

### Ajouter/modifier un texte
1. Trouver l'objet `T` dans la page concernée.
2. Ajouter/modifier la clé **dans les deux blocs** (`en` et `fr`).
3. Ajouter le `id` correspondant dans le HTML.
4. Appeler `setText('mon-id', v.maCle)` ou `setHTML('mon-id', v.maCle)` dans `setLang()`.

### Langue par défaut
- `localStorage['pbs_lang']` si défini (visite précédente)
- Sinon `'en'`

---

## 🛒 Logique de commande (`index.html`)

### Panier
- `cart` — tableau d'objets `{ name, price, desc, qty }`
- `renderCart()` — re-render le panneau panier et le badge compteur
- `addToCart(pack)` — ajoute un pack au panier

### Packs disponibles
Définis dans l'objet `PACKS` (dans `index.html`). Chaque pack a :
```js
{
  id: 'sample',
  name: { en: '...', fr: '...' },
  price: 149,
  desc: { en: '...', fr: '...' },
  badge: { en: '...', fr: '...' },   // optionnel
  free: { 20: 0, 50: 0, 100: 0 },   // billets gratuits (crypto seulement)
}
```

### Méthodes de paiement
- **Interac e-Transfer** — montant envoyé à l'adresse email du shop
- **Bitcoin (BTC)** — adresse définie dans la constante `BTC` (haut du script)
- **Zcash (ZEC)** — adresse définie dans la constante `ZEC`
- Crypto = bonus de billets gratuits (`freeC`, `freeS`)

### Envoi de commande
- Rate limit : 2 soumissions max par heure (via `PBS.checkRateLimit()`)
- Destination : webhook Discord (constante `WH` en haut du script)
- L'embed Discord inclut : nom, email, Telegram, téléphone, adresse, total, items, navigateur

---

## ⭐ Système d'avis clients (`reviews.html`)

### Architecture
- Les avis "de base" sont générés par `buildDatabase()` dans `reviews-data.js` (chargé via `<script src>` séparé).
- `LIVE_REVIEWS` = copie de `BASE_REVIEWS` à laquelle s'ajoute l'avis de l'utilisateur en temps réel.
- `displayedReviews` = version filtrée/triée de `LIVE_REVIEWS`, paginée par 12.

### Soumission d'un avis
1. L'utilisateur remplit le formulaire (`r-name`, `r-code`, `r-pack`, `r-title`, `r-text`, étoiles).
2. `submitReview(e)` sauvegarde dans `localStorage` (clé `pbs_my_review_v3`) ET envoie à Discord.
3. Le formulaire se masque, le banner "Your Review" apparaît avec statut pending/approved.
4. Une modale affiche le code promo généré (`PBS10-XXXX`).

### Code de commande
- Format valide : commence par `PBS-`
- Avis avec code valide → statut `approved` (vert)
- Avis sans code valide → statut `pending` (orange), passé en approbation manuelle

### Code promo
- Généré par `generatePromoCode()` → format `PBS10-XXXX` (4 caractères alphanumériques)
- Affiché dans une modale après soumission
- Sauvegardé dans le `localStorage` avec l'avis

### Effacer / Recommencer un avis
- **Recommencer** (`restartReview()`) : efface le `localStorage`, pré-remplit le formulaire avec les anciennes données, fait défiler jusqu'au formulaire.
- **Supprimer** (`confirmDeleteReview()`) : efface le `localStorage` + supprime l'avis du feed live, réinitialise le formulaire vide.
- Un dialog de confirmation s'affiche avant la suppression définitive.
- Boutons bilingues (clés T : `btnRestart`, `btnDelete`, `deleteConfirmMsg`, `btnYes`, `btnNo`).

### Filtres et tri
- Filtres : All / ★★★★★ / ★★★★ / Verified Only
- Tri : Most Recent (défaut) / Highest Rated
- Pagination : 12 avis par page, bouton "Load More"

### Webhook Discord (reviews)
- Configuré via `window.PBS_WEBHOOK = ''` dans la page, avant le chargement de `reviews-data.js`
- La fonction `sendToDiscord(rev, promoCode)` est définie dans `reviews-data.js`

---

## 📦 Livraison

- **Canada** — Purolator, gratuit, 1–3 jours ouvrables, sans signature
- **International** — FedEx, tarifs variables (contact Telegram d'abord)
- Dépôt quotidien : 14 h – 18 h
- Confirmation avant 13 h → expédition le jour même
- Suivi par SMS (numéro Purolator)

---

## 📸 Images (à ajouter)

Les photos produit sont des **placeholders** dans `product-info.html`. Pour les remplacer :

```html
<!-- Remplacer ce div -->
<div class="photo-placeholder">
  <span class="ph-lbl" id="ph-lbl1">Front — $100 PROP</span>
</div>

<!-- Par ceci -->
<div class="photo-slot">
  <img src="../assets/images/front-100.jpg" alt="Prop Bill $100 — Front">
</div>
```

Formats recommandés : `.webp` (qualité 85), max 1400px de large.

---

## 🔧 Modifications courantes

### Changer le prix d'un pack
→ `index.html` → objet `PACKS` → modifier `price`

### Changer l'adresse Bitcoin/Zcash
→ `index.html` → constantes `BTC` et `ZEC` en haut du `<script>`

### Changer l'adresse du webhook Discord (commandes)
→ `index.html` → constante `WH` en haut du `<script>`

### Changer l'adresse du webhook Discord (avis)
→ `reviews.html` → `window.PBS_WEBHOOK = 'TON_WEBHOOK'` (ligne avant le chargement de `reviews-data.js`)

### Changer le handle Telegram
→ Chercher `@propbillsofficial1` dans tous les fichiers (4 occurrences)

### Modifier la base de données d'avis
→ `assets/js/reviews-data.js` → fonction `buildDatabase()` → tableau d'objets review

### Ajouter une nouvelle page
1. Créer `pages/ma-page.html`
2. Ajouter dans le `<head>` :
   ```html
   <link rel="stylesheet" href="../assets/css/shared.css">
   ```
3. Ajouter avant `</body>` :
   ```html
   <script src="../assets/js/shared.js"></script>
   ```
4. Utiliser les classes de `shared.css` pour le nav, les boutons, etc.

### Modifier un texte affiché sur plusieurs pages
Si le même texte apparaît sur plusieurs pages, il faut le modifier dans **chaque** fichier concerné (pas de système de templates côté serveur — site statique pur).

---

## 🧩 Utilitaires `shared.js` (PBS namespace)

| Fonction | Description |
|---|---|
| `PBS.switchLang(l)` | Change la langue + met à jour les boutons toggle + sauvegarde dans `localStorage` |
| `PBS.checkRateLimit()` | Retourne `true` si la soumission est permise (max 2/heure). Enregistre dans `localStorage`. |
| `PBS.sendDiscordEmbed(url, content, fields)` | Envoie un embed à un webhook Discord |
| `PBS.cap(s, max)` | Tronque une chaîne pour les champs Discord (max 1000 chars). Retourne `'---'` si vide. |
| `PBS.formatDate(d)` | Formate une date selon la langue (`fr-CA` ou `en-CA`) |
| `G(id)` | Raccourci pour `document.getElementById` |
| `setText(id, val)` | Met à jour `textContent` d'un élément par id |
| `setHTML(id, val)` | Met à jour `innerHTML` d'un élément par id |

---

## 🚀 Déploiement GitHub Pages

1. Push ce dossier à la racine d'un repo GitHub
2. Aller dans **Settings → Pages → Source** → sélectionner `main` / `root`
3. Le site sera disponible à `https://[username].github.io/[repo]/`
4. `index.html` à la racine = page d'accueil automatique ✅

> **Note :** GitHub Pages est un hébergement **statique**. Il n'y a pas de back-end. Les commandes vont directement sur Discord via webhook.

---

## ⚠️ Points d'attention

- **Ne jamais** committer les vraies adresses crypto ou les webhooks Discord dans un repo **public**.
- Le `WH` (webhook Discord commandes) est codé en dur dans `index.html` — remplacer par une variable ou un service proxy si le repo devient public.
- `window.PBS_WEBHOOK` (webhook Discord reviews) est dans `reviews.html` — même précaution.
- Le site est entièrement **statique** — aucun serveur, aucune base de données, aucun cookie de tracking.
- `reviews-data.js` doit être chargé **après** `window.PBS_WEBHOOK = '...'` dans `reviews.html`.
- La clé `localStorage` pour les avis est `pbs_my_review_v3` — si tu changes le schéma d'un avis, incrémente la version pour éviter les conflits avec des avis anciens.

---

## 📝 Historique des modifications

### Session — Migration vers V5

**Contexte :** Le projet a été migré du dossier V4 au dossier V5. Tous les fichiers de documentation (Claude.md, Antigravity.md) et les commentaires de code ont été mis à jour pour refléter la nouvelle version.


### Session — Ajout de 403 reviews (reviews-data.js)

**Fichier modifié :** `assets/js/reviews-data.js`

**Changements :**
- **403 nouveaux avis ajoutés** dans le tableau `MASTER` (total : 1323 entrées, était 920)
- Les nouveaux avis respectent toutes les règles du fichier :
  - ~80% anglais, ~20% français
  - 95% cinq étoiles, ~5% quatre étoiles (seulement pour un délai d'une journée)
  - Prénoms simples, sans trait d'union ni trait de soulignement
  - ~50% reviews courtes (sous 15 mots), ~50% plus détaillées
  - Aucun em-dash, aucune mention UV
- Le motif de rotation (`pattern`) dans `buildDatabase()` a été étendu pour inclure des valeurs 5 et 6, permettant 1 à 6 avis par jour (était 1 à 4)
- Le cycle couvre ~360 jours avec en moyenne ~3.7 avis/jour
- Commentaires du fichier mis à jour (nombre d'entrées, description du motif)

### Session — Correction du webhook Discord (reviews.html + reviews-data.js)

**Problème :** Les reviews soumises par les clients n'arrivaient pas sur Discord.

**Cause :** `window.PBS_WEBHOOK` était une chaîne vide (`''`) dans `reviews.html`. La fonction `sendToDiscord` vérifie `if(!wh) return;` donc elle abandonnait silencieusement sans rien envoyer.

**Fichiers modifiés :**

1. `reviews.html` — Le webhook est maintenant défini :
   ```js
   window.PBS_WEBHOOK = 'https://discord.com/api/webhooks/1498005946985615372/...';
   ```

2. `reviews-data.js` — `sendToDiscord` amélioré :
   - Envoie **tous** les avis, approuvés ou non (c'était déjà le cas mais maintenant le statut est clair)
   - Embed coloré : 🟢 vert pour les avis vérifiés, 🟡 orange pour les avis en attente
   - Champ `Status` explicite dans l'embed Discord

**Pour changer le webhook à l'avenir :**
→ `reviews.html` → ligne `window.PBS_WEBHOOK = '...'` juste avant le chargement de `reviews-data.js`

### Session — Ajout des packs Mid et Large (index.html + reviews.html)

**Contexte :** Ajout de 2 nouveaux packs entre le Pro Pack et le Bulk Pack, avec une grille de prix cohérente (prix/billet strictement décroissant sur toute la ligne).

**Grille de prix complète après modification :**

| Pack | Bundles | Bills | Prix | Prix/billet |
|---|---|---|---|---|
| Sample | 3 | 150 | 120 $ | 0.800 $ |
| Standard | 8 | 400 | 210 $ | 0.525 $ |
| Pro | 16 | 800 | 350 $ | 0.438 $ |
| Mid *(nouveau)* | 25 | 1 250 | 520 $ | 0.416 $ |
| Large *(nouveau)* | 40 | 2 000 | 760 $ | 0.380 $ |
| Bulk | 60 | 3 000 | 1 050 $ | 0.350 $ |

**Fichiers modifiés :**

1. `index.html`
   - Tableau `PACKS` : ajout de `{id:'md', size:1250, bundles:25, price:520, star:false, en:"Mid Pack", fr:"Pack Mid"}` et `{id:'lg', size:2000, bundles:40, price:760, star:false, en:"Large Pack", fr:"Pack Large"}` entre le Pro Pack et le Bulk Pack
   - Footer HTML : ajout des `<li id="fp4">Mid</li>` et `<li id="fp5">Large</li>` (Bulk devient `fp6`)
   - Traductions `T.en` : ajout de `fp4`, `fp5`, `fp6` (ancien `fp4` Bulk devient `fp6`)
   - Traductions `T.fr` : idem
   - Fonction `applyLang()` : ajout de `TT('fp5',v.fp5); TT('fp6',v.fp6);`

2. `reviews.html`
   - `<select id="r-pack">` : ajout des options Mid Pack (1 250 bills) et Large Pack (2 000 bills)

**Pour modifier les prix à l'avenir :**
→ `index.html` → tableau `PACKS` → modifier `price`, `bundles`, `size` du pack concerné
→ Ne pas oublier de maintenir la cohérence du prix/billet décroissant sur toute la ligne

### Session — Mid Pack comme "Most Popular" + champ code promo + structure de dossiers corrigée

**Fichiers modifiés :**

1. `index.html`
   - Mid Pack (`id:'md'`) passe à `star:true` — il est maintenant affiché comme "Most Popular" (Pro Pack redevient `star:false`)
   - Ajout du champ **Code promo** dans le formulaire de commande (entre Notes et Instructions de paiement)
     - Format valide : `PBS10-XXXX` (généré par le système d'avis)
     - Validation visuelle en temps réel (vert = valide, orange = non reconnu)
     - Le code promo est transmis dans l'embed Discord si renseigné (champ "🎟️ Promo Code")
     - Nouvelles clés de traduction : `lbPromo`, `lbPromoOpt`, `promoValid`, `promoInvalid` (EN + FR)
     - Nouvelle fonction `validatePromoDisplay()` dans le script
   - Chemins QR corrigés : `assets/images/Screenshot_20260419-204609.png` et `assets/images/zcash-qr.png`
   - Liens vers sous-pages déjà corrects : `pages/product-info.html`, `pages/delivery-info.html`, `pages/reviews.html`

2. `assets/images/` — 6 photos produit + vidéo ajoutées :
   - `20s1.jpg`, `20s2.jpg` — Billet $20 recto/verso
   - `50s1.jpg`, `50s2.jpg` — Billet $50 recto/verso
   - `100s1.jpg`, `100s2.jpg` — Billet $100 recto/verso
   - `video1.mp4` — Vidéo produit

**Structure de dossiers corrigée (finale) :**
```
prop-bills-shop/
├── index.html                  ← Page principale
├── pages/
│   ├── product-info.html
│   ├── reviews.html
│   └── delivery-info.html
├── assets/
│   ├── css/
│   │   └── shared.css
│   ├── js/
│   │   ├── shared.js
│   │   └── reviews-data.js
│   └── images/
│       ├── 20s1.jpg / 20s2.jpg
│       ├── 50s1.jpg / 50s2.jpg
│       ├── 100s1.jpg / 100s2.jpg
│       ├── video1.mp4
│       ├── Screenshot_20260419-204609.png  ← QR BTC
│       └── zcash-qr.png                   ← QR ZEC
├── claude.md
├── claude2.md                  ← Historique complet des conversations
└── README.md
```

**Note importante — QR codes :**
Les fichiers `Screenshot_20260419-204609.png` (QR BTC) et `zcash-qr.png` (QR ZEC) doivent être placés dans `assets/images/`. Ils n'ont pas été fournis dans cette session — à ajouter manuellement.
