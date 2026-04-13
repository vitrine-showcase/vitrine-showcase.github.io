import Category from '../../models/Category';
import Page from '../../models/Page';

/* eslint-disable max-len */
export default {
  App: {
    title: 'Vitrine démocratique',
  },
  About: {
    eyebrow: 'CAPP · Université Laval',
    title: 'La Vitrine Démocratique',
    description: 'La Vitrine mesure ce qui occupe vraiment l\'espace public et te le montre tel quel.',
    mission: {
      heading: 'Pourquoi la Vitrine existe',
      p1: 'Nous vivons dans une époque d\'abondance informationnelle qui produit, paradoxalement, un appauvrissement de ce que nous avons en commun. Les algorithmes optimisent pour l\'engagement, c\'est-à-dire pour ce qui nous fait réagir, pas nécessairement pour ce qui compte.',
      p2: 'Ce que nous avons perdu, c\'est le monde commun, soit l\'ensemble de faits, d\'enjeux et de préoccupations qui font qu\'une société peut débattre, choisir, se gouverner. La Vitrine Démocratique constitue une réponse à ce problème et un point d\'ancrage rigoureux. Elle rend visible ce qui occupe réellement l\'espace public, mesuré sans filtre algorithmique.',
      quote: 'La Vitrine Démocratique, c\'est l\'actualité telle qu\'elle existe dans l\'espace public. Pas telle que l\'algorithme l\'a choisie pour toi.',
    },
    institution: {
      heading: 'L\'institution',
      text: 'La Vitrine est une initiative du Centre d\'analyse des politiques publiques (CAPP) et de la Chaire de leadership en enseignement des sciences sociales numériques (CLESSN) de l\'Université Laval, sous la direction du professeur Yannick Dufresne. Les données sont collectées et entreposées au Québec, dans les serveurs de l\'Université Laval, selon les autorisations éthiques les plus strictes.',
    },
    team: {
      heading: 'L\'équipe',
    },
  },
  Contact: {
    eyebrow: 'CAPP · CLESSN',
    title: 'Contact',
    description: 'Faites-nous parvenir vos questions, commentaires ou demandes d\'accès aux données.',
  },
  Partners: {
    eyebrow: 'Vitrine Démocratique',
    title: 'Partenaires',
    description: 'Merci aux partenaires qui rendent possible la Vitrine Démocratique.',
    academic: {
      heading: 'Partenaires académiques',
    },
    industry: {
      heading: 'Collaborateurs',
    },
  },
  Methodology: {
    eyebrow: 'Vitrine Démocratique',
    title: 'Méthodologie',
    description: 'Comment nous mesurons les trois piliers de l\'espace public québécois.',
    overview: {
      heading: 'Vue d\'ensemble',
      text: 'La Vitrine agrège en continu des données provenant de trois sources distinctes — les médias, les discours parlementaires et l\'opinion publique — pour produire un portrait objectif de ce qui occupe l\'espace public. Chaque source est traitée par un algorithme dédié, validé par des chercheurs en sciences politiques.',
    },
    media: {
      eyebrow: 'Médias',
      title: 'Saillance médiatique',
      text: 'Les manchettes des principaux médias québécois sont collectées en continu. Un indice de saillance mesure la présence relative de chaque sujet dans la couverture médiatique, pondérée par la source et le moment de publication.',
    },
    authorities: {
      eyebrow: 'Décideurs',
      title: 'Parole en chambre',
      text: 'Les interventions parlementaires à l\'Assemblée nationale et à la Chambre des communes sont extraites automatiquement. L\'indice mesure quelle fraction du discours politique est consacrée à chaque enjeu, par parti et par période.',
    },
    citizens: {
      eyebrow: 'Citoyens',
      title: 'Opinion publique',
      text: 'Des sondages quotidiens menés en ligne auprès des Québécois mesurent leurs préoccupations et leurs positions sur les enjeux d\'actualité. Les résultats sont pondérés selon le genre, l\'âge et le niveau d\'éducation.',
    },
    ethics: {
      heading: 'Éthique et transparence',
      text: 'La CLESSN détient les autorisations éthiques les plus strictes. Les données sont collectées et entreposées au Québec, dans les serveurs de l\'Université Laval. Aucune donnée personnelle n\'est utilisée pour les indices de saillance médiatique ou parlementaire.',
    },
    download: {
      heading: 'Documentation complète',
      label: 'Télécharger la méthodologie',
    },
  },
  AppLanguage: {
    current: {
      long: 'Français',
      short: 'Fr',
    },
    other: {
      long: 'English',
      short: 'En',
    },
  },
  Category: {
    [Category.COMMON]: {
      about: 'À propos de ce graphique',
      description: "La Vitrine Démocratique mesure ce qui occupe vraiment l'espace public, et te le montre tel quel. Suis la couverture des <mark className='radarplus-mark'>médias</mark>, le discours des <mark className='agoraplus-mark'>décideurs</mark> et l'opinion des <mark className='civimetreplus-mark'>citoyens</mark>.",
      main: '',
      teaser: "Une vitrine sur <span>l'espace public.</span>",
      tooltip: '',
      callToAction: `Nos analyses
"Category.common.slug`,
      title: '',
    },
    [Category.AUTHORITIES]: {
      cta: 'Nos analyses',
      description: 'Suis le discours des <span>décideurs</span> : élus, ministres et partis politiques. Vois quels enjeux ils placent au centre de leurs interventions publiques.',
      main: '',
      teaser: 'Ce que disent les <span>décideurs</span>',
      title: 'Décideurs',
      articles: {
        teaser: 'Nos dernières analyses sur les décideurs',
      },
      callToAction: 'Nos analyses',
      more: 'En savoir plus',
      optimist: 'Humeur des décideurs',
      pessimist: 'Humeur des décideurs',
      methodologyAnchor: 'décideurs-publics',
    },
    [Category.MEDIA]: {
      cta: 'Nos analyses',
      description: "Découvre ce que les <span>médias québécois</span> mettent à l'avant-plan : quels enjeux dominent leur couverture et comment ils en parlent.",
      main: '',
      teaser: 'Ce que <span>couvrent</span> les <span>médias</span>',
      title: 'Médias',
      articles: {
        teaser: 'Nos dernières analyses sur les médias',
      },
      callToAction: 'Nos analyses',
      more: 'En savoir plus',
      optimist: 'Humeur des médias',
      pessimist: 'Humeur des médias',
      methodologyAnchor: 'médias',
    },
    [Category.PUBLIC_OPINION]: {
      cta: 'Nos analyses',
      description: "Mesure ce que pensent les <span>Québécois.es</span> : leurs préoccupations, leurs positions et leur rapport à l'actualité commune.",
      main: '',
      teaser: 'Ce que pensent les <span>Québécois.es</span>',
      title: 'Citoyens',
      articles: {
        teaser: 'Nos dernières analyses sur les citoyens',
      },
      callToAction: 'Nos analyses',
      more: 'En savoir plus',
      optimist: 'Humeur des citoyens',
      pessimist: 'Humeur des citoyens',
      methodologyAnchor: 'opinion-publique',
    },
    noData: {
      button: {
        survey: 'Répondre au questionnaire',
      },
      text: `Joignez votre voix à celles des autres Québécois.es et donnez votre opinion sur la gestion de la crise de la COVID-19.

Vos réponses permettront d'atteindre le Quorum!`,
    },
  },
  FooterLegal: {
    conditions: "Politique d'utilisation",
    copyright: '©2025 Vitrine Démocratique',
    privacy: 'Politique de confidentialité',
  },
  HomeChart: {
    yAxis: {
      down: 'Pessimisme ▼',
      up: 'Optimisme ▲',
    },
  },
  HomeChartDetails: {
    [Category.AUTHORITIES]: 'Humeur des décideurs',
    [`${Category.AUTHORITIES}Soon`]: 'Humeur des décideurs: à venir',
    [Category.PUBLIC_OPINION]: 'Humeur des citoyens',
    [`${Category.PUBLIC_OPINION}Soon`]: 'Humeur des citoyens: à venir',
    [Category.MEDIA]: 'Humeur des médias',
    [`${Category.MEDIA}Soon`]: 'Humeur des médias: à venir',
  },
  PartisModule: {
    eyebrow: 'Voix des partis',
    title: 'La voix des partis',
    provincial: 'Provincial',
    federal: 'Fédéral',
    source: 'Source : Analyse médiatique, couverture pondérée par enjeu',
    loading: 'Chargement...',
    error: 'Impossible de charger les données.',
  },
  EnjuModule: {
    eyebrow: 'Enjeux du moment',
    source: 'Source : Analyse médiatique, saillance par enjeu',
    loading: 'Chargement...',
    error: 'Impossible de charger les données.',
  },
  ConstellationModule: {
    eyebrow: 'Relations médiatiques',
    title: 'La constellation médiatique',
    countries: { QC: 'Québec', CAN: 'Canada' },
    description: 'Les objets les plus saillants dans la couverture médiatique et leurs liens de co-occurrence.',
    loading: 'Chargement...',
    meta: {
      count: 'nombre dans le cercle = articles',
      nodeSize: 'taille = importance',
      edge: 'lien = mentionnés ensemble',
    },
    source: 'Source : Analyse médiatique, co-occurrence par objet',
    panel: {
      hint: 'Cliquez sur un objet pour voir les titres associés',
    },
    tooltip: {
      coverage: 'score de saillance',
    },
  },
  MediaTicker: {
    label: 'Unes',
    loading: 'Chargement...',
  },
  CategoryTop20: {
    eyebrow: 'Top 20',
    countryToggle: 'Choisir le pays',
    countries: { QC: 'Québec', CA: 'Canada' },
  },
  ParoleEnChambre: {
    eyebrow: 'La Parole en chambre',
    hook: 'En ce moment, les élus débattent de',
    assemblyToggle: 'Choisir l\'assemblée',
    assemblies: { QC: 'Québec', FED: 'Fédéral' },
    saillance: {
      label: 'À quel point on en débat',
      marginal: 'À peine',
      notable: 'Assez',
      fort: 'Beaucoup',
      sature: 'Partout',
    },
    velocity: {
      upStrong: '↑↑ En explosion',
      up: '↑ En hausse',
      stable: '→ Stable',
      down: '↓ En recul',
      downStrong: '↓↓ En chute',
    },
    interventions: 'interv.',
    debatsLink: 'Voir le Top 20 →',
    nextSession: 'Prochaine :',
    loading: 'Chargement...',
    error: 'Impossible de charger les données.',
  },
  CouverturePartisModule: {
    eyebrow: 'Couverture partisane',
    title: 'La couverture des partis politiques',
    scopes: { provincial: 'Québec', federal: 'Canada' },
    description: "Mesure la part de couverture médiatique accordée à chaque parti politique dans l'actualité récente.",
    source: 'Source : Analyse médiatique, mentions par parti',
  },
  UneDesUnes: {
    eyebrow: 'La Une des Unes',
    hook: 'En ce moment, les médias parlent de',
    countryToggle: 'Choisir le pays',
    countries: {
      QC: 'Québec',
      CA: 'Canada',
    },
    saillance: {
      label: 'À quel point on en parle',
      marginal: 'À peine',
      notable: 'Assez',
      fort: 'Beaucoup',
      sature: 'Partout',
    },
    velocity: {
      upStrong: '↑↑ En explosion',
      up: '↑ En hausse',
      stable: '→ Stable',
      down: '↓ En recul',
      downStrong: '↓↓ En chute',
    },
    radarLink: 'Voir le Top 20 →',
    notCovering: 'Pas de Une sur cet enjeu',
    nextUpdate: 'Prochain :',
    loading: 'Chargement...',
    error: 'Impossible de charger les données. Regénère headline-of-headlines.json.',
  },
  MediaTreemap: {
    eyebrow: 'Pouls médiatique',
    title: 'Pouls médiatique par enjeu',
    subtitle: "Une lecture éditoriale des enjeux qui dominent la couverture en ce moment. Chaque bloc représente la part relative de couverture d'un enjeu dans le flux des articles.",
    loading: 'Chargement du treemap depuis les données AWS locales...',
    error: 'Impossible de charger le treemap local. Relance le script du raffineur pour regénérer `public/data/media-treemap.json`.',
    controls: {
      ariaLabel: 'Période du treemap média',
      day: 'Jour',
      week: 'Semaine',
      month: 'Mois',
    },
    detail: {
      coverage: '{{score}} % de la couverture actuelle',
      compare: 'Point de comparaison : {{previous}} % au passage précédent',
      velocity: 'depuis 11:09',
    },
    rising: {
      title: 'En forte montée',
    },
    timeline: {
      title: 'Évolution',
      note: 'Source locale : {{table}} · généré le {{generatedAt}}',
    },
  },
  prototypePlaceholder: {
    common: {
      kicker: 'Prototype en préparation',
      title: 'La synthèse transversale arrive bientôt',
      text: 'Cette section est masquée dans le prototype public. Nous y intégrerons ensuite une vue consolidée alignée sur la nouvelle direction visuelle.',
    },
    publicOpinion: {
      kicker: 'Prototype en préparation',
      title: 'Le module citoyens n est pas activé dans cette démo',
      text: 'Pour cette version partageable, nous gardons le focus sur le treemap médias. Le contenu opinion publique sera reconnecté dans une itération séparée.',
    },
    authorities: {
      kicker: 'Prototype en préparation',
      title: 'Le module décideurs reste hors scope pour cette démonstration',
      text: 'Cette maquette GitHub Pages présente surtout la nouvelle expérience médias. La section décideurs sera réintégrée lorsqu une version complète sera prête.',
    },
  },
  MainAction: {
    survey: {
      text: 'Découvrez votre profil en répondant à notre questionnaire',
      button: 'Répondre au questionnaire',
    },
  },
  MainMenu: {
    title: 'Menu',
    close: 'Fermer',
  },
  MenuAsides: {
    profile: {
      login: 'Me connecter',
      signup: 'Me créer un nouveau compte',
      text: "Connectez-vous afin d'enregistrer vos résultats.",
    },
    survey: {
      button: 'Répondre au questionnaire',
      text: 'Découvrez votre profil en répondant à notre questionnaire',
    },
  },
  SiteMenus: {
    main: {
      [Category.AUTHORITIES]: 'Décideurs',
      [Category.MEDIA]: 'Médias',
      [Category.PUBLIC_OPINION]: 'Citoyens',
    },
    secondary: {
      [Page.ABOUT]: 'À propos',
      [Page.CONTACT]: 'Contact',
      [Page.METHODOLOGY]: 'Méthodologie',
      [Page.PARTNERS]: 'Partenaires',
    },
  },
  URL: {
    [Page.ABOUT]: 'a-propos',
    [Page.CATEGORY]: 'categorie',
    [Page.CONDITIONS]: 'conditions',
    [Page.CONTACT]: 'contact',
    [Page.LOGIN]: 'connexion',
    [Page.METHODOLOGY]: 'methodologie',
    [Page.PARTNERS]: 'partenaires',
    [Page.PRIVACY]: 'confidentialite',
    [Page.SIGNUP]: 'inscription',
    [Page.SURVEY]: 'questionnaire',
    categories: {
      [Category.AUTHORITIES]: 'agoraplus',
      [Category.MEDIA]: 'radarplus',
      [Category.PUBLIC_OPINION]: 'civimetreplus',
    },
  },
  ArticlePreview: {
    read: 'Lire',
  },
  Article: {
    author: 'Rédigé par {{author}}',
    back: 'Retour à nos analyses',
    publishedOn: 'Publié le {{date}}',
  },
  Content: {
    about: {
      eyebrow: 'CLESSN',
      markdown: `La Vitrine démocratique offre un point de rencontre pour l'ensemble de la société québécoise. Elle permet de prendre le pouls, en continu, des trois piliers de la démocratie que constituent les décideurs, les médias et les citoyens.

Grâce à de nombreux indicateurs macro-démocratiques avalisés par les recherches scientifiques récentes, la Vitrine permet de mesurer l'état de santé politique et social du Québec. Non seulement ces indicateurs sont étudiés de près par les chercheuses et chercheurs en science politique, ils sont également présentés en libre accès aux décideurs, aux médias et aux citoyens souhaitant en apprendre davantage sur leur démocratie.

La Vitrine démocratique est une initiative menée par la Chaire de leadership en enseignement des sciences sociales numériques (CLESSN) de l'Université Laval et son titulaire, le professeur Yannick Dufresne. La CLESSN est fière de détenir les autorisations éthiques les plus strictes, tel qu'attendu d'un outil scientifique. Elle est ainsi en mesure d'assurer la sécurité des données collectées et entreposées au Québec, dans les serveurs de l'Université Laval.

## L'équipe de la CLESSN

:::div{className="ContentPage-team-grid"}
Adrien Cloutier
:div[Scientifique de données]

Alexandre Côté
:div[Analyste de données]

Alexandre Fortier-Chouinard
:div[Scientifique de données]

Alexis Bibeau-Gagnon
:div[Scientifique de données]

Axel Déry
:div[Analyste de données]

Brian Thompson Collart
:div[Scientifique de données]

Camille Tremblay-Antoine
:div[Scientifique de données]

Catherine Ouellet
:div[Scientifique de données]

Cloé Girard-Poncet
:div[Analyste de données]

David Dumouchel
:div[Stagiaire postdoctoral]

François Gélineau
:div[Professeur titulaire]

Hubert Cadieux
:div[Analyste de données]

Jérémy Gilbert
:div[Analyste de données]

Justine Béchard
:div[Analyste de données]

Marc-André Bodet
:div[Professeur agrégé]

Marc-Antoine Rancourt
:div[Scientifique de données]

Maria Alexandrov
:div[Conseillère en communication]

Mathieu Ouimet
:div[Professeur titulaire]

Nadjim Fréchet
:div[Scientifique de données]

Olivier Banville
:div[Architecte de solutions de données]

Patrick Poncet
:div[Ingénieur des données]

William Poirier
:div[Analyste de données]

Yannick Dufresne
:div[Titulaire de la CLESSN]
:::`,
      title: 'À propos',
    },
    conditions: {
      markdown: `# Politique d'utilisation

En cochant les cases de consentement sur la page de création de comptes, vous confirmez avoir lu et accepté les conditions d'utilisation décrites dans cette page.

## Création de votre compte

En créant votre compte, vous vous engagez à :

"- Fournir des renseignements personnels véridiques (nom, prénom, etc.)`,
      title: "Politique d'utilisation",
    },
    contact: {
      eyebrow: 'CLESSN',
      markdown: `Faites-nous parvenir vos questions, commentaires et/ou demandes d'accès aux données pour les chercheurs à info@clessn.com.
`,
      title: 'Contact',
    },
    'mardown-demo': {
      markdown: `# Here are the different Markdown element that can be used

- Unordered lists
  - Sublist
    - SubSublist


1. Ordered lists
  1. SubOrdered list

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

- *Italic*
- **Bold**
- ~Strikethrough~
- [Links](#)
- Smart link: www.example.com, https://example.com, and contact@example.com.
- \`<span>Code</span>\`
- Images: ![Placeholder Image Alt text](https://via.placeholder.com/160x90)

| Header 1 | Header 2 | Header 3 |
| :------- | :------: | -------: |
| Left     | Center   | Right    |

\`\`\`
<span>
  Code block
</span>
\`\`\`

> Blockquote


- [x] Done
- [ ] Todo

---

# Accept Markdown directives

## Inline directives

\`:any-tag[any content]{any-attribute="any attribute content"}\`
will create an element like
\`<any-tag any-attribute="any attribute content Markup Language">any content</any-tag>\`

### Examples

\`:abbr[HTML]{title="HyperText Markup Language"}\`
will create an element like
\`<abbr title="HyperText Markup Language">HTML</abbr>\`
and will be displayed as
:abbr[HTML]{title="HyperText Markup Language"}

\`:mark[I'm dotted]{className="has-font-secondary"}\`
will create an element like
\`<mark className="has-font-secondary">I'm dotted</mark>\`
and will be displayed as
:mark[I'm dotted]{className="has-font-secondary"}

## Block directives

### Examples


\`\`\`
:::div{title="title"}
  ### Title

  Content
:::
\`\`\`
will create an element like
\`\`\`
<div title="title">
  <h3>Title</h3>
  <p>Content</p>
</div>
\`\`\`
and will be displayed as

:::div{title="title"}
  ### Title

  Content
:::


\`\`\`
:::figure
  ![Placeholder image](https://via.placeholder.com/1600x900)
:::figcaption
  ### Title

  Content
:::
\`\`\`
will create an element like
\`\`\`
<figure>
  <p>
    <img src="https://via.placeholder.com/1600x900" alt="Placeholder image">
  </p>
  <figcaption>
    <h3>Title</h3>
    <p>Content</p>
  </figcaption>
</figure>
\`\`\`

:::figure
  ![Placeholder image](https://via.placeholder.com/1600x900)
:::figcaption
  ### Title

  Content
:::`,
      title: 'Markdown demo',
    },
    methodology: {
      eyebrow: 'Vitrine Démocratique',
      markdown: `En page d'accueil, la Vitrine démocratique offre une vue d'ensemble sur trois types de données grâce au graphique représentant la « bourse de l'humeur » de la société québécoise. On y regroupe donc : la voix des citoyens, les textes des médias et les discours des décideurs, les trois piliers de la démocratie.

Les données d'opinion publique sont collectées et analysées en temps réel grâce à des sondages menés quotidiennement sur le Web auprès des Québécois.e.s, et ce, entre autres grâce à l'application Web Projet Quorum de la CLESSN. Les questions relatives à la perception et à l'attitude des répondants face à la COVID-19 sont agrégées de manière à produire un aperçu de ton quotidien de l'opinion publique.

Les données médiatiques et politiques sont également extraites et analysées de manière automatisée. La méthode utilisée nécessite de repérer le contenu à extraire, puis d'organiser ces informations dans une base de données structurée afin d'être facilement utilisable pour les analyses. Les contenus sont traités automatiquement en évaluant leur pertinence par rapport au sujet de la COVID-19. Puis, un dictionnaire de ton est déployé afin de produire un score neutre, positif ou négatif en fonction des mots employés par l'auteur.

---

# Médias

Les données médiatiques sont collectées à partir des sites Web des six médias ayant les plus forts taux de consultation au Québec. Les données sont extraites de manière automatisée en continu et emmagasinées dans nos bases de données. Plusieurs informations y sont relevées, dont le titre de la nouvelle, le texte, l'auteur et la source. Ces informations permettent de réaliser les analyses et de conserver des informations plus générales sur les articles publiés.

Un algorithme permet d'identifier les articles traitant de la COVID-19 et de leur attribuer un indice de pertinence. Les nouvelles qui traitent davantage de la pandémie ont donc plus de poids, alors que les nouvelles qui ne traitent pas du tout de la COVID-19 sont éliminées.

Pour analyser la variation du ton médiatique chaque jour, des dictionnaires sont utilisés pour évaluer le caractère positif, négatif ou neutre des mots. Les pourcentages des mots négatifs et positifs sont calculés par rapport à l'ensemble des mots collectés. Ensuite, le score de pertinence est appliqué. Cela produit le ton moyen pondéré par phrase pour chaque article de média. Le graphique de l'humeur présenté en première page de la Vitrine démocratique est donc une combinaison du ton de chaque média.

---

# Décideurs

Les données sur les décideurs proviennent des conférences de presse et des journaux des débats parlementaires répertoriés sur le site Web de l'Assemblée nationale du Québec ainsi que des points de presse sur la COVID-19 du premier ministre et des ministres tenus à l'extérieur de l'Assemblée nationale. Les données sont extraites quotidiennement de manière automatisée et emmagasinées dans nos bases de données. Plusieurs informations sont récupérées, dont le titre de l'évènement, le texte, la source et le nom des député.es qui prennent la parole. Ces informations permettent de réaliser des analyses et de conserver des informations plus générales sur les interventions des décideurs.

Un algorithme permet d'identifier les interventions au sujet de la COVID-19 et de leur attribuer un indice de pertinence. Les discours qui traitent davantage de la pandémie ont donc plus de poids dans les analyses, alors que les interventions qui ne mentionnent pas la COVID-19, de près ou de loin, sont éliminées.

Une fois de plus, afin d'analyser la variation quotidienne du ton des décideurs, des dictionnaires sont utilisés pour évaluer le caractère positif, négatif ou neutre des mots. Nous calculons le pourcentage des mots qui sont négatifs et positifs en prenant en compte l'indice de pertinence. Le ton moyen pondéré par phrase pour chaque intervention d'un décideur est ainsi produit. Le graphique de l'humeur présenté en première page de la Vitrine démocratique est donc une combinaison du ton employé par chaque ministre ayant pris la parole au sujet de la COVID-19.

---

# Citoyens

En répondant au questionnaire sur notre application Web Projet Quorum, vous contribuez à alimenter les données sur les citoyens. Lorsqu'un utilisateur remplit le questionnaire, ses données sont automatiquement enregistrées de manière anonyme. Elles sont ensuite prises en compte dans les analyses.

Nous posons des questions permettant de mesurer l'opinion publique par rapport à divers enjeux liés à la COVID-19 au Québec. La position de l'utilisateur est mesurée en agrégeant les réponses relatives aux craintes et aux perspectives par rapport à la pandémie. L'humeur quotidienne des citoyens est obtenue en combinant les résultats d'un minimum de 300 répondants répartis sur quelques jours à des fins de pondération.

Les données sont pondérées en fonction de variables comme le genre, l'âge et le niveau d'éducation afin d'être représentatives de l'ensemble de la population.`,
      title: 'Méthodologie',
    },
    partners: {
      eyebrow: 'Vitrine Démocratique',
      markdown: `Merci à nos nombreux partenaires qui ont permis et continuent de permettre la réalisation des objectifs démocratiques derrière la Vitrine démocratique.

## Partenaires académiques

:::div{className="ContentPage-logos-grid"}
[![CLESSN](./partners/clessn_logo.png)](https://www.clessn.com/index.html) [![CRDIP](./partners/crdip_logo.png)](https://www.democratie.chaire.ulaval.ca/index.php?pid=924) [![CECD](./partners/cecd_logo.png)](https://csdc-cecd.ca/fr/) [![CAPP](./partners/capp_logo.png)](https://www.capp.ulaval.ca/) [![FoDEM](./partners/fodem_logo.png)](https://www.fodem.ca/) [![GRCP](./partners/grcp_logo.png)](https://www.grcp.ulaval.ca/) [![CRCIS](./partners/crcis_logo.png)](https://immigration-securite.chaire.ulaval.ca/fr/)
:::

## Collaborateurs

:::div{className="ContentPage-logos-grid"}
[![Synopsis](./partners/synopsis_logo.png)](https://synopsis.marketing/) [![lg2](./partners/lg2_logo.png)](https://lg2.com/) [![Unicorn](./partners/unicorn_logo.png)](https://unicornpowered.com/) [![Tact](./partners/tact_logo.png)](https://www.tactconseil.ca/) [![Infoscope](./partners/infoscope_logo.png)](https://www.infoscope.ca/)
:::`,
      title: 'Partenaires',
    },
    privacy: {
      markdown: `# Politique de confidentialité

Nous utilisons des témoins de navigation (*cookies*) afin de reconnaître les visiteurs, reconnecter ceux qui ont créé un compte sur notre site Web, ainsi qu'à des fins d'analyse. Le respect de votre vie privée est important pour nous. Consultez notre [politique d'utilisation]($t(Page:conditions)) pour en apprendre plus ou pour apprendre comment désactiver les témoins sur votre navigateur.

## Échange de renseignements lors d'accès au site Web de la Vitrine démocratique.

### Témoins

Lorsque vous accédez à au site Web de la Vitrine démocratique, un échange de renseignements s'effectue de façon transparente entre votre appareil électronique et les serveurs de l'Université Laval.

#### Qu'est-ce que les témoins?

Les témoins (*cookies*) sont des fichiers installés sur votre appareil pour enregistrer votre activité pendant la session de navigation sur la page Web. L'utilisation de ceux-ci permet au serveur de reconnaître le navigateur, les préférences en matière de langue, de pays, etc. Les témoins permettent également de mesurer l'audience et les paramètres de trafic du site, ainsi qu'offrir aux utilisateurs des contenus adaptés et une expérience personnalisée.

#### Quels types de témoins sont utilisés sur le site?

Nous classons les témoins dans les catégories suivantes :

- Témoins strictement nécessaires (fonctionnement du site)
- Témoins de performance (mesure d'audience et du trafic)
- Témoins de fonctionnalité (applications et fonctions du site)
- Témoins de ciblage (publicités ciblées)
- Témoins de réseaux sociaux

#### Qui utilise l'information recueillie?

Les données recueillies sont la propriété unique de l'Université Laval. En aucun cas l'Université ne divulgue, partage ou commercialise ces données à des organismes tiers.

La Vitrine démocratique utilise ces données à des fins statistiques et promotionnelles, afin d'améliorer l'expérience des utilisateurs sur le site Web de la Vitrine démocratique et d'appuyer ses efforts de recrutement d'utilisateurs.

### Comment se désinscrire des témoins?

Parce que nous respectons votre droit à la vie privée, vous pouvez choisir de ne pas autoriser certains types de témoins à l'exception des témoins strictement nécessaires et des témoins de performance. Pour se désinscrire des témoins, veuillez consulter la liste de navigateurs suivants et y consulter les instructions.

- Google Chrome
Activer ou désactiver les *cookies* - Ordinateur - Aide Compte Google

- Mozilla Firefox
Protection renforcée contre le pistage dans Firefox pour ordinateur

- Apple Safari
Gérer les témoins et les données de sites Web avec Safari sur Mac

- Microsoft Edge
Microsoft Edge, browsing data, and privacy

Si votre navigateur ne se trouve pas dans cette liste, visitez son site Web afin de trouver les instructions pertinentes.

Veuillez prendre note que le blocage de certains témoins peut avoir une incidence sur votre expérience du site et des services que nous pouvons offrir.

## Collecte et utilisation de renseignements sur certains sites Web

Vous devez fournir des renseignements personnels lorsque vous effectuez certaines actions sur ce site, notamment :

- Création d'un compte
- Abonnement à une infolettre
- Demande d'information

## Informations sur le consentement

En remplissant tout formulaire sur le site Web de la Vitrine démocratique, vous consentez à ce que les renseignements fournis dans ce formulaire soient utilisés pour le service demandé et conservés pour la durée nécessaire à la réalisation des fins pour lesquelles ils ont été demandés.

La Vitrine démocratique s'engage à utiliser les renseignements fournis uniquement aux fins pour lesquelles ils ont été recueillis et à les conserver pour la durée nécessaire à la réalisation du service demandé.

### Le consentement s'applique-t-il à tous les sites de l'Université Laval?

L'avis de consentement affiché sur ce site s'applique uniquement à celui-ci.

### Accès aux renseignements

Seul le personnel autorisé peut avoir accès aux renseignements vous concernant. L'Université s'assure que ces personnes ont qualité pour accéder à ces renseignements et que l'accès est nécessaire dans l'exercice de leurs fonctions.

### Conservation et destruction des renseignements

Toutes les informations sont conservées selon le calendrier de conservation établi par l'Université (voir la division de la gestion des documents administratifs et des archives).

## Communiquer avec nous

Si vous avez des questions, des commentaires ou des plaintes, nous vous invitons à communiquer avec nous à l'adresse info@clessn.com.

> *Version du 25 février 2022.*`,
      title: 'Politique de confidentialité',
    },
  },
};
