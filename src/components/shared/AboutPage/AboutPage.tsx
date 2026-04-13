import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import InfoPage from '../InfoPage/InfoPage';

type Member = { name: string; role?: string; institution?: string };
type Group = { label: string; members: Member[] };

const TEAM: Group[] = [
  {
    label: 'Membres réguliers',
    members: [
      { name: 'Yannick Dufresne',   role: 'Directeur du CAPP · Titulaire de la CLESSN · Professeur agrégé' },
      { name: 'Shannon Dinan',       role: 'Co-directrice du CAPP · Professeure agrégée' },
      { name: 'Catherine Ouellet',   role: 'Professeure adjointe',      institution: 'Université de Montréal' },
      { name: 'Mathieu Ouimet',      role: 'Directeur du RFICS · Professeur titulaire' },
      { name: 'Steve Jacob',         role: 'Professeur titulaire' },
      { name: 'Simon Coulombe',      role: 'Titulaire de la Chaire Relief · Professeur agrégé' },
    ],
  },
  {
    label: 'Membres associés',
    members: [
      { name: 'Gabriel Arsenault',        institution: 'Université de Moncton' },
      { name: 'Daniel Béland',            institution: 'Université McGill' },
      { name: 'Lisa Birch',               institution: 'Université Laval' },
      { name: 'Chantal Blouin',           institution: 'INSPQ' },
      { name: 'Evelyne Brie',             institution: 'Western University' },
      { name: 'Pauline Côté',             institution: 'Université Laval' },
      { name: 'Pierre-Marc Daigneault',   institution: 'Université Laval' },
      { name: 'Alexandre Gajevic Sayegh', institution: 'Université Laval' },
      { name: 'Anessa Kimball',           institution: 'Université Laval' },
      { name: 'Sophie Mathieu',           institution: 'Université de Sherbrooke' },
      { name: 'Manuel Morales',           institution: 'Université de Montréal' },
      { name: 'Éric Montigny',            institution: 'Université Laval' },
      { name: 'Alexandre Pelletier',      institution: 'Université Laval' },
      { name: 'Nathalie Schiffino',       institution: 'Université catholique de Louvain' },
      { name: 'Geneviève Tellier',        institution: 'Université d\'Ottawa' },
      { name: 'Sule Tomkinson',           institution: 'Université Laval' },
    ],
  },
  {
    label: 'Membres émérites',
    members: [
      { name: 'Jean Crête',    role: 'Professeur titulaire retraité · Professeur associé' },
      { name: 'Louis Imbeau',  role: 'Professeur émérite' },
      { name: 'François Pétry', role: 'Professeur émérite (1948–2020)' },
    ],
  },
  {
    label: 'Membres postdoctorants',
    members: [
      { name: 'Alexandre Fortier-Chouinard', role: 'Chercheur postdoctoral' },
      { name: 'Antoine Lemor',               role: 'Chercheur postdoctoral' },
    ],
  },
  {
    label: 'Membres étudiants',
    members: [
      { name: 'Arnaud Beaulé',              role: 'Maîtrise' },
      { name: 'Hubert Cadieux',             role: 'Maîtrise' },
      { name: 'Benjamin Carignan',          role: 'Maîtrise' },
      { name: 'Adrien Cloutier',            role: 'Doctorat' },
      { name: 'Émile Dorion',               role: 'Maîtrise' },
      { name: 'Elsa Labonté',               role: 'Baccalauréat' },
      { name: 'Nicholas Gaudet',            role: 'Maîtrise' },
      { name: 'Étienne Proulx',             role: 'Maîtrise' },
      { name: 'Junior Sagne',               role: 'Doctorat' },
      { name: 'Camille Pelletier',          role: 'Maîtrise' },
      { name: 'Gora Mbaye',                 role: 'Doctorat' },
      { name: 'Laurence-Olivier M. Foisy',  role: 'Doctorat' },
      { name: 'Helena Massardier',          role: 'Doctorat' },
      { name: 'Marc-Antoine Dupuis',        role: 'Maîtrise' },
    ],
  },
];

const AboutPage = (): ReactElement => {
  const { t } = useTranslation('About');

  return (
    <InfoPage
      slug="about"
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
    >

      {/* ── Mission ──────────────────────────────────────────── */}
      <section className="InfoPage-section section-outer">
        <div className="section-inner">
          <h2 className="InfoPage-section-heading has-font-secondary">{t('mission.heading')}</h2>
          <p className="InfoPage-text">{t('mission.p1')}</p>
          <p className="InfoPage-text">{t('mission.p2')}</p>
          <blockquote className="InfoPage-quote">{t('mission.quote')}</blockquote>
        </div>
      </section>

      {/* ── L'institution ────────────────────────────────────── */}
      <section className="InfoPage-section section-outer">
        <div className="section-inner">
          <h2 className="InfoPage-section-heading has-font-secondary">{t('institution.heading')}</h2>
          <p className="InfoPage-text">{t('institution.text')}</p>
          <div className="InfoPage-address">
            <strong>Centre d&rsquo;analyse des politiques publiques</strong><br />
            Faculté des sciences sociales<br />
            Pavillon Charles-De Koninck<br />
            1030 Avenue des Sciences Humaines<br />
            Québec (QC) G1V 0A6<br />
            <a href="mailto:info@capp.ulaval.ca">info@capp.ulaval.ca</a>
            {' · '}
            <a href="https://capp-ulaval.ca/" target="_blank" rel="noreferrer">capp-ulaval.ca</a>
          </div>
        </div>
      </section>

      {/* ── Équipe ───────────────────────────────────────────── */}
      <section className="InfoPage-section section-outer">
        <div className="section-inner">
          <h2 className="InfoPage-section-heading has-font-secondary">{t('team.heading')}</h2>

          {TEAM.map((group) => (
            <div key={group.label} className="InfoPage-team-group">
              <p className="InfoPage-team-group-label has-font-secondary">{group.label}</p>
              <div className="InfoPage-team-grid">
                {group.members.map((m) => (
                  <div key={m.name} className="InfoPage-member">
                    <p className="InfoPage-member-name">{m.name}</p>
                    {m.role && <p className="InfoPage-member-role has-font-secondary">{m.role}</p>}
                    {m.institution && <p className="InfoPage-member-institution">{m.institution}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </InfoPage>
  );
};

export default memo(AboutPage);
