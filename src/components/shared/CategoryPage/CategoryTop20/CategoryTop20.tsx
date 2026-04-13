import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Category from '../../../../models/Category';
import './CategoryTop20.scss';

type Country = 'QC' | 'CA';
type Trend = 'up' | 'down' | 'stable';

type RankItem = {
  rank: number;
  label: string;
  trend: Trend;
};

type Top20Payload = {
  generatedAt: string;
  medias: { QC: RankItem[]; CA: RankItem[] };
  decideurs: RankItem[];
  citoyens: RankItem[];
};

interface CategoryTop20Props {
  category: Category;
}

const trendSymbol: Record<Trend, string> = {
  up:     '↑',
  down:   '↓',
  stable: '→',
};

const CategoryTop20 = ({ category }: CategoryTop20Props) => {
  const { t } = useTranslation('CategoryTop20');
  const [payload, setPayload] = useState<Top20Payload | null>(null);
  const [country, setCountry] = useState<Country>('QC');

  useEffect(() => {
    fetch(`/data/top20.json?ts=${Date.now()}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setPayload)
      .catch(() => {});
  }, []);

  const isMedias = category === Category.MEDIA;

  const items: RankItem[] = (() => {
    if (!payload) return [];
    if (isMedias) return payload.medias[country];
    if (category === Category.AUTHORITIES) return payload.decideurs;
    if (category === Category.PUBLIC_OPINION) return payload.citoyens;
    return [];
  })();

  return (
    <div className="CategoryTop20">

      <div className="CategoryTop20-header">
        <span className="CategoryTop20-eyebrow">{t('eyebrow')}</span>
        {isMedias && (
          <div className="CategoryTop20-toggle" role="group" aria-label={t('countryToggle')}>
            {(['QC', 'CA'] as Country[]).map((c) => (
              <button
                key={c}
                type="button"
                className={`CategoryTop20-toggle-btn${country === c ? ' is-active' : ''}`}
                onClick={() => setCountry(c)}
              >
                {t(`countries.${c}`)}
              </button>
            ))}
          </div>
        )}
      </div>

      <ol className="CategoryTop20-list">
        {items.map((item) => (
          <li key={item.rank} className="CategoryTop20-item">
            <span className="CategoryTop20-rank">#{item.rank}</span>
            <span className="CategoryTop20-label">{item.label}</span>
            <span
              className="CategoryTop20-trend"
              data-trend={item.trend}
            >
              {trendSymbol[item.trend]}
            </span>
          </li>
        ))}
      </ol>

    </div>
  );
};

export default memo(CategoryTop20);
