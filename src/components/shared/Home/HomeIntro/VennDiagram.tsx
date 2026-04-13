import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Category from '../../../../models/Category';
import Page from '../../../../models/Page';
import './VennDiagram.scss';

// r = 95, equilateral triangle arrangement
// Médias (yellow) top · Citoyens (cyan) bottom-left · Décideurs (pink) bottom-right
const R = 95;
const MEDIAS    = { cx: 150, cy: 115 };
const CITOYENS  = { cx:  77, cy: 228 };
const DECIDEURS = { cx: 223, cy: 228 };

interface VennDiagramProps {
  /** When set, the matching circle is highlighted and the others are dimmed. */
  activeCategory?: Category;
}

const categoryToItem: Partial<Record<Category, string>> = {
  [Category.MEDIA]:          'is-medias',
  [Category.PUBLIC_OPINION]: 'is-citoyens',
  [Category.AUTHORITIES]:    'is-decideurs',
};

const VennDiagram = ({ activeCategory }: VennDiagramProps): ReactElement => {
  const navigate = useNavigate();
  const { t } = useTranslation('URL');

  const categoryBase = `/${t(Page.CATEGORY)}`;
  const goTo = (category: Category) => () => navigate(`${categoryBase}/${category}`);

  const itemClass = (cat: Category): string => {
    const base = categoryToItem[cat] ?? '';
    if (!activeCategory) return `VennDiagram-item ${base}`;
    if (cat === activeCategory) return `VennDiagram-item ${base} is-active`;
    return `VennDiagram-item ${base} is-dimmed`;
  };

  return (
    <div className="VennDiagram" aria-hidden="true">
      <svg viewBox="-25 0 350 355" xmlns="http://www.w3.org/2000/svg">

        {/*
          Each circle + its label grouped together so :hover applies to both.
          mix-blend-mode is on each circle individually — identical result to
          group-level blending when the background is white.
        */}
        <g className={itemClass(Category.MEDIA)} onClick={goTo(Category.MEDIA)}>
          <circle cx={MEDIAS.cx} cy={MEDIAS.cy} r={R} className="VennDiagram-circle" />
          <text x={MEDIAS.cx} y={MEDIAS.cy - 6} textAnchor="middle" className="VennDiagram-label">Médias</text>
          <text x={MEDIAS.cx} y={MEDIAS.cy + 12} textAnchor="middle" className="VennDiagram-hint">Explorer →</text>
        </g>

        <g className={itemClass(Category.PUBLIC_OPINION)} onClick={goTo(Category.PUBLIC_OPINION)}>
          <circle cx={CITOYENS.cx} cy={CITOYENS.cy} r={R} className="VennDiagram-circle" />
          <text x={CITOYENS.cx} y={CITOYENS.cy - 6} textAnchor="middle" className="VennDiagram-label">Citoyens</text>
          <text x={CITOYENS.cx} y={CITOYENS.cy + 12} textAnchor="middle" className="VennDiagram-hint">Explorer →</text>
        </g>

        <g className={itemClass(Category.AUTHORITIES)} onClick={goTo(Category.AUTHORITIES)}>
          <circle cx={DECIDEURS.cx} cy={DECIDEURS.cy} r={R} className="VennDiagram-circle" />
          <text x={DECIDEURS.cx} y={DECIDEURS.cy - 6} textAnchor="middle" className="VennDiagram-label">Décideurs</text>
          <text x={DECIDEURS.cx} y={DECIDEURS.cy + 12} textAnchor="middle" className="VennDiagram-hint">Explorer →</text>
        </g>

      </svg>
    </div>
  );
};

export default VennDiagram;
