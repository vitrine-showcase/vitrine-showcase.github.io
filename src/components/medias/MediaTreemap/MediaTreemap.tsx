import React, {
  memo,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import {
  MediaTreemapHeadline,
  MediaTreemapIssue,
  MediaTreemapPayload,
  MediaTreemapPeriod,
  MediaTreemapPeriodData,
} from './mediaTreemapData';

import './MediaTreemap.scss';

type TreemapRect = {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const isTreemapEnabled = process.env.REACT_APP_ENABLE_MEDIA_TREEMAP === 'true';
const periodOrder: MediaTreemapPeriod[] = ['day', 'week', 'month'];

const getVelocityState = (velocity: number): 'up' | 'down' | 'stable' => {
  if (velocity > 0) return 'up';
  if (velocity < 0) return 'down';
  return 'stable';
};

const getCellTone = (velocity: number): { background: string; border: string } => {
  const state = getVelocityState(velocity);

  if (state === 'up') {
    return { background: 'rgba(36, 176, 62, 0.14)', border: 'rgba(36, 176, 62, 0.38)' };
  }

  if (state === 'down') {
    return { background: 'rgba(255, 43, 6, 0.12)', border: 'rgba(255, 43, 6, 0.34)' };
  }

  return { background: 'rgba(122, 122, 122, 0.12)', border: 'rgba(122, 122, 122, 0.28)' };
};

const squarify = (items: MediaTreemapIssue[], x: number, y: number, w: number, h: number): TreemapRect[] => {
  if (!items.length) {
    return [];
  }

  if (items.length === 1) {
    return [{ key: items[0].key, x, y, w, h }];
  }

  const total = items.reduce((sum, item) => sum + item.score, 0);
  const sorted = [...items].sort((a, b) => b.score - a.score);

  let bestSplit = 1;
  let bestDiff = Number.POSITIVE_INFINITY;
  let runningSum = 0;

  sorted.slice(0, -1).forEach((item, index) => {
    runningSum += item.score;
    const diff = Math.abs(runningSum / total - 0.5);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestSplit = index + 1;
    }
  });

  const group1 = sorted.slice(0, bestSplit);
  const group2 = sorted.slice(bestSplit);
  const ratio1 = group1.reduce((sum, item) => sum + item.score, 0) / total;

  if (w >= h) {
    const width1 = w * ratio1;
    return [
      ...squarify(group1, x, y, width1, h),
      ...squarify(group2, x + width1, y, w - width1, h),
    ];
  }

  const height1 = h * ratio1;
  return [
    ...squarify(group1, x, y, w, height1),
    ...squarify(group2, x, y + height1, w, h - height1),
  ];
};

const MediaTreemap = (): ReactElement | null => {
  const { t } = useTranslation('MediaTreemap');
  const [titleLead, titleAccent, ...titleTail] = t('title').split(' ');
  const containerRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [payload, setPayload] = useState<MediaTreemapPayload>();
  const [activePeriod, setActivePeriod] = useState<MediaTreemapPeriod>('day');
  const [selectedKey, setSelectedKey] = useState('');
  const [width, setWidth] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const rankChartRef = useRef<SVGSVGElement>(null);
  const [hoveredSnapIdx, setHoveredSnapIdx] = useState<number | null>(null);
  const [hoveredIssueKey, setHoveredIssueKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isTreemapEnabled) {
      return undefined;
    }

    let isMounted = true;

    fetch(`/data/media-treemap.json?ts=${Date.now()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('media-treemap-fetch-failed');
        }
        return response.json() as Promise<MediaTreemapPayload>;
      })
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setPayload(data);
        setStatus('ready');
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }
        setStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const element = surfaceRef.current;

    if (!element) {
      return undefined;
    }

    setWidth(element.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [status, activePeriod]);

  const periodData = payload?.periods?.[activePeriod] as MediaTreemapPeriodData | undefined;

  useEffect(() => {
    if (!periodData || periodData.issues.length === 0) {
      return;
    }

    const isStillValid = periodData.issues.some(({ key }) => key === selectedKey);
    if (!isStillValid) {
      setSelectedKey(periodData.issues[0].key);
    }
  }, [periodData, selectedKey]);

  let canvasHeight = 420;
  if (width > 960) {
    canvasHeight = 640;
  } else if (width > 720) {
    canvasHeight = 560;
  }

  const layout = useMemo(
    () => squarify(periodData?.issues || [], 0, 0, Math.max(width - 24, 280), canvasHeight),
    [periodData, width, canvasHeight],
  );

  const selectedIssue = periodData?.issues.find(({ key }) => key === selectedKey) || periodData?.issues[0];

  // Rank chart: rank each issue at every history snapshot of the active period
  const rankHistory = useMemo(() => {
    if (!periodData?.history || !periodData?.issues) return [];
    return periodData.history
      .filter((snap) => snap.scores !== null)
      .map((snap) => {
        const sorted = [...periodData.issues].sort(
          (a, b) => (snap.scores?.[b.key] ?? 0) - (snap.scores?.[a.key] ?? 0),
        );
        const ranks: Record<string, number> = {};
        sorted.forEach((issue, i) => { ranks[issue.key] = i + 1; });
        return { label: snap.label, ranks, scores: snap.scores as Record<string, number> };
      });
  }, [periodData]);

  // Chart geometry constants (stable for a given periodData)
  const rankN = rankHistory.length;
  const rankCount = periodData?.issues.length ?? 12;
  const rankW = 420; const rankH = 320;
  const rankPl = 28; const rankPr = 88; const rankPt = 14; const rankPb = 28;
  const rankPw = rankW - rankPl - rankPr;
  const rankPh = rankH - rankPt - rankPb;
  const rankX = (i: number): number => rankPl + (rankN <= 1 ? rankPw / 2 : (i / (rankN - 1)) * rankPw);
  const rankY = (r: number): number => rankPt + ((r - 1) / Math.max(rankCount - 1, 1)) * rankPh;
  const tooltipIssueKey = hoveredIssueKey ?? selectedKey
  const tooltipIssue = periodData?.issues.find(({ key }) => key === tooltipIssueKey) || selectedIssue
  const tooltipRank = hoveredSnapIdx !== null && tooltipIssue ? rankHistory[hoveredSnapIdx]?.ranks[tooltipIssue.key] : null
  const tooltipScore = hoveredSnapIdx !== null && tooltipIssue ? rankHistory[hoveredSnapIdx]?.scores[tooltipIssue.key] : null

  const chartLabels = useMemo(() => {
    if (!periodData || rankN < 1 || !selectedIssue) return []

    const labelKeys = new Set<string>([selectedIssue.key])
    if (hoveredIssueKey) {
      labelKeys.add(hoveredIssueKey)
    }

    const labels = Array.from(labelKeys)
      .map((key) => {
        const issue = periodData.issues.find((candidate) => candidate.key === key)
        const rank = rankHistory[rankN - 1]?.ranks[key]
        if (!issue || rank == null) return null
        return {
          key,
          text: issue.tag,
          color: issue.color,
          y: rankY(rank),
        }
      })
      .filter((label): label is { key: string; text: string; color: string; y: number } => label !== null)
      .sort((a, b) => a.y - b.y)

    for (let index = 1; index < labels.length; index += 1) {
      if (labels[index].y - labels[index - 1].y < 16) {
        labels[index].y = labels[index - 1].y + 16
      }
    }

    return labels
  }, [hoveredIssueKey, periodData, rankHistory, rankN, selectedIssue])

  const handleChartMove = (e: React.MouseEvent<SVGSVGElement>): void => {
    const svgEl = rankChartRef.current;
    if (!svgEl || rankN < 2) return;
    const { left, width: svgW } = svgEl.getBoundingClientRect();
    const svgX = ((e.clientX - left) / svgW) * rankW;
    const nearest = rankHistory.reduce(
      (best, _, i) => (Math.abs(rankX(i) - svgX) < Math.abs(rankX(best) - svgX) ? i : best),
      0,
    );
    setHoveredSnapIdx(nearest);
  };

  if (!isTreemapEnabled) {
    return null;
  }

  return (
    <section className="MediaTreemap" ref={containerRef}>
      <header className="MediaTreemap-header">
        <div>
          <span className="MediaTreemap-eyebrow">{t('eyebrow')}</span>
          <h3 className="MediaTreemap-title">
            {titleLead}
            {titleAccent && (
              <>
                {' '}
                <span className="has-font-secondary">{titleAccent}</span>
              </>
            )}
            {titleTail.length > 0 && ` ${titleTail.join(' ')}`}
          </h3>
          <p className="MediaTreemap-subtitle">{t('subtitle')}</p>
        </div>
        <div className="MediaTreemap-meta">
          <div className="MediaTreemap-controls" role="tablist" aria-label={t('controls.ariaLabel') as string}>
            {periodOrder.map((periodKey) => {
              const label = payload?.periods?.[periodKey]?.label || t(`controls.${periodKey}`);
              return (
                <button
                  type="button"
                  key={periodKey}
                  className={`MediaTreemap-control${activePeriod === periodKey ? ' is-active' : ''}`}
                  onClick={() => setActivePeriod(periodKey)}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <span className="MediaTreemap-stamp">{periodData?.snapshotLabel || t('loading')}</span>
          <span className="MediaTreemap-next">{periodData?.nextLabel || t('subtitle')}</span>
        </div>
      </header>

      {status === 'loading' && (
        <div className="MediaTreemap-status">{t('loading')}</div>
      )}

      {status === 'error' && (
        <div className="MediaTreemap-status is-error">{t('error')}</div>
      )}

      {status === 'ready' && periodData && selectedIssue && (
        <>
          <div className="MediaTreemap-board">
            <div className="MediaTreemap-surface" ref={surfaceRef}>
              <div className="MediaTreemap-canvas" style={{ height: `${canvasHeight}px` }}>
                {layout.map((rect) => {
                  const item = periodData.issues.find(({ key }) => key === rect.key);

                  if (!item) {
                    return null;
                  }

                  const inset = 4;
                  const cellWidth = Math.max(rect.w - inset * 2, 64);
                  const cellHeight = Math.max(rect.h - inset * 2, 56);
                  const isTiny = cellWidth < 110 || cellHeight < 78;
                  const isMedium = cellWidth > 140 && cellHeight > 120;
                  const canShowMeta = cellWidth > 260 && cellHeight > 240;
                  let headerReserve = 74;
                  let headlineSlotHeight = 40;

                  if (isTiny) {
                    headerReserve = 44;
                  } else if (canShowMeta) {
                    headerReserve = 92;
                  }

                  if (canShowMeta) {
                    headlineSlotHeight = 72;
                  } else if (cellWidth > 180) {
                    headlineSlotHeight = 50;
                  }

                  const maxHeadlineCount = isTiny
                    ? 0
                    : Math.max(1, Math.min(item.headlines.length, Math.floor((cellHeight - headerReserve) / headlineSlotHeight)));
                  const visibleHeadlines: MediaTreemapHeadline[] = item.headlines.slice(0, maxHeadlineCount);

                  let cellPadding = '1rem';
                  const velocityState = getVelocityState(item.velocity);
                  let velocityClass = 'is-stable';
                  let velocityLabel = '→0%';
                  const cellTone = getCellTone(item.velocity);

                  if (velocityState === 'up') {
                    velocityClass = 'is-up';
                    velocityLabel = `↑${Math.abs(item.velocity)}%`;
                  } else if (velocityState === 'down') {
                    velocityClass = 'is-down';
                    velocityLabel = `↓${Math.abs(item.velocity)}%`;
                  }

                  if (isTiny) {
                    cellPadding = '0.55rem';
                  } else if (isMedium) {
                    cellPadding = '0.9rem';
                  }

                  return (
                    <button
                      type="button"
                      key={item.key}
                      className={`MediaTreemap-cell${selectedIssue.key === item.key ? ' is-selected' : ''}`}
                      onClick={() => setSelectedKey(item.key)}
                      style={{
                        left: `${rect.x + inset}px`,
                        top: `${rect.y + inset}px`,
                        width: `${cellWidth}px`,
                        height: `${cellHeight}px`,
                        background: cellTone.background,
                        border: `1px solid ${cellTone.border}`,
                        padding: cellPadding,
                      }}
                    >
                      <div className="MediaTreemap-cellHeader">
                        {isTiny ? <span className="MediaTreemap-dot" style={{ backgroundColor: item.color }} /> : null}
                        {!isTiny ? (
                          <span
                            className="MediaTreemap-tag"
                            style={{
                              backgroundColor: item.color,
                            }}
                          >
                            {item.label}
                          </span>
                        ) : null}
                        <span className="MediaTreemap-score">{(item.score * 100).toFixed(1)}%</span>
                        <span className={`MediaTreemap-velocity ${velocityClass}`}>{velocityLabel}</span>
                      </div>

                      {visibleHeadlines.length > 0 ? (
                        <div className="MediaTreemap-headlineList">
                          {visibleHeadlines.map((headline, index) => (
                            <article key={`${item.key}-${headline.time}-${headline.source}`} className={`MediaTreemap-headlineItem${index > 0 ? ' is-secondary' : ''}`}>
                              <p className="MediaTreemap-headlineTitle">{headline.title}</p>
                              {canShowMeta ? (
                                <span className="MediaTreemap-headlineMeta">{headline.source} · {headline.time}</span>
                              ) : null}
                            </article>
                          ))}
                        </div>
                      ) : (
                        <p className="MediaTreemap-headlineSingle">{item.headlines[0]?.title}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className="MediaTreemap-aside">
              <div className="MediaTreemap-asideMain">
                <section className="MediaTreemap-panel">
                  <div className="MediaTreemap-panelHeader">
                    <div>
                      <span className="MediaTreemap-detailTag" style={{ backgroundColor: selectedIssue.color }}>
                        {selectedIssue.label}
                      </span>
                      <p className="MediaTreemap-detailText">{t('detail.coverage', { score: (selectedIssue.score * 100).toFixed(1) })}</p>
                    </div>
                  </div>

                  <p className="MediaTreemap-detailMeta">
                    {t('detail.compare', {
                      previous: (selectedIssue.prevScore * 100).toFixed(1),
                    })}
                  </p>
                  <p className={`MediaTreemap-detailVelocity ${selectedIssue.velocity > 0 ? 'is-up' : 'is-down'}`}>
                    {selectedIssue.velocity > 0 ? '↑' : '↓'} {Math.abs(selectedIssue.velocity)}% {t('detail.velocity')}
                  </p>

                  <div className="MediaTreemap-detailList">
                    {selectedIssue.headlines.map((headline) => (
                      <article className="MediaTreemap-detailItem" key={`${selectedIssue.key}-${headline.time}-${headline.source}`}>
                        <a
                          className="MediaTreemap-detailLink"
                          href={headline.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <p className="MediaTreemap-detailHeadline">{headline.title}</p>
                          <span className="MediaTreemap-detailMeta">{headline.source} · {headline.time}</span>
                        </a>
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <div className="MediaTreemap-asideMeta">
                <section className="MediaTreemap-panel MediaTreemap-panel--timeline">
                  <span className="MediaTreemap-detailLabel MediaTreemap-detailLabel--timeline">{t('timeline.title')}</span>
                  {rankN >= 2 && (
                    <div
                      className="MediaTreemap-rankWrap"
                      onMouseLeave={() => { setHoveredSnapIdx(null); setHoveredIssueKey(null); }}
                    >
                      <svg
                        ref={rankChartRef}
                        viewBox={`0 0 ${rankW} ${rankH}`}
                        className="MediaTreemap-rankChart"
                        onMouseMove={handleChartMove}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        {/* Vertical indicator at hovered snapshot */}
                        {hoveredSnapIdx !== null && (
                          <line
                            x1={rankX(hoveredSnapIdx)} y1={rankPt}
                            x2={rankX(hoveredSnapIdx)} y2={rankPt + rankPh}
                            className="MediaTreemap-rankIndicator"
                          />
                        )}

                        {/* Y-axis rank labels */}
                        {Array.from({ length: Math.min(rankCount, 12) }, (_, index) => index + 1).map((r) => (
                          <text key={r} x={rankPl - 4} y={rankY(r) + 3.5} textAnchor="end" className="MediaTreemap-rankAxisLabel">
                            {r}
                          </text>
                        ))}

                        {/* X-axis date labels — first and last */}
                        {[0, rankN - 1].map((i) => (
                          <text
                            key={i} x={rankX(i)} y={rankH - 4}
                            textAnchor={i === 0 ? 'start' : 'end'}
                            className="MediaTreemap-rankAxisLabel"
                          >
                            {rankHistory[i].label}
                          </text>
                        ))}

                        {/* Per-issue: wide invisible hit area + visible line */}
                        {periodData.issues.map((issue) => {
                          const isActive = issue.key === hoveredIssueKey || issue.key === selectedKey;
                          const pts = rankHistory
                            .map((snap, i) => {
                              const r = snap.ranks[issue.key];
                              return r != null ? `${rankX(i)},${rankY(r)}` : null;
                            })
                            .filter(Boolean).join(' ');
                          if (!pts) return null;
                          return (
                            <g key={issue.key}>
                              <polyline
                                points={pts} fill="none" stroke="transparent" strokeWidth={12}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={() => setHoveredIssueKey(issue.key)}
                                onClick={() => setSelectedKey(issue.key)}
                              />
                              <polyline
                                points={pts}
                                className={`MediaTreemap-rankLine${isActive ? ' is-selected' : ''}`}
                                style={{ stroke: issue.color }}
                                pointerEvents="none"
                              />
                            </g>
                          );
                        })}

                        {/* Dots at hovered snapshot for all issues */}
                        {hoveredSnapIdx !== null && periodData.issues.map((issue) => {
                          const r = rankHistory[hoveredSnapIdx].ranks[issue.key];
                          if (r == null) return null;
                          const isActive = issue.key === hoveredIssueKey || issue.key === selectedKey;
                          return (
                            <circle
                              key={issue.key} cx={rankX(hoveredSnapIdx)} cy={rankY(r)}
                              r={isActive ? 4 : 2.5}
                              className="MediaTreemap-rankSnapDot"
                              style={{ fill: issue.color }}
                              pointerEvents="none"
                            />
                          );
                        })}

                        {/* Persistent end dot when not hovering */}
                        {hoveredSnapIdx === null && (() => {
                          const r = rankHistory[rankN - 1]?.ranks[selectedKey];
                          if (r == null) return null;
                          return (
                            <circle
                              cx={rankX(rankN - 1)} cy={rankY(r)} r={3.5}
                              className="MediaTreemap-rankDot"
                              style={{ fill: selectedIssue?.color }}
                            />
                          );
                        })()}

                        {chartLabels.map((label) => (
                          <text
                            key={label.key}
                            x={rankW - rankPr + 10}
                            y={Math.min(rankPt + rankPh, label.y + 4)}
                            className={`MediaTreemap-rankSeriesLabel${label.key === selectedKey ? ' is-selected' : ''}`}
                            style={{ fill: label.color }}
                          >
                            {label.text}
                          </text>
                        ))}
                      </svg>

                      {hoveredSnapIdx !== null && tooltipIssue && tooltipRank != null && tooltipScore != null && (
                        <div
                          className="MediaTreemap-rankTooltip"
                          style={{
                            left: `${(rankX(hoveredSnapIdx) / rankW) * 100}%`,
                            transform: rankX(hoveredSnapIdx) / rankW > 0.55 ? 'translateX(-100%)' : 'translateX(0)',
                          }}
                        >
                          <div className="MediaTreemap-rankTooltip-date">
                            {rankHistory[hoveredSnapIdx].label}
                          </div>
                          <div className="MediaTreemap-rankTooltip-row is-active">
                            <span className="MediaTreemap-dot" style={{ backgroundColor: tooltipIssue.color }} />
                            <span className="MediaTreemap-rankTooltip-label">{tooltipIssue.tag}</span>
                            <span className="MediaTreemap-rankTooltip-rank">#{tooltipRank}</span>
                            <span className="MediaTreemap-rankTooltip-score">{(tooltipScore * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="MediaTreemap-microcopy">
                    {t('timeline.note', {
                      table: payload?.source.table,
                      generatedAt: payload?.generatedAt,
                    })}
                  </p>
                </section>
              </div>
            </aside>
          </div>
        </>
      )}
    </section>
  );
};

export default memo(MediaTreemap);
