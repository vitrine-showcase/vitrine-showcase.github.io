import React, { memo, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Assembly, ParoleAssembly, ParoleEnChambrePayload } from './paroleEnChambreData';
import './ParoleEnChambre.scss';

const partyLogoMap: Record<string, string> = {
  CAQ: 'caq', PLQ: 'plq', PQ: 'pq', QS: 'qs', PCQ: 'pcq',
  LPC: 'lpc', CPC: 'cpc', NDP: 'ndp', BQ: 'bq', GP: 'gpc', GPC: 'gpc',
};

const getSaillanceLevel = (score: number): string => {
  if (score >= 0.75) return 'sature';
  if (score >= 0.50) return 'fort';
  if (score >= 0.25) return 'notable';
  return 'marginal';
};

const getVelocityKey = (velocity: number): string => {
  if (velocity > 20)  return 'upStrong';
  if (velocity > 5)   return 'up';
  if (velocity >= -5) return 'stable';
  if (velocity > -20) return 'down';
  return 'downStrong';
};

const getVelocityDir = (velocity: number): string => {
  if (velocity > 5)   return 'up';
  if (velocity >= -5) return 'neutral';
  return 'down';
};

const ParoleEnChambre = (): ReactElement => {
  const { t } = useTranslation('ParoleEnChambre');
  const navigate = useNavigate();
  const eyebrowWords = t('eyebrow').split(' ');
  const eyebrowLead = eyebrowWords[0];
  const eyebrowAccent = eyebrowWords[1];
  const eyebrowTail = eyebrowWords.slice(2).join(' ');
  const [payload, setPayload] = useState<ParoleEnChambrePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [assembly, setAssembly] = useState<Assembly>('QC');

  useEffect(() => {
    fetch(`/data/parole-en-chambre.json?ts=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error('network');
        return res.json();
      })
      .then((data: ParoleEnChambrePayload) => {
        setPayload(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const handleDebatsLink = useCallback(() => {
    navigate('/categorie/agoraplus');
  }, [navigate]);

  const data: ParoleAssembly | null = useMemo(() => {
    if (!payload) return null;
    return payload.assemblies[assembly];
  }, [payload, assembly]);

  const eyebrowEl = (
    <h2 className="ParoleEnChambre-eyebrow">
      {eyebrowLead}
      {eyebrowAccent && <> <span className="has-font-secondary">{eyebrowAccent}</span></>}
      {eyebrowTail && ` ${eyebrowTail}`}
    </h2>
  );

  if (loading) {
    return (
      <div className="ParoleEnChambre ParoleEnChambre--state">
        {eyebrowEl}
        <p className="ParoleEnChambre-status">{t('loading')}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="ParoleEnChambre ParoleEnChambre--state">
        {eyebrowEl}
        <p className="ParoleEnChambre-status">{t('error')}</p>
      </div>
    );
  }

  const saillanceLevel = getSaillanceLevel(data.score);
  const velocityKey    = getVelocityKey(data.velocity);
  const velocityDir    = getVelocityDir(data.velocity);

  return (
    <div className="ParoleEnChambre">

      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="ParoleEnChambre-panel">

        <div className="ParoleEnChambre-panel-header">
          {eyebrowEl}
          <div className="ParoleEnChambre-toggle" role="group" aria-label={t('assemblyToggle')}>
            {(['QC', 'FED'] as Assembly[]).map((a) => (
              <button
                key={a}
                type="button"
                className={`ParoleEnChambre-toggle-btn${assembly === a ? ' is-active' : ''}`}
                onClick={() => setAssembly(a)}
              >
                {t(`assemblies.${a}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="ParoleEnChambre-story">
          <p className="ParoleEnChambre-hook">{t('hook')}</p>
          <h2 className="ParoleEnChambre-title">
            &laquo;&nbsp;{data.title}&nbsp;&raquo;
          </h2>
        </div>

        <div className="ParoleEnChambre-bottom">

          <div className="ParoleEnChambre-saillance">
            <div className="ParoleEnChambre-saillance-header">
              <span className="ParoleEnChambre-saillance-label">
                {t('saillance.label')}
              </span>
              <span
                className="ParoleEnChambre-velocity"
                data-dir={velocityDir}
              >
                {t(`velocity.${velocityKey}`)}
              </span>
            </div>
            <div className="ParoleEnChambre-saillance-track">
              <div
                className="ParoleEnChambre-saillance-fill"
                style={{ width: `${Math.round(data.score * 100)}%` }}
              />
            </div>
            <span
              className="ParoleEnChambre-saillance-level"
              data-level={saillanceLevel}
            >
              {t(`saillance.${saillanceLevel}`)}
            </span>
          </div>

          <div className="ParoleEnChambre-objects">
            {data.objects.slice(0, 3).map((obj, i) => (
              <div key={obj.label} className="ParoleEnChambre-object">
                <span className="ParoleEnChambre-object-label">{obj.label}</span>
                <div className="ParoleEnChambre-object-track">
                  <div
                    className="ParoleEnChambre-object-fill"
                    style={{ width: `${Math.round(obj.score * 100)}%` }}
                  />
                </div>
                <span className="ParoleEnChambre-object-rank">
                  #{i + 1}
                </span>
              </div>
            ))}
            <button
              type="button"
              className="ParoleEnChambre-debats-link"
              onClick={handleDebatsLink}
            >
              {t('debatsLink')}
            </button>
          </div>

        </div>

      </div>

      {/* ── Party panel ─────────────────────────────────────────── */}
      <div className="ParoleEnChambre-parties">
        {data.monitoredParties.map((partyCode) => {
          const row = data.partyInterventions.find((p) => p.party === partyCode);
          const score = row?.score ?? 0;
          const interventions = row?.interventions ?? 0;
          const isActive = interventions > 0;

          return (
            <div
              key={partyCode}
              className={`ParoleEnChambre-party${isActive ? ' ParoleEnChambre-party--active' : ' ParoleEnChambre-party--silent'}`}
            >
              <div className="ParoleEnChambre-party-logo-col">
                {partyLogoMap[partyCode] ? (
                  <img
                    className="ParoleEnChambre-party-logo"
                    src={`/logos/parties-black/${partyLogoMap[partyCode]}.png`}
                    alt={row?.fullName ?? partyCode}
                  />
                ) : (
                  <span className="ParoleEnChambre-party-code">{partyCode}</span>
                )}
              </div>
              <div className="ParoleEnChambre-party-content">
                {isActive && (
                  <span className="ParoleEnChambre-party-count">
                    {interventions}&nbsp;{t('interventions')}
                  </span>
                )}
                {isActive && (
                  <div className="ParoleEnChambre-party-track">
                    <div
                      className="ParoleEnChambre-party-fill"
                      style={{ width: `${Math.round(score * 100)}%` }}
                    />
                  </div>
                )}
              </div>
              <span
                className="ParoleEnChambre-party-indicator"
                data-active={isActive}
              >
                {isActive ? 'o' : 'x'}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div className="ParoleEnChambre-footer">
        <span>{data.sessionLabel}</span>
        {data.nextSessionLabel && (
          <span>
            {t('nextSession')}&nbsp;{data.nextSessionLabel}
          </span>
        )}
      </div>

    </div>
  );
};

export default memo(ParoleEnChambre);
