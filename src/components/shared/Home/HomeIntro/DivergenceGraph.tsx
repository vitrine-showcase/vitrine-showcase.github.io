import React, { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import './DivergenceGraph.scss';

// ── Types ────────────────────────────────────────────────────────────────────

type DivObject = {
  label:     string;
  score_qc?: number;
  score_can?: number;
};
type DivOnlyQC  = { label: string; score_qc:  number };
type DivOnlyCAN = { label: string; score_can: number };

type TopObjects = {
  qc_only:    DivOnlyQC[];
  can_only:   DivOnlyCAN[];
  asymmetric: DivObject[];
};

type Interval = {
  date_utc:                  string;
  time_interval_utc:         string;
  time_interval_montreal_tz: string;
  interval_divergence_score: number;
  qc:  { title: string };
  can: { title: string };
  top_objects_divergence: TopObjects;
};

type Payload = { generated_at: string; intervals: Interval[] };

// ── Helpers ───────────────────────────────────────────────────────────────────

interface Node {
  label: string;
  fontSize: number;
  x: number;
  y: number;
  type: 'qc' | 'can';
}

const svgW = 480;
const centerX = svgW * 0.5;

const capitalise = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

const skipHook = new Set([
  'québec', 'quebec', 'canada', 'le canada',
  'america', 'american', 'united states',
  'canadians', 'canadian',
]);

function pseudoRandom(s: string, range = 100): number {
  let hash = 0;
  for (let i = 0; i < s.length; i += 1) {
    hash = (hash * 31 + s.charCodeAt(i)) % 10000;
  }
  return (hash % range);
}

function buildNodes(top: TopObjects): Node[] {
  const nodes: Node[] = [];
  const nItems = 6;
  
  const qcCombined = [
    ...top.qc_only.map(o => ({ label: o.label, score: o.score_qc })),
    ...top.asymmetric
      .filter(o => (o.score_qc ?? 0) > (o.score_can ?? 0) * 3)
      .map(o => ({ label: o.label, score: o.score_qc ?? 0 }))
  ].sort((a, b) => b.score - a.score).slice(0, nItems);

  const canCombined = [
    ...top.can_only.map(o => ({ label: o.label, score: o.score_can })),
    ...top.asymmetric
      .filter(o => (o.score_can ?? 0) > (o.score_qc ?? 0) * 3)
      .map(o => ({ label: o.label, score: o.score_can ?? 0 }))
  ].sort((a, b) => b.score - a.score).slice(0, nItems);

  const maxQc = Math.max(...qcCombined.map(o => o.score), 1);
  const maxCan = Math.max(...canCombined.map(o => o.score), 1);

  let curY = 40;
  qcCombined.forEach(o => {
    const fs = 11 + Math.sqrt(o.score / maxQc) * 22;
    nodes.push({
      label: o.label,
      fontSize: fs,
      x: centerX - 35 - (fs * 1.5) + (pseudoRandom(o.label, 20) - 10),
      y: curY + fs,
      type: 'qc'
    });
    curY += fs * 1.35;
  });

  curY = 40;
  canCombined.forEach(o => {
    const fs = 11 + Math.sqrt(o.score / maxCan) * 22;
    nodes.push({
      label: o.label,
      fontSize: fs,
      x: centerX + 35 + (fs * 1.5) + (pseudoRandom(o.label, 20) - 10),
      y: curY + fs,
      type: 'can'
    });
    curY += fs * 1.35;
  });

  return nodes;
}

type HookData = { ratio: number; label: string; dir: 'qc' | 'can' } | null;

function getHookData(top: TopObjects): HookData {
  const best = top.asymmetric
    .slice(0, 15)
    .filter((o) => !skipHook.has(o.label.toLowerCase()))
    .reduce<{ ratio: number; label: string; dir: 'qc' | 'can' }>(
      (acc, o) => {
        const qc   = o.score_qc  ?? 0;
        const can  = o.score_can ?? 0;
        const rCan = can / (qc  + 1e-9);
        const rQc  = qc  / (can + 1e-9);
        if (rCan > acc.ratio) return { ratio: rCan, label: o.label, dir: 'can' };
        if (rQc  > acc.ratio) return { ratio: rQc,  label: o.label, dir: 'qc'  };
        return acc;
      },
      { ratio: 0, label: '', dir: 'can' },
    );

  if (!best.label || best.ratio < 3) return null;
  return { ...best, ratio: Math.round(best.ratio) };
}

// ── Component ─────────────────────────────────────────────────────────────────

const DivergenceGraph = (): ReactElement => {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/data/headline_of_headlines_divergence.json?ts=${Date.now()}`)
      .then((r) => r.json() as Promise<Payload>)
      .then((d) => { setPayload(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const interval = payload?.intervals?.[0] ?? null;

  const nodes = useMemo(() => 
    (interval ? buildNodes(interval.top_objects_divergence) : []), 
  [interval]);

  const hookData = useMemo(() => 
    (interval ? getHookData(interval.top_objects_divergence) : null), 
  [interval]);

  if (loading || !interval) return <div className="DivergenceGraph DivergenceGraph--bare">...</div>;

  const svgH = 260;

  const fracturePoints = [];
  for (let y = 0; y <= svgH; y += 20) {
    const jitter = pseudoRandom(`fr-${y}`, 16) - 8;
    fracturePoints.push(`${centerX + jitter},${y}`);
  }

  return (
    <div className="DivergenceGraph" role="figure" aria-label="Signature visuelle de la fracture">
      
      {/* 1. Hook Header */}
      {hookData && (
        <p className="DivergenceGraph-hook">
          <span className="DivergenceGraph-ratio">{hookData.ratio}x</span>
          plus saillant au {hookData.dir === 'can' ? 'Canada' : 'Québec'} : l&apos;actualité de <strong>{capitalise(hookData.label)}</strong> nous sépare.
        </p>
      )}

      {/* 2. Swarm Chart */}
      <div className="DivergenceGraph-chart-wrap">
        <svg className="DivergenceGraph-svg" viewBox={`0 0 ${svgW} ${svgH}`} xmlns="http://www.w3.org/2000/svg">
          
          {/* Column labels */}
          <text x={centerX - 40} y={15} textAnchor="end" className="DivergenceGraph-col-label">Québec</text>
          <text x={centerX + 40} y={15} textAnchor="start" className="DivergenceGraph-col-label">Canada</text>

          {/* The Fracture */}
          <polyline points={fracturePoints.join(' ')} className="DivergenceGraph-fracture" />

          {/* Words */}
          {nodes.map((node) => (
            <text 
              key={`${node.type}-${node.label}`}
              x={node.x} 
              y={node.y} 
              textAnchor={node.type === 'qc' ? 'end' : 'start'}
              fontSize={node.fontSize}
              className={`DivergenceGraph-topic DivergenceGraph-topic--${node.type}`}
            >
              {capitalise(node.label)}
            </text>
          ))}
        </svg>
      </div>

      {/* 3. Editorial Cards */}
      <div className="DivergenceGraph-headlines">
        <div className="DivergenceGraph-news-card DivergenceGraph-news-card--qc">
          <span className="DivergenceGraph-card-tag">À la une • Québec</span>
          <span className="DivergenceGraph-card-text">{interval.qc.title}</span>
        </div>
        <div className="DivergenceGraph-news-card DivergenceGraph-news-card--can">
          <span className="DivergenceGraph-card-tag">À la une • Canada</span>
          <span className="DivergenceGraph-card-text">{interval.can.title}</span>
        </div>
      </div>

    </div>
  );
};

export default memo(DivergenceGraph);
