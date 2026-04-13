import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import InfoPage from '../InfoPage/InfoPage';

const MethodologyPage = (): ReactElement => {
  const { t } = useTranslation('Methodology');

  return (
    <InfoPage
      slug="methodology"
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
    >
      <section className="InfoPage-section section-outer">
        <div className="section-inner">
          <h2 className="InfoPage-section-heading has-font-secondary">{t('overview.heading')}</h2>
          <p className="InfoPage-text">{t('overview.text')}</p>

          <div className="InfoPage-module-grid">

            <div className="InfoPage-module-card">
              <p className="InfoPage-module-label has-font-secondary">{t('media.eyebrow')}</p>
              <h3 className="InfoPage-module-title">{t('media.title')}</h3>
              <p className="InfoPage-module-text">{t('media.text')}</p>
            </div>

            <div className="InfoPage-module-card">
              <p className="InfoPage-module-label has-font-secondary">{t('authorities.eyebrow')}</p>
              <h3 className="InfoPage-module-title">{t('authorities.title')}</h3>
              <p className="InfoPage-module-text">{t('authorities.text')}</p>
            </div>

            <div className="InfoPage-module-card">
              <p className="InfoPage-module-label has-font-secondary">{t('citizens.eyebrow')}</p>
              <h3 className="InfoPage-module-title">{t('citizens.title')}</h3>
              <p className="InfoPage-module-text">{t('citizens.text')}</p>
            </div>

          </div>
        </div>
      </section>

      <section className="InfoPage-section section-outer">
        <div className="section-inner">
          <h2 className="InfoPage-section-heading has-font-secondary">{t('ethics.heading')}</h2>
          <p className="InfoPage-text">{t('ethics.text')}</p>
        </div>
      </section>

      <section className="InfoPage-section section-outer">
        <div className="section-inner">
          <h2 className="InfoPage-section-heading has-font-secondary">{t('download.heading')}</h2>
          <a
            className="Button"
            href="/metho.pdf"
            download="methodologie-vitrine-democratique.pdf"
          >
            {t('download.label')}
          </a>
        </div>
      </section>
    </InfoPage>
  );
};

export default memo(MethodologyPage);
