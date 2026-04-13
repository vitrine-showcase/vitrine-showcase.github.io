import React, { memo, ReactElement, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './MediaTicker.scss';

// ── Types ─────────────────────────────────────────────────────────────────────
type TickerItem = {
  ts_utc: string;
  media_id: string;
  country_id: string | null;
  title: string;
  url: string;
};

type TickerPayload = {
  meta: { generated_at: string; lookback_hours: number; max_items: number };
  items: TickerItem[];
};

// ── Constants ─────────────────────────────────────────────────────────────────
const tickerSpeed = 80; // px/s — controls how fast headlines scroll

// ── Component ─────────────────────────────────────────────────────────────────
const MediaTicker = (): ReactElement => {
  const { t, i18n } = useTranslation('MediaTicker');
  const [items, setItems] = useState<TickerItem[]>([]);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Add body padding while ticker is mounted, remove on unmount
  useEffect(() => {
    document.body.style.paddingBottom = '60px';
    return () => { document.body.style.paddingBottom = ''; };
  }, []);

  // Fetch ticker data
  useEffect(() => {
    fetch(`/data/ticker.json?ts=${Date.now()}`)
      .then((r) => {
        if (!r.ok) throw new Error('fetch');
        return r.json() as Promise<TickerPayload>;
      })
      .then((data) => {
        setItems(data.items ?? []);
        setGeneratedAt(data.meta?.generated_at ?? null);
      })
      .catch(() => setItems([]));
  }, []);

  // After items render, measure first strip and compute scroll duration
  useEffect(() => {
    if (items.length === 0) return;
    const track = trackRef.current;
    if (!track) return;
    requestAnimationFrame(() => {
      const strip = track.querySelector<HTMLElement>('.MediaTicker-strip');
      const px = strip?.scrollWidth ?? 1600;
      const duration = Math.max(30, Math.round(px / tickerSpeed));
      track.style.setProperty('--ticker-duration', `${duration}s`);
      setReady(true);
    });
  }, [items]);

  const timeLabel = generatedAt
    ? new Date(generatedAt).toLocaleTimeString(i18n.language === 'fr' ? 'fr-CA' : 'en-CA', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const renderStrip = (keyPrefix: string): ReactElement => (
    <div className="MediaTicker-strip">
      {items.map((item, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={`${keyPrefix}-${idx}`}>
          <a
            className="MediaTicker-item"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="MediaTicker-media">{item.media_id}</span>
            {item.title}
          </a>
          <span className="MediaTicker-sep" aria-hidden="true">•</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className={`MediaTicker${ready ? ' is-ready' : ''}`}>
      <div className="MediaTicker-label">
        <span className="MediaTicker-label-title">{t('label')}</span>
        {timeLabel && (
          <span className="MediaTicker-label-time">{timeLabel}</span>
        )}
      </div>
      <div className="MediaTicker-viewport">
        <div className="MediaTicker-track" ref={trackRef}>
          {items.length === 0 ? (
            <span className="MediaTicker-empty">{t('loading')}</span>
          ) : (
            <>
              {renderStrip('a')}
              <div aria-hidden="true">{renderStrip('b')}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(MediaTicker);
