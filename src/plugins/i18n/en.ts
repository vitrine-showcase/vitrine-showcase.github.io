/* eslint-disable max-len */
export default {
  App: {
    title: 'Vitrine Démocratique',
  },
  About: {
    eyebrow: 'CAPP · Université Laval',
    title: 'La Vitrine Démocratique',
    description: 'The Vitrine measures what really occupies the public space and shows it to you as it is.',
    mission: {
      heading: 'Why the Vitrine exists',
      p1: 'We live in an era of informational abundance that paradoxically impoverishes what we share in common. Algorithms optimize for engagement, meaning for what makes us react, not necessarily for what matters.',
      p2: 'What we have lost is the common world, namely the set of facts, issues and concerns that allow a society to debate, choose, and govern itself. The Vitrine Démocratique constitutes a response to this problem and a rigorous anchor. It makes visible what really occupies the public space today, measured without algorithmic filtering.',
      quote: 'The Vitrine Démocratique is the news as it exists in the public space. Not as the algorithm chose it for you.',
    },
    institution: {
      heading: 'The institution',
      text: 'The Vitrine is an initiative of the Centre d\'analyse des politiques publiques (CAPP) and the Leadership Chair in Teaching of Digital Social Science (CLESSN) at Université Laval, under the direction of Professor Yannick Dufresne. Data is collected and stored in Quebec, on Université Laval servers, with the strictest ethical authorizations.',
    },
    team: {
      heading: 'The team',
    },
  },
  Contact: {
    eyebrow: 'CAPP · CLESSN',
    title: 'Contact',
    description: 'Send us your questions, comments or data access requests.',
  },
  Partners: {
    eyebrow: 'Vitrine Démocratique',
    title: 'Partners',
    description: 'Thank you to the partners who make the Vitrine Démocratique possible.',
    academic: {
      heading: 'Academic Partners',
    },
    industry: {
      heading: 'Collaborators',
    },
  },
  Methodology: {
    eyebrow: 'Vitrine Démocratique',
    title: 'Methodology',
    description: 'How we measure the three pillars of Quebec\'s public space.',
    overview: {
      heading: 'Overview',
      text: 'The Vitrine continuously aggregates data from three distinct sources — media, parliamentary speeches and public opinion — to produce an objective portrait of what occupies the public space. Each source is processed by a dedicated algorithm, validated by political science researchers.',
    },
    media: {
      eyebrow: 'Media',
      title: 'Media salience',
      text: 'Headlines from major Quebec media are collected continuously. A salience index measures the relative presence of each topic in media coverage, weighted by source and time of publication.',
    },
    authorities: {
      eyebrow: 'Decision-makers',
      title: 'Parliamentary speech',
      text: 'Parliamentary interventions at the National Assembly and the House of Commons are automatically extracted. The index measures what fraction of political discourse is devoted to each issue, by party and period.',
    },
    citizens: {
      eyebrow: 'Citizens',
      title: 'Public opinion',
      text: 'Daily online surveys of Quebecers measure their concerns and positions on current issues. Results are weighted by gender, age and education level.',
    },
    ethics: {
      heading: 'Ethics and transparency',
      text: 'The CLESSN holds the strictest ethical authorizations. Data is collected and stored in Quebec, on Université Laval servers. No personal data is used for media or parliamentary salience indices.',
    },
    download: {
      heading: 'Complete documentation',
      label: 'Download the methodology',
    },
  },
  AppLanguage: {
    current: {
      long: 'English',
      short: 'En',
    },
    other: {
      long: 'Français',
      short: 'Fr',
    },
  },
  Category: {
    common: {
      about: 'About this graph',
      description: "The Vitrine Démocratique measures what truly occupies public space, and shows it to you as it is. Follow <mark className='radarplus-mark'>media</mark> coverage, the discourse of <mark className='agoraplus-mark'>decision-makers</mark>, and the opinion of <mark className='civimetreplus-mark'>citizens</mark>.",
      main: '',
      teaser: 'A window into the <span>public sphere.</span>',
      tooltip: '',
      callToAction: 'Our analyses',
    },
    agoraplus: {
      cta: 'Our analyses',
      description: 'Follow the discourse of <span>decision-makers</span> : elected officials, ministers and political parties. See which issues they place at the centre of their public interventions.',
      main: '',
      teaser: 'What the <span>decision-makers</span> are saying',
      title: 'Decision-makers',
      articles: {
        teaser: 'Our latest analyses on decision-makers',
      },
      callToAction: 'Our analyses',
      more: 'Find out more',
      optimist: "Decision-makers' mood",
      pessimist: "Decision-makers' mood",
    },
    radarplus: {
      cta: 'Our analyses',
      description: 'Discover what <span>Quebec media</span> are putting front and centre: which issues dominate their coverage and how they cover them.',
      main: '',
      teaser: 'What the <span>media</span> are <span>covering</span>',
      title: 'Media',
      articles: {
        teaser: 'Our latest analyses on the media',
      },
      callToAction: 'Our analyses',
      more: 'Find out more',
      optimist: "Media's mood",
      pessimist: "Media's mood",
    },
    civimetreplus: {
      cta: 'Our analyses',
      description: 'Measure what <span>Quebecers</span> think : their concerns, their positions, and their relationship to the shared news landscape.',
      main: '',
      teaser: 'What <span>Quebecers</span> think',
      title: 'Citizens',
      articles: {
        teaser: 'Our latest analyses of the citizens',
      },
      callToAction: 'Our analyses',
      more: 'Find out more',
      optimist: "Citizens' mood",
      pessimist: "Citizens' mood",
    },
  },
  FooterLegal: {
    conditions: 'Terms of Use',
    copyright: '©2025 Vitrine Démocratique',
    privacy: 'Privacy Policy',
  },
  HomeChart: {
    yAxis: {
      down: 'Pessimism ▼',
      up: 'Optimism ▲',
    },
  },
  HomeChartDetails: {
    agoraplus: "Decision-makers' mood",
    agoraplusSoon: "Decision-makers' mood: upcoming",
    civimetreplus: "Citizens' mood",
    civimetreplusSoon: "Citizens' mood: upcoming",
    radarplus: "Media's mood",
    radarplusSoon: "Media's mood: upcoming",
  },
  PartisModule: {
    eyebrow: 'Voice of Parties',
    title: 'The voice of parties',
    provincial: 'Provincial',
    federal: 'Federal',
    source: 'Source: Media analysis, coverage weighted by issue',
    loading: 'Loading...',
    error: 'Unable to load data.',
  },
  EnjuModule: {
    eyebrow: 'Issues of the Moment',
    source: 'Source: Media analysis, salience by issue',
    loading: 'Loading...',
    error: 'Unable to load data.',
  },
  ConstellationModule: {
    eyebrow: 'Media relations',
    title: 'The media constellation',
    countries: { QC: 'Quebec', CAN: 'Canada' },
    description: 'The most salient objects in media coverage and their co-occurrence links.',
    loading: 'Loading...',
    meta: {
      count: 'number inside = articles',
      nodeSize: 'size = importance',
      edge: 'line = mentioned together',
    },
    source: 'Source: Media analysis, co-occurrence by object',
    panel: {
      hint: 'Click an object to see related headlines',
    },
    tooltip: {
      coverage: 'salience score',
    },
  },
  MediaTicker: {
    label: 'Headlines',
    loading: 'Loading...',
  },
  CategoryTop20: {
    eyebrow: 'Top 20',
    countryToggle: 'Choose country',
    countries: { QC: 'Quebec', CA: 'Canada' },
  },
  ParoleEnChambre: {
    eyebrow: 'The Floor of the House',
    hook: 'Right now, elected officials are debating',
    assemblyToggle: 'Choose assembly',
    assemblies: { QC: 'Quebec', FED: 'Federal' },
    saillance: {
      label: 'How much it\'s being debated',
      marginal: 'Barely',
      notable: 'Somewhat',
      fort: 'A lot',
      sature: 'Everywhere',
    },
    velocity: {
      upStrong: '↑↑ Exploding',
      up: '↑ Rising',
      stable: '→ Stable',
      down: '↓ Declining',
      downStrong: '↓↓ Collapsing',
    },
    interventions: 'interv.',
    debatsLink: 'See the Top 20 →',
    nextSession: 'Next session:',
    loading: 'Loading...',
    error: 'Unable to load data.',
  },
  CouverturePartisModule: {
    eyebrow: 'Party coverage',
    title: 'Political party coverage',
    scopes: { provincial: 'Quebec', federal: 'Canada' },
    description: 'Measures the share of media coverage devoted to each political party in recent news.',
    source: 'Source: Media analysis, mentions by party',
  },
  UneDesUnes: {
    eyebrow: 'The Headline of Headlines',
    hook: 'Right now, the media are talking about',
    countryToggle: 'Choose country',
    countries: {
      QC: 'Quebec',
      CA: 'Canada',
    },
    saillance: {
      label: 'How much it\'s being covered',
      marginal: 'Barely',
      notable: 'Somewhat',
      fort: 'A lot',
      sature: 'Everywhere',
    },
    velocity: {
      upStrong: '↑↑ Exploding',
      up: '↑ Rising',
      stable: '→ Stable',
      down: '↓ Declining',
      downStrong: '↓↓ Collapsing',
    },
    radarLink: 'See the Top 20 →',
    notCovering: 'No front page on this issue',
    nextUpdate: 'Next:',
    loading: 'Loading...',
    error: 'Unable to load data. Regenerate headline-of-headlines.json.',
  },
  MediaTreemap: {
    eyebrow: 'Media pulse',
    title: 'Media pulse by issue',
    subtitle: 'An editorial read of the issues dominating coverage right now. Each block represents an issue share within the incoming article stream.',
    loading: 'Loading treemap from local AWS-backed data...',
    error: 'Unable to load the local treemap. Run the refiner local script again to regenerate `public/data/media-treemap.json`.',
    controls: {
      ariaLabel: 'Media treemap period',
      day: 'Day',
      week: 'Week',
      month: 'Month',
    },
    detail: {
      coverage: '{{score}}% of current coverage',
      compare: 'Comparison point: {{previous}}% on the previous update',
      velocity: 'since 11:09 AM',
    },
    rising: {
      title: 'Fastest risers',
    },
    timeline: {
      title: 'Evolution',
      note: 'Local source: {{table}} · generated at {{generatedAt}}',
    },
  },
  prototypePlaceholder: {
    common: {
      kicker: 'Prototype in progress',
      title: 'The cross-cutting overview is coming next',
      text: 'This section is intentionally hidden in the public prototype. It will later be replaced by a consolidated view aligned with the new visual direction.',
    },
    publicOpinion: {
      kicker: 'Prototype in progress',
      title: 'The citizens module is disabled in this demo',
      text: 'This shareable version keeps the spotlight on the media treemap. Public opinion content will be reconnected in a separate iteration.',
    },
    authorities: {
      kicker: 'Prototype in progress',
      title: 'The decision-makers module stays out of scope for this demo',
      text: 'This GitHub Pages mockup is mainly meant to showcase the new media experience. The decision-makers section will come back in a fuller version.',
    },
  },
  MainAction: {
    survey: {
      text: 'Discover your profile by filling our questionnaire',
      button: 'Fill the questionnaire',
    },
  },
  MainMenu: {
    title: 'Menu',
    close: 'Close',
  },
  MenuAsides: {
    profile: {
      login: 'Log in',
      signup: 'Sign me up',
      text: 'Log in to your account to store your information.',
    },
    survey: {
      button: 'Fill the questionnaire',
      text: 'Discover your profile by filling our questionnaire',
    },
  },
  SiteMenus: {
    main: {
      agoraplus: 'Decision-makers',
      radarplus: 'Media',
      civimetreplus: 'Citizens',
    },
    secondary: {
      about: 'About us',
      contact: 'Contact',
      methodology: 'Methodology',
      partners: 'Partners',
    },
  },
  URL: {
    about: 'a-propos',
    category: 'categorie',
    conditions: 'conditions',
    contact: 'contact',
    login: 'connexion',
    methodology: 'methodologie',
    partners: 'partenaires',
    privacy: 'confidentialite',
    signup: 'inscription',
    survey: 'questionnaire',
    categories: {
      agoraplus: 'agoraplus',
      radarplus: 'radarplus',
      civimetreplus: 'civimetreplus',
    },
  },
  ArticlePreview: {
    read: 'Read',
  },
  Article: {
    author: 'Produced by {{author}}',
    back: 'Return to our analyses',
    publishedOn: 'Published on {{date}}',
  },
  Content: {
    about: {
      eyebrow: 'CLESSN',
      markdown: `The Vitrine Démocratique is a gathering point for the Quebec society. It allows to continuously take the pulse of the three pillars of democracy: decision-makers, the media and citizens.

Thanks to numerous macro-democratic indicators endorsed by the recent scientific research, the Vitrine helps measure the state of Quebec's political and social health. Not only are these indicators closely studied by political science researchers, but are also made freely available to whoever wants to learn more about their democracy, whether it is the decision-makers, the media or the citizens.

The Vitrine Démocratique is an initiative led by the Leadership Chair in the Teaching of Digital Social Science (CLESSN) at Université Laval and its holder, Professor Yannick Dufresne. The CLESSN is proud to hold the strictest ethical authorizations, as expected from such scientific tool. It is thus able to ensure the security of the data collected and stored in Quebec, on Université Laval's servers.

## The CLESSN Team

:::div{className="ContentPage-team-grid"}
Adrien Cloutier
:div[Data scientist]

Alexandre Côté
:div[Data analyst]

Alexandre Fortier-Chouinard
:div[Data scientist]

Alexis Bibeau-Gagnon
:div[Data scientist]

Axel Déry
:div[Data analyst]

Brian Thompson Collart
:div[Data scientist]

Camille Tremblay-Antoine
:div[Data scientist]

Catherine Ouellet
:div[Data scientist]

Cloé Girard-Poncet
:div[Data analyst]

David Dumouchel
:div[Postdoctoral fellow]

François Gélineau
:div[Full professor]

Hubert Cadieux
:div[Data analyst]

Jérémy Gilbert
:div[Data analyst]

Justine Béchard
:div[Data analyst]

Marc-André Bodet
:div[Associate professor]

Marc-Antoine Rancourt
:div[Data scientist]

Maria Alexandrov
:div[Communications advisor]

Mathieu Ouimet
:div[Full professor]

Nadjim Fréchet
:div[Data scientist]

Olivier Banville
:div[Data solutions architect]

Patrick Poncet
:div[Data engineer]

William Poirier
:div[Data analyst]

Yannick Dufresne
:div[Research chair holder]
:::`,
      title: 'About us',
    },
    conditions: {
      markdown: `# Terms of Use

By ticking off the consent boxe on the creating your account page, you confirm to having read and accepted the users conditions describe on this page. 

## Creating your account

By creating your account, you agree to:

- Give true personal information (last name, first name, etc.)
- To create and use only one account using a personal address

## General user conditions

At all times, the Vitrine Démocratique reserves the right to close your account if you do not respect the following user conditions.

The Vitrine Démocratique and Université Laval cannot be taken responsible if you do not respect the following conditions or the optimal security conditions, including the use of your devices. If you suspect that your account has been hacked or that fraud is in play, contact our team immediately at info@clessn.com.  

## Confidentiality and respect of private life

The Vitrine Démocratique ensures the protection of personal information and respects its users' private life. To learn more, consult our page [Confidentiality terms]($t(Page:privacy)).

## Here are some recommendations to apply when using the web site to protect your personal information.

### Protecting your identity

- Choose a complex password with uppercase, lowercase, numbers, and special characters, and change it frequently.
- Never share your connection identifier or your password.
- Be wary of emails containing hyperlinks leading to web sites or which ask for personal information.

### Protecting your data

- Always use an activated and up to date antivirus software.
- Refrain from sharing on social media sensible data like personal information on you or others (full birthday, address, etc.).
- Stay vigilant when it comes to fraud attempts when using the Vitrine Démocratique's name. They can happen by emails, on web sites, or on other medium.

### Protecting your devices

- Lock your electronic devices using a password.
- Do not let your devices without surveillance in a public place.
- Immediately bring any found devices to the university's Service de sécurité et de prévention (SSP).

### Deconnecting from a site and logging out

- Log out as soon as you are done using the web site or close all your browser' windows.
- Empty the cache memory of your browser once you have logged out.

## Modifying user conditions

At all times, the Vitrine Démocratique reserves the right to modify the user conditions. It is therefore advised to refer to it regularly. Changes are effective by the date indicated on the web site.

> *Version from 25th February 2022.*`,
      title: 'Terms of Use',
    },
    contact: {
      eyebrow: 'CLESSN',
      markdown: `Send us your questions, comments and/or access request to our data for research purposes at info@clessn.com.
`,
      title: 'Contact Us',
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
      markdown: `On its home page, the Vitrine Démocratique offers an overview of three types of data thanks to the graph representing the "mood exchange" of Quebec society. The three pillars of democracy are: the voice of citizens, the media texts and the speeches of decision-makers.

Public opinion data is collected and analyzed in real time through daily web-based surveys of Quebecers, including on CLESSN's Quorum Project web app. Questions regarding users' perception and mood regarding COVID-19 are aggregated in order to produce a daily score of the public opinion.

The data coming from the media and politics are extracted and analysed in an automated fashion. The method used needs to locate the content to extract; then it organizes the information in a database structured to be easy to use when analysing. Content is categorized automatically by evaluating its pertinence to COVID-19. Then, a tone dictionnary is deployed in order to produce a neutral, positive, or negative score in fonction of words employed by the author.

---

# Media

The data coming from the media is collected through the six media's web sites with the highest penetration rates in Quebec. The data is extracted in a continuously automated fashion and is saved in our databases. Many informations are collected, such as the title of the news, the text, the author, and the source. These informations allow us to analyse and save general information on published articles.

An algorithm identifies articles touching on COVID-19 and to give them a relevance index. News regarding the pandemic therefore have a higher indicator, while non-COVID-19 news are discarded.
To analyse the variation in media's daily tone, dictionaries are used to evaluate the positive, negative, or neutral characteristic of words. Percentages of negative and positive words are calculated in regards to all the words collected. Afterwards, a pertinence score is applied. This produces an average tone weighted by sentence for each media article. The mood graph presented on the first page of the Vitrine Démocratique is a combination of each media's tone.

---

# Decision-makers

Data on decision-makers is from press conferences and Parliamentary Debates Journal on the Assemblée nationale du Quebec's web site as well as press briefings on COVID-19 by the Prime Minister and ministers outside of the Assemblée nationale. Data is extracted daily and automatically and saved in our database. Many informations are stored, such as the title of the event, the text, the source, and the name.s of the speaking deputee.s. These informations help us analyse and save general information on decision-makers' interventions.

An algorithm identifies interventions regarding COVID-19 and gives them a relevance index. Speeches touching on the pandemic therefore have a bigger weight in the analysis, while interventions which do not mention COVID-19 are discarded.

Once again, to analyse the daily variation of decision-makers tone, dictionaries are used to evaluate the positive, negative, or neutral character of the words. We calculate the percentage of negative and positive words while taking the relevance index into account. The average tone is then weighted for each intervention a decision-maker does. The mood graph on the first page of the Vitrine Démocratique is a combination of each tone used by ministers talking about COVID-19.

---

# Citizens

By completing the survey on our Quorum Project web app, you are contributing to the citizen data. When a user fills the questionnaire, their data is automatically saved in an anonymous way. They are then used in our analysis.

We ask questions to measure the public opinion regarding diverse issues on COVID-19 in Quebec. The user's position is measured by aggregating the answers related to fears and perspectives on the pandemic. The daily mood of public opinion is obtained by combining the results of a minimum of 300 respondents spread over a few days for weighting purposes.

The data is then weighted by gender, age, level of education, and other, so as for the results to be representative.`,
      title: 'Methodology',
    },
    partners: {
      eyebrow: 'Vitrine Démocratique',
      markdown: `We thank our numerous partners who help us reach the democratic goals of the Vitrine Démocratique.

## Academic Partnerships

:::div{className="ContentPage-logos-grid"}
[![CLESSN](./partners/clessn_logoEN.png)](https://www.clessn.com/index.html) [![CRDIP](./partners/crdip_logoEN.png)](https://www.democratie.chaire.ulaval.ca/index.php?pid=924) [![CSDC](./partners/cecd_logoEN.png)](https://csdc-cecd.ca/) [![CAPP](./partners/capp_logoEN.png)](https://www.capp.ulaval.ca/en) [![FoDEM](./partners/fodem_logoEN.png)](https://www.fodem.ca/) [![GRCP](./partners/grcp_logoEN.png)](https://www.grcp.ulaval.ca/) [![CRCIS](./partners/crcis_logoEN.png)](https://immigration-securite.chaire.ulaval.ca/en/about-us/)
:::

## Collaborators

:::div{className="ContentPage-logos-grid"}
[![Synopsis](./partners/synopsis_logoEN.png)](https://synopsis.marketing/) [![lg2](./partners/lg2_logoEN.png)](https://lg2.com/en/) [![Unicorn](./partners/unicorn_logoEN.png)](https://unicornpowered.com/en/) [![Tact](./partners/tact_logoEN.png)](https://www.tactconseil.ca/en/) [![Infoscope](./partners/infoscope_logoEN.png)](https://www.infoscope.ca/)
:::`,
      title: 'Partners',
    },
    privacy: {
      markdown: `# Privacy Policy

We use navigation cookies to identify visitors, allow those with an account to log in our website, as well as to analyze data. Respecting your private life is important to us. Consult our [users term]($t(Page:conditions)) to learn more or to see how to deactivate cookies on your browser.

## Exchange of information when accessing the Vitrine Démocratique's website.

### Cookies

When you access the Vitrine Démocratique's website, an exchange of information happens in a transparent way between your electronic device and the Université Laval's servors.

#### What are cookies?

Cookies are files installed on your device to monitor your activity during your web browsing. They allow the servor to recognise the browser, as well as preferences regarding language, country, etc. Cookies also measure the audience and parameters of traffic, as well as offer uses adapted content and a personalized experience.

#### What type of cookies are used on the site?

We categorize cookies in the following categories :

- Strictly necessary cookies (functionning)
- Performance cookies (measure audience and traffic)
- Functionality cookies (applications and functions)
- Targeting cookies (targeted ads)
- Social media cookies

#### Who uses the collected information?

The collected data is the unique property of Université Laval. In no case will the University disclose, share, or commercialize these data to a third party.

The Vitrine Démocratique uses these data for statistical and promotional purposes to improve user experience on the Vitrine Démocratique's website and support its users recruitment efforts.

### How to unsubscribe to cookies

Because we respect your right to a private life, you can choose to not authorize certain types of cookies except those that are strictly necessary and performance. To unsubscribe from cookies, please consult the following list of browsers and follow the instructions.

- Google Chrome
Activate or disactivate cookies - Computer - Account Help Google

- Mozilla Firefox
Reinforced protection against tracking Firefox for computer

- Apple Safari
Manage cookies and data on web sites with Safari on Mac

- Microsoft Edge
Microsoft Edge, browsing data, and privacy

If your navigator is not on this list, visit its website to find the relevant instructions.

Please note that blocking certain cookies can affect your experience on the site and the services offered.

## Collecting and using information on certain websites

You need to give personal information when you do certain actions on this site, including :

- Create an account
- Subscribe to the newsletter
- Information request

## Informations on consent

By filling any form on the Vitrine Démocratique's website, you consent to let all information given by the form to be used by the requested service and to be kept for the necessary time period to have said service realised.

The Vitrine Démocratique commits to use given information only for the purposes for which it was collected and to keep it for the necessary time period to fulfill the requested purpose.

### Does consent apply on all Université Laval websites?

This consent notice showcased on this site applies only to this site.

### Acces to information

Only authorized personel have access to your personal information. The University ensures that those persons are qualified to access such information and that the access is necessary in the exercice of their functions.

### Conservation and destruction of information

All information is conserved according to the conservation calendar established by the University (see the division of the management of admin files and archives).

## Contact us

If you have any questions, comments or complaints, we invite you to contact us at info@clessn.com.

> *Version from 25th of February 2022.*`,
      title: 'Privacy Policy',
    },
  },
};
