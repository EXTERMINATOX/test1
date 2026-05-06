# TODO List - PROP CANADA

Ce fichier répertorie les tâches à accomplir pour amener le projet à son stade final de production, ainsi que les pistes d'amélioration pour le futur.

## 🔴 Haute Priorité (Avant Lancement)
- [ ] **Tests de bout en bout (E2E)** : Simuler le parcours complet d'un client, de l'arrivée sur le site à l'envoi de la preuve de paiement sur Telegram, pour vérifier qu'aucun bug bloquant n'existe.
- [ ] **Vérification du Webhook Discord** : S'assurer que les clés (URLs) Discord configurées dans `index.html` (pour les commandes) et `reviews.html` (pour les avis) pointent vers vos serveurs actifs et non vers des serveurs de test.
- [ ] **Images Définitives** : Remplacer toutes les images de la page `product-info.html` par de vraies photos des liasses (recto, verso, bandes de sécurité) et en haute qualité (WebP de préférence).
- [ ] **Vérification Mobile** : Tester intensivement l'affichage du panier (Sticky Bottom Bar) et du menu sur différents écrans mobiles (iPhone, Android).

## 🟡 Moyenne Priorité (Optimisations)
- [ ] **Performances** : Héberger la vidéo d'en-tête (`video1.mp4`) sur un CDN ou la compresser au format WebM pour accélérer le chargement initial.
- [ ] **SEO (Référencement)** : Ajouter des balises "Open Graph" (`<meta property="og:...">`) dans l'en-tête de toutes les pages HTML pour que le lien s'affiche joliment (avec une belle image) lorsqu'il est partagé sur Telegram, Discord ou Twitter.
- [ ] **Sécurisation du Webhook** : Créer une fonction "Serverless" (Netlify Functions ou Cloudflare Workers) pour masquer définitivement l'URL de vos webhooks Discord. Actuellement, ils sont encodés en Base64 dans le code, ce qui est une protection faible contre un scraping avancé.

## 🟢 Basse Priorité (Futur)
- [ ] **Animations Avancées** : Ajouter un effet de "parallaxe" sur les images de la page Produit pour un effet encore plus premium.
- [ ] **Système de Gestion** : Mettre en place un vrai backend si le volume de commandes devient trop difficile à gérer via Discord.
- [ ] **Intégration d'autres Cryptos** : Ajouter Ethereum (ETH) ou Monero (XMR) comme moyens de paiement alternatifs si la demande client se fait sentir.
