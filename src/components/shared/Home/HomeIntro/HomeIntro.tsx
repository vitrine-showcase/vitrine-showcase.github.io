import React, { ReactElement, useEffect } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router';
import Category from '../../../../models/Category';
import useOnScreen from '../../../../hooks/useOnScreen';
import VennDiagram from './VennDiagram';
import './HomeIntro.scss';

const HomeIntro = (): ReactElement => {
  const navigate = useNavigate();
  const [ref, onScreen] = useOnScreen('-50px');

  useEffect(() => {
    if (onScreen) {
      navigate('/', { replace: true });
    }
  }, [onScreen]);

  return (
    <div className="HomeIntro section-outer" ref={ref}>
      <div className="HomeIntro-inner section-inner">
        <div className="HomeIntro-text">
          <h1 className="HomeIntro-title">
            <Trans
              ns="Category"
              i18nKey={`${Category.COMMON}.teaser`}
              components={{ span: <span className="has-font-secondary" /> }}
            />
          </h1>
          <p className="HomeIntro-description">
            <Trans
              ns="Category"
              i18nKey={`${Category.COMMON}.description`}
              components={{ mark: <mark />, span: <span /> }}
            />
          </p>
        </div>
        <div className="HomeIntro-diagram">
          <VennDiagram />
        </div>
      </div>
    </div>
  );
};

export default HomeIntro;
