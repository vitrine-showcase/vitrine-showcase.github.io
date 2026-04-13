import React, { memo, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { HeadlineOfHeadlines, HeadlineOfHeadlinesPayload, HotHeadline } from './headlineOfHeadlinesData';
import './UneDesUnes.scss';

type Country = 'QC' | 'CA';

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

interface UneDesUnesProps {
  hideRadarLink?: boolean;
}

const UneDesUnes = ({ hideRadarLink = false }: UneDesUnesProps): ReactElement => {
  const { t } = useTranslation('UneDesUnes');
  const [eyebrowLead, eyebrowAccent, eyebrowBridge, ...eyebrowTail] = t('eyebrow').split(' ')
  const navigate = useNavigate();
  const [payload, setPayload] = useState<HeadlineOfHeadlinesPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [country, setCountry] = useState<Country>('QC');

  useEffect(() => {
    fetch(`/data/headline-of-headlines.json?ts=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error('network');
        return res.json();
      })
      .then((data: HeadlineOfHeadlinesPayload) => {
        setPayload(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const handleRadarLink = useCallback(() => {
    navigate('/categorie/radarplus');
  }, [navigate]);

  const derived = useMemo(() => {
    if (!payload) return null;
    const data: HeadlineOfHeadlines = payload.countries[country];
    const headlineBySource = new Map<string, HotHeadline>(
      data.headlines.map((h) => [h.source, h]),
    );
    return { data, headlineBySource };
  }, [payload, country]);

  if (loading) {
    return (
      <div className="UneDesUnes UneDesUnes--state">
        <div className="UneDesUnes-eyebrow">
          {eyebrowLead}
          {eyebrowAccent && (
            <>
              {' '}
              <span className="has-font-secondary">{eyebrowAccent}</span>
            </>
          )}
          {eyebrowBridge && ` ${eyebrowBridge}`}
          {eyebrowTail.length > 0 && (
            <>
              {' '}
              <span className="has-font-secondary">{eyebrowTail.join(' ')}</span>
            </>
          )}
        </div>
        <p className="UneDesUnes-status">{t('loading')}</p>
      </div>
    );
  }

  if (error || !derived) {
    return (
      <div className="UneDesUnes UneDesUnes--state">
        <div className="UneDesUnes-eyebrow">
          {eyebrowLead}
          {eyebrowAccent && (
            <>
              {' '}
              <span className="has-font-secondary">{eyebrowAccent}</span>
            </>
          )}
          {eyebrowBridge && ` ${eyebrowBridge}`}
          {eyebrowTail.length > 0 && (
            <>
              {' '}
              <span className="has-font-secondary">{eyebrowTail.join(' ')}</span>
            </>
          )}
        </div>
        <p className="UneDesUnes-status">{t('error')}</p>
      </div>
    );
  }

  const { data, headlineBySource } = derived;
  const saillanceLevel = getSaillanceLevel(data.score);
  const velocityKey = getVelocityKey(data.velocity);
  const velocityDir = getVelocityDir(data.velocity);

  return (
    <div className="UneDesUnes">

      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="UneDesUnes-panel">

        <div className="UneDesUnes-panel-header">
          <div className="UneDesUnes-eyebrow">
            {eyebrowLead}
            {eyebrowAccent && (
              <>
                {' '}
                <span className="has-font-secondary">{eyebrowAccent}</span>
              </>
            )}
            {eyebrowBridge && ` ${eyebrowBridge}`}
            {eyebrowTail.length > 0 && (
              <>
                {' '}
                <span className="has-font-secondary">{eyebrowTail.join(' ')}</span>
              </>
            )}
          </div>
          <div className="UneDesUnes-toggle" role="group" aria-label={t('countryToggle')}>
            {(['QC', 'CA'] as Country[]).map((c) => (
              <button
                key={c}
                type="button"
                className={`UneDesUnes-toggle-btn${country === c ? ' is-active' : ''}`}
                onClick={() => setCountry(c)}
              >
                {t(`countries.${c}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="UneDesUnes-story">
          <p className="UneDesUnes-hook">{t('hook')}</p>
          <h2 className="UneDesUnes-title">
            &laquo;&nbsp;{data.title}&nbsp;&raquo;
          </h2>
        </div>

        <div className="UneDesUnes-bottom">

          <div className="UneDesUnes-saillance">
            <div className="UneDesUnes-saillance-header">
              <span className="UneDesUnes-saillance-label">
                {t('saillance.label')}
              </span>
              <span
                className="UneDesUnes-velocity"
                data-dir={velocityDir}
              >
                {t(`velocity.${velocityKey}`)}
              </span>
            </div>
            <div className="UneDesUnes-saillance-track">
              <div
                className="UneDesUnes-saillance-fill"
                style={{ width: `${Math.round(data.score * 100)}%` }}
              />
            </div>
            <span
              className="UneDesUnes-saillance-level"
              data-level={saillanceLevel}
            >
              {t(`saillance.${saillanceLevel}`)}
            </span>
          </div>

          <div className="UneDesUnes-objects">
            {data.objects.slice(0, 3).map((obj, i) => (
              <div key={obj.label} className="UneDesUnes-object">
                <span className="UneDesUnes-object-label">{obj.label}</span>
                <div className="UneDesUnes-object-track">
                  <div
                    className="UneDesUnes-object-fill"
                    style={{ width: `${Math.round(obj.score * 100)}%` }}
                  />
                </div>
                <span className="UneDesUnes-object-rank has-font-secondary">
                  #{i + 1}
                </span>
              </div>
            ))}
            {!hideRadarLink && (
              <button
                type="button"
                className="UneDesUnes-radar-link has-font-secondary"
                onClick={handleRadarLink}
              >
                {t('radarLink')}
              </button>
            )}
          </div>

        </div>

      </div>

      {/* ── Coverage grid ───────────────────────────────────────── */}
      <div className="UneDesUnes-coverage">
        {data.monitoredSources.map((source, index) => {
          const headline = headlineBySource.get(source);
          const isOdd = data.monitoredSources.length % 2 !== 0;
          const isLast = index === data.monitoredSources.length - 1;
          const spanClass = isOdd && isLast ? ' UneDesUnes-tile--span' : '';

          if (headline) {
            return (
              <a
                key={source}
                href={headline.url}
                className={`UneDesUnes-tile UneDesUnes-tile--covering${spanClass}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="UneDesUnes-tile-header">
                  <span className="UneDesUnes-tile-source has-font-secondary">
                    {source}
                  </span>
                  <span className="UneDesUnes-tile-time">{headline.time}</span>
                </div>
                <p className="UneDesUnes-tile-headline">{headline.title}</p>
                <span className="UneDesUnes-tile-indicator UneDesUnes-tile-indicator--yes has-font-secondary" aria-hidden="true">o</span>
              </a>
            );
          }

          return (
            <div
              key={source}
              className={`UneDesUnes-tile UneDesUnes-tile--silent${spanClass}`}
            >
              <span className="UneDesUnes-tile-source has-font-secondary">
                {source}
              </span>
              <span className="UneDesUnes-tile-silent-label">
                {t('notCovering')}
              </span>
              <span className="UneDesUnes-tile-indicator UneDesUnes-tile-indicator--no has-font-secondary" aria-hidden="true">x</span>
            </div>
          );
        })}
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div className="UneDesUnes-footer">
        <span className="UneDesUnes-snapshot">{data.snapshotLabel}</span>
        {data.nextLabel && (
          <span className="UneDesUnes-next">
            {t('nextUpdate')}&nbsp;{data.nextLabel}
          </span>
        )}
      </div>

    </div>
  );
};

export default memo(UneDesUnes);
