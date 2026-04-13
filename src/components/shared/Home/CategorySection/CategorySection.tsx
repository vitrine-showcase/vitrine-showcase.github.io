import React, { ReactElement, useEffect } from 'react';
import { useNavigate } from 'react-router';

import Category from '../../../../models/Category';
import UneDesUnes from '../../../medias/UneDesUnes/UneDesUnes';
import ParoleEnChambre from '../../../decideurs/ParoleEnChambre/ParoleEnChambre';
import EnjuModule from '../../../citoyens/EnjuModule/EnjuModule';
import Presentation from '../Presentation/Presentation';
import useAnchoredCategory from '../../../../hooks/useAnchoredCategory';
import useOnScreen from '../../../../hooks/useOnScreen';
import useWindowSize from '../../../../hooks/useWindowSize';
import './CategorySection.scss';

type Props = {
  category: Category;
  cta?: boolean;
}

const CategorySection = ({ category, cta: hasCTA }: Props): ReactElement => {
  const { height } = useWindowSize();
  const [ref, onScreen] = useOnScreen(`-${height / 2}px`);
  const { anchoredCategory } = useAnchoredCategory();
  const navigate = useNavigate();

  useEffect(() => {
    if (anchoredCategory === category) {
      (ref.current as HTMLDivElement)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [anchoredCategory]);

  useEffect(() => {
    if (onScreen) {
      navigate(`/#${category}`, { replace: true });
    }
  }, [onScreen]);

  return (
    <div className={`CategorySection section-outer ${category}`} id={category} ref={ref}>
      <div className="section-inner">
        <Presentation hasCTA={hasCTA} category={category} />
        {category === Category.MEDIA && (
          <div className="CategorySection-chart-area has-treemap">
            <UneDesUnes />
          </div>
        )}
        {category === Category.AUTHORITIES && (
          <div className="CategorySection-chart-area has-treemap">
            <ParoleEnChambre />
          </div>
        )}
        {category === Category.PUBLIC_OPINION && (
          <div className="CategorySection-chart-area has-treemap">
            <EnjuModule />
          </div>
        )}
      </div>
    </div>
  );
};

CategorySection.defaultProps = {
  cta: false,
};

export default CategorySection;
