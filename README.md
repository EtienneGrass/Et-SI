# Et-SI — Simulateur de Réformes de Politiques Publiques

**Et si…** on pouvait tester l'impact d'une réforme avant de la mettre en œuvre ?

Et-SI est un modèle conversationnel d'analyse d'impact de politiques publiques françaises. Il prend en entrée la description informelle d'une réforme et produit une analyse structurée, quantifiée et traçable.

---

## Ce que fait Et-SI

À partir d'une description en langage naturel d'une réforme, le modèle produit :

1. **Analyse par personas** — Impact concret sur 20 profils types représentatifs de la société française (étudiante, ouvrier, cadre, agricultrice, retraitée, parent isolé, etc.)
2. **Analyse microéconomique** — Effets sur les ménages (par décile), entreprises, comportements de consommation, marchés
3. **Analyse macroéconomique** — PIB, emploi, finances publiques, environnement, santé publique, inégalités
4. **Projection temporelle** — Impacts à 1 an, 3 ans et 10 ans
5. **Traçabilité complète** — Chaque chiffre est accompagné de ses hypothèses, sources et niveau de confiance

## Structure du projet

```
Et-SI/
├── README.md                                    # Ce fichier
├── prompt/
│   ├── system_prompt.md                         # Prompt système (cœur du modèle)
│   ├── personas.json                            # 20 profils types détaillés
│   └── economic_framework.json                  # Cadre d'analyse économique
└── examples/
    ├── 01_pnns_alimentation.md                  # PNNS et comportements alimentaires
    ├── 02_circuits_courts.md                     # Circuits courts alimentaires (7→17%)
    ├── 03_tarification_sociale_transports.md     # Tarification selon le revenu
    └── 04_train_vs_avion.md                      # Taxe avion + subvention train
```

## Comment utiliser Et-SI

### 1. Charger le prompt système

Utilisez le contenu de `prompt/system_prompt.md` comme **system prompt** dans votre interface LLM (Claude, ChatGPT, ou autre). Le modèle fonctionnera mieux avec un LLM capable de raisonnement structuré et de calculs (Claude Opus ou GPT-4 recommandés).

### 2. Charger les données de référence

Fournissez en contexte (ou en pièce jointe) les fichiers :
- `prompt/personas.json` — pour l'analyse par cas types
- `prompt/economic_framework.json` — pour les paramètres économiques et les élasticités

### 3. Décrire votre réforme

Décrivez la réforme en langage naturel. Le modèle vous demandera des précisions si nécessaire. Exemples d'entrées :

> « Et si 50 % des adultes suivaient les recommandations du PNNS ? »

> « Et si les circuits courts passaient de 7 à 17 % de la consommation alimentaire ? »

> « Et si le prix des transports en commun dépendait du revenu ? »

> « Et si on taxait l'avion de 15 € pour baisser le prix du train ? »

### 4. Itérer

Après la première analyse, vous pouvez :
- Modifier un paramètre (« Et si c'était 30 % au lieu de 50 % ? »)
- Zoomer sur un persona (« Détaille l'impact pour Marie-Claire l'agricultrice »)
- Comparer deux variantes (« Compare la taxe à 15 € vs 25 € »)

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

Le modèle classe chaque estimation selon trois niveaux :

- 🟢 **Solide** — Données empiriques directes (INSEE, DREES, études robustes)
- 🟡 **Raisonnable** — Extrapolation fondée (élasticités analogues, consensus d'experts)
- 🔴 **Exploratoire** — Estimation à dire d'expert, incertitude forte

## Limites

- Les résultats sont des **ordres de grandeur**, pas des prévisions précises
- Le modèle repose sur des **élasticités moyennes** qui peuvent varier selon le contexte
- Les **effets de long terme** (10 ans) sont par nature plus incertains
- Le modèle ne remplace pas une **étude d'impact réglementaire** ni une **évaluation économétrique complète**
- Les interactions entre réformes simultanées ne sont pas modélisées

## Licence

Ce projet est un outil d'aide à la réflexion sur les politiques publiques.
