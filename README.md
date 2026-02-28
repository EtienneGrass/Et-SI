# Et-SI — Simulateur de Réformes de Politiques Publiques

**Et si…** on pouvait tester l'impact d'une réforme avant de la mettre en oeuvre ?

Et-SI est une application mobile (PWA) conversationnelle d'analyse d'impact de politiques publiques françaises. Décrivez une réforme en langage naturel et obtenez une analyse structurée, quantifiée et traçable.

---

## Ce que fait Et-SI

1. **Analyse par personas** — Impact concret sur 20 profils types (de l'étudiante boursière au cadre supérieur)
2. **Analyse microéconomique** — Effets sur les ménages (par décile), entreprises, comportements
3. **Analyse macroéconomique** — PIB, emploi, finances publiques, environnement, santé
4. **Projection temporelle** — Impacts à 1 an, 3 ans et 10 ans
5. **Traçabilité** — Chaque chiffre avec ses hypothèses, sources et niveau de confiance

## Démarrage rapide

### Prérequis

- **Node.js** >= 18
- Une **clé API Anthropic** (Claude)

### Installation

```bash
git clone https://github.com/EtienneGrass/Et-SI.git
cd Et-SI
npm install
```

### Lancement

```bash
# Option 1 : clé API en variable d'environnement
ANTHROPIC_API_KEY=sk-ant-... npm start

# Option 2 : fichier .env
cp .env.example .env
# Éditez .env avec votre clé
npm start
```

L'app est accessible sur `http://localhost:3000`.

Vous pouvez aussi configurer la clé API directement dans l'app (Paramètres) — elle est stockée localement sur l'appareil.

### Installation sur smartphone

1. Ouvrez `http://votre-serveur:3000` dans le navigateur de votre téléphone
2. **iOS** : Safari > Partager > « Sur l'écran d'accueil »
3. **Android** : Chrome > Menu > « Ajouter à l'écran d'accueil »

L'app s'installe comme une application native (PWA).

### Déploiement

L'app peut être déployée sur n'importe quel hébergeur Node.js :

- **Railway** / **Render** / **Fly.io** : connectez le repo, variable `ANTHROPIC_API_KEY`
- **VPS** : `npm start` derrière un reverse proxy (nginx/caddy)
- **Docker** : voir ci-dessous

```bash
# Docker (optionnel)
docker build -t et-si .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=sk-ant-... et-si
```

## Structure du projet

```
Et-SI/
├── server/
│   └── index.js                    # Serveur Express + proxy Claude API (SSE streaming)
├── public/
│   ├── index.html                  # App shell (mobile-first)
│   ├── css/style.css               # Styles responsive
│   ├── js/
│   │   ├── app.js                  # Logique chat + streaming + rendu markdown
│   │   └── config.js               # Données personas embarquées
│   ├── icons/icon.svg              # Icône PWA
│   ├── manifest.json               # Manifest PWA
│   └── sw.js                       # Service Worker (cache offline)
├── prompt/
│   ├── system_prompt.md            # Prompt système (coeur du modèle)
│   ├── personas.json               # 20 profils types détaillés
│   └── economic_framework.json     # Cadre d'analyse économique
├── examples/
│   ├── 01_pnns_alimentation.md
│   ├── 02_circuits_courts.md
│   ├── 03_tarification_sociale_transports.md
│   └── 04_train_vs_avion.md
├── package.json
└── .env.example
```

## Les 20 personas

| # | Nom | Profil | Décile | Localisation |
|---|---|---|---|---|
| 1 | Inès | Étudiante boursière | D1 | Ville universitaire |
| 2 | Karim | Jeune actif CDI | D5 | Grande métropole |
| 3 | Nathalie | Ouvrière qualifiée | D4 | Périurbain industriel |
| 4 | Stéphane | Cadre intermédiaire | D7 | Métropole régionale |
| 5 | Isabelle | Cadre supérieure | D9 | Paris |
| 6 | Jean-Marc | Artisan plombier | D6 | Ville moyenne |
| 7 | Marie-Claire | Agricultrice | D3 | Zone rurale |
| 8 | Olivier | Médecin libéral | D9 | Ville moyenne |
| 9 | Fatima | Fonctionnaire cat. C | D3 | Banlieue métropole |
| 10 | Claire | Enseignante (cat. A) | D6 | Métropole régionale |
| 11 | Dylan | Intérimaire précaire | D2 | Petite ville |
| 12 | Sandra | Parent isolé aide-soignante | D3 | Banlieue ville moyenne |
| 13 | Marcel | Retraité modeste | D2 | Zone rurale |
| 14 | Françoise | Retraitée aisée | D8 | Centre-ville métropole |
| 15 | Philippe | Chômeur longue durée | D1 | Périphérie ville moyenne |
| 16 | Amandine | Cheffe d'entreprise TPE | D7 | Métropole régionale |
| 17 | Sylvie et Bruno | Famille nombreuse | D5 | Périurbain |
| 18 | Thomas | Handicap (AAH) | D2 | Ville moyenne |
| 19 | Lucie | Travailleuse frontalière | D8 | Pays de Gex |
| 20 | Sofiane | Auto-entrepreneur livreur | D2 | Banlieue métropole |

## Niveaux de confiance

- 🟢 **Solide** — Données empiriques directes (INSEE, DREES, études robustes)
- 🟡 **Raisonnable** — Extrapolation fondée (élasticités analogues, consensus d'experts)
- 🔴 **Exploratoire** — Estimation à dire d'expert, incertitude forte

## Limites

- Les résultats sont des **ordres de grandeur**, pas des prévisions précises
- Le modèle repose sur des **élasticités moyennes** qui peuvent varier selon le contexte
- Les **effets de long terme** (10 ans) sont par nature plus incertains
- Le modèle ne remplace pas une **étude d'impact réglementaire** ni une **évaluation économétrique complète**
- Les interactions entre réformes simultanées ne sont pas modélisées
