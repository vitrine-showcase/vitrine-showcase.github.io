import React, { memo, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './EnjuModule.scss';

interface LikertOption {
  value: number;
  label: string;
}

const likertOptions: LikertOption[] = [
  { value: 1, label: 'Pas du tout d’accord' },
  { value: 2, label: 'Plutôt pas d’accord' },
  { value: 3, label: 'Neutre' },
  { value: 4, label: 'Plutôt d’accord' },
  { value: 5, label: 'Tout à fait d’accord' },
];

// Mock distribution data from "internal panel"
const panelDistribution = [12, 18, 10, 35, 25]; // % for each Likert level

const EnjuModule = (): ReactElement => {
  const { t } = useTranslation('EnjuModule');
  const [userVote, setUserVote] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleVote = (value: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setUserVote(value);
      setIsAnimating(false);
    }, 400);
  };

  const getMajorityPhrase = (vote: number) => {
    const pct = panelDistribution[vote - 1];
    const maxVal = Math.max(...panelDistribution);
    const isMajority = pct === maxVal;

    if (isMajority) {
      return `Vous êtes au cœur de l’opinion majoritaire (${pct}%).`;
    }

    if (pct > 20) {
      return `Votre position est largement partagée (${pct}%) par le panel.`;
    }

    if (pct > 10) {
      return `Vous exprimez une nuance partagée par ${pct}% des répondants.`;
    }

    return `Vous occupez une position plus singulière (${pct}%) par rapport au panel.`;
  };

  return (
    <div className={`EnjuModule ${userVote ? 'EnjuModule--results' : ''} ${isAnimating ? 'EnjuModule--animating' : ''}`}>
      <div className="EnjuModule-header">
        <span className="EnjuModule-eyebrow">{t('eyebrow', 'Question de l\u2019heure')}</span>
        <span className="EnjuModule-tag">Citoyens</span>
      </div>

      {!userVote ? (
        <div className="EnjuModule-question-view">
          <h2 className="EnjuModule-question">
            &laquo; Considérez-vous que l&rsquo;instabilité géopolitique actuelle justifie une intervention
            directe de l&rsquo;État sur le plafonnement des prix de l&rsquo;énergie ? &raquo;
          </h2>
          <p className="EnjuModule-context">
            Le prix de l’essence, fortement lié aux tensions en Iran, ravive le débat sur la souveraineté énergétique.
          </p>
          
          <div className="EnjuModule-likert">
            {likertOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="EnjuModule-likert-btn"
                onClick={() => handleVote(opt.value)}
                aria-label={opt.label}
              >
                <span className="EnjuModule-likert-value">{opt.value}</span>
              </button>
            ))}
          </div>
          <div className="EnjuModule-likert-labels">
            <span>{likertOptions[0].label}</span>
            <span>{likertOptions[4].label}</span>
          </div>
        </div>
      ) : (
        <div className="EnjuModule-results-view">
          <div className="EnjuModule-results-header">
            <span className="EnjuModule-question-eyebrow">Votre avis sur :</span>
            <h2 className="EnjuModule-question-small">
              &laquo; Plafonnement des prix de l&rsquo;énergie et instabilité géopolitique &raquo;
            </h2>
          </div>

          <div className="EnjuModule-histogram-container">
            <div className="EnjuModule-histogram-header">
              <h3 className="EnjuModule-histogram-title">Distribution des opinions du panel</h3>
            </div>
            <div className="EnjuModule-histogram">
              {panelDistribution.map((pct, idx) => (
                <div key={`${idx + 1}-${pct}`} className="EnjuModule-histogram-col">
                  <div className="EnjuModule-histogram-bar-wrapper">
                    <div
                      className={`EnjuModule-histogram-bar ${userVote === idx + 1 ? 'EnjuModule-histogram-bar--user' : ''}`}
                      style={{ height: `${pct}%` }}
                    >
                      <span className="EnjuModule-histogram-pct">{pct}%</span>
                    </div>
                  </div>
                  <div className="EnjuModule-histogram-axis">
                    <span className="EnjuModule-histogram-label">{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="EnjuModule-histogram-legend">
              <span>{likertOptions[0].label}</span>
              <span>{likertOptions[4].label}</span>
            </div>
          </div>

          <div className="EnjuModule-feedback">
            <div className="EnjuModule-feedback-header">
              <div className={`EnjuModule-feedback-badge ${panelDistribution[userVote - 1] > 20 ? 'EnjuModule-feedback-badge--main' : ''}`}>
                <span>Profil : {panelDistribution[userVote - 1] > 20 ? 'Consensus' : 'Nuance'}</span>
              </div>
            </div>
            <p className="EnjuModule-feedback-phrase">{getMajorityPhrase(userVote)}</p>
            <p className="EnjuModule-feedback-sub">Source : Panel CAPP (n=1 250). Comparaison en temps réel.</p>
          </div>
          
          <button type="button" className="EnjuModule-reset-btn" onClick={() => setUserVote(null)}>
            Revenir à la question
          </button>
        </div>
      )}

      <div className="EnjuModule-footer">
        <span>CAPP — DONNÉES DE PANEL EN TEMPS RÉEL — 2026</span>
      </div>
    </div>
  );
};

export default memo(EnjuModule);
