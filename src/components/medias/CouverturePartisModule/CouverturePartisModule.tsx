import React, { memo, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CouverturePartisModule.scss';

// ── Types ─────────────────────────────────────────────────────────────────────
type TrendKey = 'upStrong' | 'up' | 'stable' | 'down' | 'downStrong';

type PartyEntry = {
  key: string;
  label: string;
  color: string;
  sov: number; // today's share of voice, 0–1
  tone: number; // −1 (very negative) to +1 (very positive)
  trend: TrendKey;
  inShadow: boolean; // minor / eclipsed party
  logoUrl: string;
  history: number[]; // 7-day SOV (0–1), oldest first
};

type Scope = 'provincial' | 'federal';
type TimeRange = 'today' | '7days' | 'month';

// ── Mock data ─────────────────────────────────────────────────────────────────
// Each party has history arrays per time range:
//   today  – 6 hourly snapshots
//   7days  – 7 daily snapshots (original)
//   month  – 30 daily snapshots

type HistoryByRange = Record<TimeRange, number[]>;

type PartyData = Omit<PartyEntry, 'history'> & { histories: HistoryByRange };

const provPartiesData: PartyData[] = [
  {
    key: 'plq',
    label: 'PLQ',
    color: '#CD202C',
    sov: 0.597,
    tone: -0.18,
    trend: 'stable',
    inShadow: false,
    logoUrl: '/logos/parties/plq.png',
    histories: {
      today: [0.59, 0.6, 0.61, 0.6, 0.59, 0.6],
      '7days': [0.61, 0.58, 0.6, 0.63, 0.59, 0.61, 0.6],
      month: [
        0.55, 0.56, 0.57, 0.58, 0.57, 0.59, 0.58, 0.6, 0.61, 0.58, 0.6, 0.63, 0.59, 0.61, 0.6, 0.59, 0.58, 0.6, 0.61,
        0.59, 0.6, 0.62, 0.61, 0.59, 0.6, 0.61, 0.6, 0.59, 0.6, 0.6,
      ],
    },
  },
  {
    key: 'caq',
    label: 'CAQ',
    color: '#002855',
    sov: 0.154,
    tone: -0.07,
    trend: 'up',
    inShadow: false,
    logoUrl: '/logos/parties/caq.png',
    histories: {
      today: [0.14, 0.15, 0.15, 0.15, 0.16, 0.154],
      '7days': [0.12, 0.13, 0.13, 0.14, 0.14, 0.15, 0.154],
      month: [
        0.1, 0.1, 0.11, 0.11, 0.11, 0.12, 0.12, 0.12, 0.13, 0.13, 0.13, 0.14, 0.14, 0.15, 0.154, 0.15, 0.14, 0.14, 0.15,
        0.15, 0.15, 0.14, 0.15, 0.15, 0.15, 0.15, 0.14, 0.15, 0.15, 0.154,
      ],
    },
  },
  {
    key: 'qs',
    label: 'QS',
    color: '#FF5A36',
    sov: 0.13,
    tone: 0.17,
    trend: 'upStrong',
    inShadow: false,
    logoUrl: '/logos/parties/qs.png',
    histories: {
      today: [0.12, 0.12, 0.13, 0.13, 0.13, 0.13],
      '7days': [0.08, 0.09, 0.1, 0.11, 0.11, 0.12, 0.13],
      month: [
        0.06, 0.06, 0.07, 0.07, 0.07, 0.08, 0.08, 0.09, 0.09, 0.1, 0.1, 0.11, 0.11, 0.12, 0.13, 0.12, 0.12, 0.13, 0.13,
        0.12, 0.13, 0.12, 0.13, 0.13, 0.13, 0.12, 0.13, 0.13, 0.13, 0.13,
      ],
    },
  },
  {
    key: 'pq',
    label: 'PQ',
    color: '#003DA5',
    sov: 0.09,
    tone: 0.04,
    trend: 'down',
    inShadow: false,
    logoUrl: '/logos/parties/pq.png',
    histories: {
      today: [0.09, 0.09, 0.09, 0.09, 0.09, 0.09],
      '7days': [0.11, 0.1, 0.1, 0.1, 0.09, 0.09, 0.09],
      month: [
        0.13, 0.13, 0.12, 0.12, 0.12, 0.11, 0.11, 0.11, 0.1, 0.1, 0.1, 0.1, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09,
        0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09,
      ],
    },
  },
  {
    key: 'pcq',
    label: 'PCQ',
    color: '#5B2D8E',
    sov: 0.008,
    tone: -0.11,
    trend: 'downStrong',
    inShadow: true,
    logoUrl: '/logos/parties/pcq.png',
    histories: {
      today: [0.01, 0.01, 0.01, 0.008, 0.008, 0.008],
      '7days': [0.02, 0.02, 0.01, 0.01, 0.01, 0.01, 0.008],
      month: [
        0.04, 0.04, 0.03, 0.03, 0.03, 0.02, 0.02, 0.02, 0.02, 0.02, 0.01, 0.01, 0.01, 0.01, 0.008, 0.01, 0.01, 0.01,
        0.008, 0.008, 0.008, 0.008, 0.008, 0.008, 0.008, 0.008, 0.008, 0.008, 0.008, 0.008,
      ],
    },
  },
];

const fedPartiesData: PartyData[] = [
  {
    key: 'lpc',
    label: 'PLC',
    color: '#D71920',
    sov: 0.293,
    tone: -0.16,
    trend: 'up',
    inShadow: false,
    logoUrl: '/logos/parties/lpc.png',
    histories: {
      today: [0.28, 0.29, 0.29, 0.29, 0.3, 0.293],
      '7days': [0.25, 0.26, 0.27, 0.27, 0.28, 0.29, 0.293],
      month: [
        0.22, 0.22, 0.23, 0.23, 0.24, 0.24, 0.25, 0.25, 0.26, 0.26, 0.27, 0.27, 0.28, 0.29, 0.293, 0.29, 0.29, 0.29,
        0.29, 0.29, 0.29, 0.3, 0.29, 0.29, 0.29, 0.29, 0.3, 0.29, 0.29, 0.293,
      ],
    },
  },
  {
    key: 'cpc',
    label: 'PCC',
    color: '#1A4782',
    sov: 0.261,
    tone: -0.24,
    trend: 'down',
    inShadow: false,
    logoUrl: '/logos/parties/cpc.png',
    histories: {
      today: [0.27, 0.26, 0.26, 0.26, 0.26, 0.261],
      '7days': [0.3, 0.29, 0.29, 0.28, 0.27, 0.26, 0.261],
      month: [
        0.33, 0.33, 0.32, 0.32, 0.31, 0.31, 0.3, 0.3, 0.29, 0.29, 0.29, 0.28, 0.27, 0.26, 0.261, 0.26, 0.26, 0.26, 0.26,
        0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.261,
      ],
    },
  },
  {
    key: 'bq',
    label: 'BQ',
    color: '#0D4E8A',
    sov: 0.187,
    tone: -0.09,
    trend: 'stable',
    inShadow: false,
    logoUrl: '/logos/parties/bq.png',
    histories: {
      today: [0.19, 0.19, 0.18, 0.19, 0.19, 0.187],
      '7days': [0.19, 0.19, 0.18, 0.19, 0.18, 0.19, 0.187],
      month: [
        0.18, 0.18, 0.19, 0.19, 0.19, 0.19, 0.19, 0.19, 0.18, 0.19, 0.18, 0.19, 0.18, 0.19, 0.187, 0.19, 0.19, 0.19,
        0.18, 0.19, 0.19, 0.19, 0.18, 0.19, 0.19, 0.19, 0.18, 0.19, 0.19, 0.187,
      ],
    },
  },
  {
    key: 'ndp',
    label: 'NPD',
    color: '#F37021',
    sov: 0.123,
    tone: 0.07,
    trend: 'stable',
    inShadow: false,
    logoUrl: '/logos/parties/ndp.png',
    histories: {
      today: [0.12, 0.12, 0.12, 0.12, 0.12, 0.123],
      '7days': [0.13, 0.12, 0.12, 0.12, 0.12, 0.12, 0.123],
      month: [
        0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.123, 0.12, 0.12, 0.12,
        0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.123,
      ],
    },
  },
  {
    key: 'gpc',
    label: 'PVC',
    color: '#3D9B35',
    sov: 0.014,
    tone: 0.15,
    trend: 'downStrong',
    inShadow: true,
    logoUrl: '/logos/parties/gpc.png',
    histories: {
      today: [0.01, 0.01, 0.01, 0.01, 0.014, 0.014],
      '7days': [0.03, 0.02, 0.02, 0.02, 0.02, 0.01, 0.014],
      month: [
        0.04, 0.04, 0.04, 0.03, 0.03, 0.03, 0.03, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.01, 0.014, 0.01, 0.01, 0.01,
        0.01, 0.014, 0.014, 0.014, 0.014, 0.014, 0.014, 0.014, 0.014, 0.014, 0.014, 0.014,
      ],
    },
  },
  {
    key: 'ppc',
    label: 'PPC',
    color: '#8B0000',
    sov: 0.011,
    tone: -0.05,
    trend: 'downStrong',
    inShadow: true,
    logoUrl: '/logos/parties/ppc.png',
    histories: {
      today: [0.01, 0.01, 0.01, 0.011, 0.011, 0.011],
      '7days': [0.02, 0.02, 0.01, 0.01, 0.01, 0.01, 0.011],
      month: [
        0.03, 0.03, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.011, 0.01, 0.01, 0.01,
        0.011, 0.011, 0.011, 0.011, 0.011, 0.011, 0.011, 0.011, 0.011, 0.011, 0.011, 0.011,
      ],
    },
  },
];

// Helper to resolve history for the active time range
const resolveParties = (data: PartyData[], range: TimeRange): PartyEntry[] =>
  data.map((d) => ({ ...d, history: d.histories[range] }));

// ── Helpers ───────────────────────────────────────────────────────────────────
const trendGlyph: Record<TrendKey, string> = {
  upStrong: '↑↑',
  up: '↑',
  stable: '→',
  down: '↓',
  downStrong: '↓↓',
};

const toneToRgb = (tone: number): [number, number, number] => {
  const neg: [number, number, number] = [215, 25, 32];
  const neu: [number, number, number] = [160, 160, 160];
  const pos: [number, number, number] = [36, 176, 62];
  if (tone <= 0) {
    const t = tone + 1;
    return neg.map((c, j) => Math.round(c + (neu[j] - c) * t)) as [number, number, number];
  }
  return neu.map((c, j) => Math.round(c + (pos[j] - c) * tone)) as [number, number, number];
};

// Build SVG polyline points string from a history array
const sparkPoints = (history: number[], w: number, h: number): string => {
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 0.001;
  return history
    .map((v, i) => {
      const x = (i / (history.length - 1)) * w;
      const y = h - ((v - min) / range) * (h * 0.8) - h * 0.1;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
};

// ── Party row ─────────────────────────────────────────────────────────────────
const sparkW = 72;
const sparkH = 28;

const PartyRow = ({ party, maxSov }: { party: PartyEntry; maxSov: number }): ReactElement => {
  const sovPct = Math.round(party.sov * 100);
  const barPct = (party.sov / maxSov) * 100;
  const dotPct = ((party.tone + 1) / 2) * 100; // 0% = far left (neg), 100% = far right (pos)
  const [tr, tg, tb] = toneToRgb(party.tone);
  const toneColor = `rgb(${tr},${tg},${tb})`;
  const pts = sparkPoints(party.history, sparkW, sparkH);
  const lastX = sparkW;
  const lastY = (() => {
    const min = Math.min(...party.history);
    const max = Math.max(...party.history);
    const range = max - min || 0.001;
    return sparkH - ((party.history[party.history.length - 1] - min) / range) * (sparkH * 0.8) - sparkH * 0.1;
  })();

  return (
    <div className={`CouvPartis-row${party.inShadow ? ' is-shadow' : ''}`}>
      {/* Logo */}
      <div className="CouvPartis-row-logo" style={{ borderColor: party.color }}>
        <img src={party.logoUrl} alt={party.label} draggable={false} />
      </div>

      {/* Name + SOV bar */}
      <div className="CouvPartis-row-identity">
        <span className="CouvPartis-row-name has-font-secondary">{party.label}</span>
        <div className="CouvPartis-row-sovbar">
          <div className="CouvPartis-row-sovfill" style={{ width: `${barPct}%`, backgroundColor: party.color }} />
        </div>
      </div>

      {/* SOV % + trend */}
      <div className="CouvPartis-row-sov">
        <span className="CouvPartis-row-sovpct has-font-secondary">{sovPct}%</span>
        <span className="CouvPartis-row-trend has-font-secondary" style={{ color: toneColor }}>
          {trendGlyph[party.trend]}
        </span>
      </div>

      {/* Tone scale */}
      <div className="CouvPartis-row-tonescale" aria-label="Ton de la couverture médiatique">
        <div className="CouvPartis-row-tonebar">
          <div
            className="CouvPartis-row-tonedot"
            style={{ left: `${dotPct}%`, borderColor: toneColor, backgroundColor: toneColor }}
          />
        </div>
      </div>

      {/* Sparkline */}
      <svg className="CouvPartis-row-spark" width={sparkW} height={sparkH} aria-hidden="true">
        {/* Area fill */}
        <polyline
          points={`0,${sparkH} ${pts} ${sparkW},${sparkH}`}
          fill={party.color}
          fillOpacity={0.12}
          stroke="none"
        />
        {/* Line */}
        <polyline
          points={pts}
          fill="none"
          stroke={party.color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Today dot */}
        <circle cx={lastX} cy={lastY} r={2.5} fill={party.color} />
      </svg>
    </div>
  );
};

// ── Module ────────────────────────────────────────────────────────────────────
const CouverturePartisModule = (): ReactElement => {
  const { t } = useTranslation('CouverturePartisModule');
  const [titleLead, titleAccent, titleBridge, ...titleTail] = t('title').split(' ');
  const [scope, setScope] = useState<Scope>('provincial');
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');

  const allParties = resolveParties(scope === 'provincial' ? provPartiesData : fedPartiesData, timeRange);
  const active = [...allParties].filter((p) => !p.inShadow).sort((a, b) => b.sov - a.sov);
  const shadows = [...allParties].filter((p) => p.inShadow).sort((a, b) => b.sov - a.sov);
  const maxSov = active[0]?.sov ?? 1;

  return (
    <div className="CouverturePartisModule">
      {/* Header */}
      <div className="CouverturePartisModule-header">
        <div className="CouverturePartisModule-header-row">
          <div className="CouverturePartisModule-header-text">
            <span className="CouverturePartisModule-eyebrow">{t('eyebrow')}</span>
            <h2 className="CouverturePartisModule-title">
              {titleLead}
              {titleAccent && (
                <>
                  {' '}
                  <span className="has-font-secondary">{titleAccent}</span>
                </>
              )}
              {titleBridge && ` ${titleBridge}`}
              {titleTail.length > 0 && (
                <>
                  {' '}
                  <span className="has-font-secondary">{titleTail.join(' ')}</span>
                </>
              )}
            </h2>
          </div>
          <div className="CouverturePartisModule-tabGroup">
            <div className="CouverturePartisModule-tabs">
              {(['provincial', 'federal'] as Scope[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`CouverturePartisModule-tab${scope === s ? ' is-active' : ''}`}
                  onClick={() => setScope(s)}
                >
                  {t(`scopes.${s}`)}
                </button>
              ))}
            </div>
            <div className="CouverturePartisModule-tabs CouverturePartisModule-tabs--range">
              {(['today', '7days', 'month'] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`CouverturePartisModule-tab${timeRange === r ? ' is-active' : ''}`}
                  onClick={() => setTimeRange(r)}
                >
                  {{ today: "Aujourd'hui", '7days': '7 jours', month: 'Ce mois-ci' }[r]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="CouverturePartisModule-desc">{t('description')}</p>
      </div>

      {/* Column labels */}
      <div className="CouvPartis-colheads">
        <span className="CouvPartis-colhead-party">Parti</span>
        <span className="CouvPartis-colhead-sov">Part&nbsp;de&nbsp;voix&nbsp;·&nbsp;Tendance</span>
        <span className="CouvPartis-colhead-tone">Ton de la couverture</span>
        <span className="CouvPartis-colhead-spark">
          {{ today: "Aujourd'hui", '7days': '7 derniers jours', month: 'Ce mois-ci' }[timeRange]}
        </span>
      </div>

      {/* Active parties */}
      <div className="CouvPartis-list">
        {active.map((p) => (
          <PartyRow key={p.key} party={p} maxSov={maxSov} />
        ))}

        {/* Shadow divider */}
        {shadows.length > 0 && <div className="CouvPartis-shadowdivider">Dans l&apos;ombre médiatique</div>}
        {shadows.map((p) => (
          <PartyRow key={p.key} party={p} maxSov={maxSov} />
        ))}
      </div>

      <div className="CouverturePartisModule-footer">
        <span className="CouverturePartisModule-source">{t('source')}</span>
      </div>
    </div>
  );
};

export default memo(CouverturePartisModule);
