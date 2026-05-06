# Notes de Développement & Architecture (Antigravity)

**Version actuelle : V5**

Ce document centralise les choix architecturaux, les esthétiques et le fonctionnement logique du projet "PROP CANADA Premium".

## 1. Philosophie du Design "Dark Gold"
L'objectif principal du nouveau design est de créer un effet "WOW" dès les premières secondes.
*   **Couleurs :** Noir profond (`#050505`) et Or (`#D4AF37`) pour instaurer la confiance et un sentiment de richesse.
*   **Typographie :** *Cinzel* pour les titres (effet institutionnel, luxueux) et *Inter* pour les textes (lisibilité moderne).
*   **Animations :**
    *   **Particules d'Or (Antigravity/Canvas) :** Au lieu d'étoiles statiques, nous utilisons un script (voir `script.js`) qui génère une "poussière d'or" flottante. Le mouvement est lent et ascendant pour créer un côté magique.
    *   **Texte Scintillant (Glint) :** Le grand titre "PROP CANADA" a une animation CSS (`animation: shine 5s`) qui donne l'illusion qu'un reflet de lumière passe sur l'or.

## 2. Structure du Code
### Fichiers Principaux
*   `index.html` : Contient la structure (Hero, Vidéo, Nav, Modals).
*   `style.css` : Tout le design Dark Gold, incluant le support des Modals et du nouveau Panier flottant.
*   `script.js` : Ce fichier est le cerveau du site. Il gère :
    1. L'effet Canvas des particules.
    2. La logique bilingue (`lang='en'` ou `'fr'`).
    3. La génération dynamique des articles de la boutique (`renderPacks()`).
    4. Le constructeur de liasses (Builder) et le Panier (Cart).
    5. Le convertisseur Crypto via CoinGecko.
    6. L'envoi des commandes via Webhook.

## 3. Éléments E-Commerce
Nous avons migré avec succès les anciens outils de vente vers la nouvelle charte graphique :
*   **Le Panier (Sticky Bar) :** Transformé en barre flottante en bas de page pour améliorer l'ergonomie sur mobile et bureau.
*   **Les Packs :** Générés sans images, mais avec un effet "Placeholder Premium" utilisant des chiffres romains.

## 4. Outils de Développement Futurs
Si vous souhaitez faire évoluer ce projet, voici ce qu'il faut garder à l'esprit :
*   **Ajout d'un nouveau pack :** Modifiez simplement le tableau `PACKS` dans `script.js` et mettez à jour l'objet de traduction `T`.
*   **Changement de vidéo :** Remplacez le fichier `image/video1.mp4`. Si la vidéo est trop claire, ajustez l'opacité du `.video-overlay` dans `style.css` pour garantir que le texte blanc reste lisible par-dessus.
