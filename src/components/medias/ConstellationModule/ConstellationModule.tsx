import React, { memo, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ConstellationModule.scss';

// ── Canvas — actual dimensions come from ResizeObserver at runtime ────────────
type VizDims = { w: number; h: number };

// ── Simulation params ─────────────────────────────────────────────────────────
// repulsion and springLen are scaled at runtime relative to container area
const springK       = 0.018;
const damping       = 0.78;
const gravity       = 0.025;
const maxIter       = 1400;
const stopThreshold = 0.04;
const minR          = 16;
const maxR          = 44;
const maxNodes      = 15;

const sourceNames: Record<string, string> = {
  JDM: 'Journal de Montréal',
  LAP: 'La Presse',
  LED: 'Le Devoir',
  RCI: 'Radio-Canada',
  MG:  'Métro',
  CBC: 'CBC',
  CTV: 'CTV',
  GAM: 'Globe & Mail',
  NP:  'National Post',
  GN:  'Global News',
  TTS: 'Toronto Star',
  VS:  'Vancouver Sun',
};

// ── Data types ────────────────────────────────────────────────────────────────
type GraphArticle = { title: string; url: string; media_id: string };

type GraphNode = {
  id: string;
  size: number;
  n: number;
  articles: GraphArticle[];
  source_counts: Record<string, number>;
};

type GraphLink = { source: string; target: string; value: number };

type CountryData = {
  generated_at: string;
  nodes: GraphNode[];
  links: GraphLink[];
};

type ConstellationPayload = { QC: CountryData; CAN: CountryData };

type SimNode = {
  id: string;
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  label: string;
  size: number;
  articles: GraphArticle[];
  sourceCounts: Record<string, number>;
};

// ── Force simulation ──────────────────────────────────────────────────────────
function buildLayout(graphNodes: GraphNode[], links: GraphLink[], dims: VizDims): SimNode[] {
  const { w, h } = dims;
  const cx = w / 2;
  const cy = h / 2;
  // Scale forces to container so layout fills the space on any screen size.
  // springLen is derived from "territory per node" (area/N), with a hard
  // minimum so it always exceeds node diameter and prevents tight clustering.
  const area = w * h;
  const minSpringLen = maxR * 2 + 54; // never shorter than ~118px
  const springLen = Math.max(minSpringLen, Math.sqrt(area / maxNodes) * 1.1);
  const repulsion = (area / maxNodes) * 0.55;
  // Initial ring radius: use the smaller dimension so nodes start on-screen
  const initR = Math.min(w, h) * 0.38;

  // Take only the top maxNodes by salience
  const sorted = [...graphNodes].sort((a, b) => b.size - a.size).slice(0, maxNodes);
  const maxSize = sorted[0]?.size ?? 1;
  const activeIds = new Set(sorted.map((n) => n.id));

  // Only links between the retained nodes
  const activeLinks = links.filter((l) => activeIds.has(l.source) && activeIds.has(l.target));

  const nodes: SimNode[] = sorted.map((gn, i) => {
    const angle = (i / sorted.length) * 2 * Math.PI;
    const r = minR + Math.sqrt(gn.size / maxSize) * (maxR - minR);
    return {
      id: gn.id,
      x: cx + Math.cos(angle) * initR,
      y: cy + Math.sin(angle) * initR,
      vx: 0, vy: 0,
      r,
      label: gn.id,
      size: gn.size,
      articles: gn.articles,
      sourceCounts: gn.source_counts,
    };
  });

  const idx = new Map(nodes.map((n, i) => [n.id, i]));
  const ax = new Array<number>(nodes.length);
  const ay = new Array<number>(nodes.length);

  for (let iter = 0; iter < maxIter; iter += 1) {
    ax.fill(0);
    ay.fill(0);

    // Repulsion between all pairs
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
        const f = repulsion / (dist * dist);
        const fx = (dx / dist) * f;
        const fy = (dy / dist) * f;
        ax[i] -= fx; ay[i] -= fy;
        ax[j] += fx; ay[j] += fy;
      }
    }

    // Springs along edges
    activeLinks.forEach((link) => {
      const si = idx.get(link.source);
      const ti = idx.get(link.target);
      if (si === undefined || ti === undefined) return;
      const dx = nodes[ti].x - nodes[si].x;
      const dy = nodes[ti].y - nodes[si].y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
      const f = springK * (dist - springLen);
      const fx = (dx / dist) * f;
      const fy = (dy / dist) * f;
      ax[si] += fx; ay[si] += fy;
      ax[ti] -= fx; ay[ti] -= fy;
    });

    // Gravity toward center
    nodes.forEach((n, i) => {
      ax[i] += (cx - n.x) * gravity;
      ay[i] += (cy - n.y) * gravity;
    });

    // Integrate
    let maxV = 0;
    nodes.forEach((n, i) => {
      const node = n;
      node.vx = (node.vx + ax[i]) * damping;
      node.vy = (node.vy + ay[i]) * damping;
      // Padding accounts for node radius + label below
      const padX = node.r + 12;
      const padY = node.r + 22;
      node.x = Math.max(padX, Math.min(w - padX, node.x + node.vx));
      node.y = Math.max(padY, Math.min(h - padY, node.y + node.vy));
      maxV = Math.max(maxV, Math.abs(node.vx) + Math.abs(node.vy));
    });

    if (maxV < stopThreshold) break;
  }

  return nodes;
}

// ── Component ─────────────────────────────────────────────────────────────────
type Country = 'QC' | 'CAN';

const ConstellationModule = (): ReactElement => {
  const { t } = useTranslation('ConstellationModule');
  const title = t('title')
  const [titleLead, titleAccent, ...titleTail] = title.split(' ')
  const [payload, setPayload] = useState<ConstellationPayload | null>(null);
  const [country, setCountry] = useState<Country>('QC');
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dims, setDims] = useState<VizDims>({ w: 0, h: 0 });
  const vizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = vizRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 10 && height > 10) {
        setDims({ w: Math.round(width), h: Math.round(height) });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    fetch(`/data/constellation-graph.json?ts=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error('fetch');
        return res.json() as Promise<ConstellationPayload>;
      })
      .then((data) => { setPayload(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const { nodes, edges, maxEdgeVal } = useMemo(() => {
    if (!payload || dims.w === 0) return { nodes: [], edges: [], maxEdgeVal: 1 };
    const d = payload[country];
    const builtNodes = buildLayout(d.nodes, d.links, dims);
    const activeIds = new Set(builtNodes.map((n) => n.id));
    const activeEdges = d.links.filter((l) => activeIds.has(l.source) && activeIds.has(l.target));
    return {
      nodes: builtNodes,
      edges: activeEdges,
      maxEdgeVal: activeEdges.reduce((m, e) => Math.max(m, e.value), 1),
    };
  }, [payload, country, dims]);

  const neighbors = useMemo(() => {
    const focusId = hoveredId ?? selectedId;
    if (!focusId) return new Set<string>();
    const set = new Set<string>();
    edges.forEach((e) => {
      if (e.source === focusId) set.add(e.target);
      if (e.target === focusId) set.add(e.source);
    });
    return set;
  }, [hoveredId, selectedId, edges]);

  const focusId = hoveredId ?? selectedId;
  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;

  const handleNodeClick = (id: string): void => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="ConstellationModule">

      {/* Header */}
      <div className="ConstellationModule-header">
        <div className="ConstellationModule-header-row">
          <div className="ConstellationModule-header-text">
            <span className="ConstellationModule-eyebrow">{t('eyebrow')}</span>
            <h2 className="ConstellationModule-title">
              {titleLead}
              {titleAccent && (
                <>
                  {' '}
                  <span className="has-font-secondary">{titleAccent}</span>
                </>
              )}
              {titleTail.length > 0 && ` ${titleTail.join(' ')}`}
            </h2>
          </div>
          <div className="ConstellationModule-tabs">
            {(['QC', 'CAN'] as Country[]).map((c) => (
              <button
                key={c}
                type="button"
                className={`ConstellationModule-tab${country === c ? ' is-active' : ''}`}
                onClick={() => { setCountry(c); setSelectedId(null); setHoveredId(null); }}
              >
                {t(`countries.${c}`)}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Body: viz + side panel */}
      <div className="ConstellationModule-body">

        {/* Graph */}
        <div
          ref={vizRef}
          className="ConstellationModule-viz"
          onMouseLeave={() => setHoveredId(null)}
        >
          {loading && <p className="ConstellationModule-loading">{t('loading')}</p>}

          {!loading && dims.w > 0 && (
            <svg
              viewBox={`0 0 ${dims.w} ${dims.h}`}
              className="ConstellationModule-svg"
              aria-hidden="true"
            >
              <g className="ConstellationModule-edges">
                {edges.map((edge) => {
                  const src = nodes.find((n) => n.id === edge.source);
                  const tgt = nodes.find((n) => n.id === edge.target);
                  if (!src || !tgt) return null;
                  const lit = focusId === edge.source || focusId === edge.target;
                  // eslint-disable-next-line no-nested-ternary
                  const op = lit ? 0.75 : focusId ? 0.04 : 0.18;
                  return (
                    <line
                      key={`${edge.source}__${edge.target}`}
                      x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                      className="ConstellationModule-edge"
                      strokeWidth={0.5 + (edge.value / maxEdgeVal) * 4}
                      opacity={op}
                    />
                  );
                })}
              </g>

              <g className="ConstellationModule-nodes">
                {nodes.map((node) => {
                  const isSel = node.id === selectedId;
                  const isHov = node.id === hoveredId;
                  const isNbr = neighbors.has(node.id);
                  const dimmed = focusId && !isSel && !isHov && !isNbr;
                  const totalCount = Object.values(node.sourceCounts).reduce((s, v) => s + v, 0);

                  return (
                    <g
                      key={node.id}
                      className={[
                        'ConstellationModule-node',
                        isSel ? 'is-selected' : '',
                        isHov ? 'is-hovered' : '',
                        dimmed ? 'is-dimmed' : '',
                      ].filter(Boolean).join(' ')}
                      onMouseEnter={() => setHoveredId(node.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => handleNodeClick(node.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle cx={node.x} cy={node.y} r={node.r} className="ConstellationModule-node-circle" />
                      <text x={node.x} y={node.y + 7} textAnchor="middle" className="ConstellationModule-node-count">
                        {totalCount}
                      </text>
                      <text x={node.x} y={node.y + node.r + 11} textAnchor="middle" className="ConstellationModule-node-label">
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          )}
        </div>

        {/* Detail panel */}
        <div className={`ConstellationModule-panel${selectedNode ? ' is-open' : ''}`}>
          {!selectedNode ? (
            <p className="ConstellationModule-panel-hint has-font-secondary">{t('panel.hint')}</p>
          ) : (
            <>
              <div className="ConstellationModule-panel-header">
                <span className="ConstellationModule-panel-name has-font-secondary">{selectedNode.label}</span>
                <span className="ConstellationModule-panel-score has-font-secondary">{selectedNode.size.toFixed(1)}</span>
              </div>
              <div className="ConstellationModule-panel-sources">
                {(() => {
                  const total = Object.values(selectedNode.sourceCounts).reduce((s, v) => s + v, 0);
                  return Object.entries(selectedNode.sourceCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([src, cnt]) => (
                      <span
                        key={src}
                        className="ConstellationModule-panel-pill has-font-secondary"
                      >
                        {sourceNames[src] ?? src} <strong>{cnt}</strong>
                        <span className="ConstellationModule-panel-pill-pct">{Math.round((cnt / total) * 100)}%</span>
                      </span>
                    ));
                })()}
              </div>
              {selectedNode.articles.length > 0 && (
                <ul className="ConstellationModule-panel-articles">
                  {selectedNode.articles.map((a) => (
                    <li key={`${a.media_id}-${a.title.slice(0, 12)}`} className="ConstellationModule-panel-article">
                      <span className="ConstellationModule-panel-source has-font-secondary">
                        {sourceNames[a.media_id] ?? a.media_id}
                      </span>
                      {a.url
                        ? <a className="ConstellationModule-panel-title" href={a.url} target="_blank" rel="noopener noreferrer">{a.title}</a>
                        : <span className="ConstellationModule-panel-title">{a.title}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

      </div>

      <div className="ConstellationModule-meta">
        <span className="ConstellationModule-meta-item">
          <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
            <circle cx="18" cy="18" r="16" fill="white" stroke="black" strokeWidth="1.5" />
            <text x="18" y="23" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="inherit" fill="black">42</text>
          </svg>
          {t('meta.count')}
        </span>
        <span className="ConstellationModule-meta-item">
          <svg width="60" height="36" viewBox="0 0 60 36" aria-hidden="true">
            <circle cx="14" cy="24" r="9" fill="white" stroke="black" strokeWidth="1.5" />
            <circle cx="42" cy="18" r="15" fill="white" stroke="black" strokeWidth="1.5" />
          </svg>
          {t('meta.nodeSize')}
        </span>
        <span className="ConstellationModule-meta-item">
          <svg width="52" height="36" viewBox="0 0 52 36" aria-hidden="true">
            <circle cx="7" cy="18" r="6" fill="white" stroke="black" strokeWidth="1.5" />
            <line x1="14" y1="18" x2="38" y2="18" stroke="black" strokeWidth="2" />
            <circle cx="45" cy="18" r="6" fill="white" stroke="black" strokeWidth="1.5" />
          </svg>
          {t('meta.edge')}
        </span>
      </div>

      <div className="ConstellationModule-footer">
        <span className="ConstellationModule-source">{t('source')}</span>
      </div>

    </div>
  );
};

export default memo(ConstellationModule);
