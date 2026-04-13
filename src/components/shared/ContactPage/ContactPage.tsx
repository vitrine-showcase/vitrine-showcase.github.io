import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import InfoPage from '../InfoPage/InfoPage';

const ContactPage = (): ReactElement => {
  const { t } = useTranslation('Contact');

  return (
    <InfoPage
      slug="contact"
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
    >
      <section className="InfoPage-section section-outer">
        <div className="section-inner">
          <div className="InfoPage-address">
            <strong>Centre d&rsquo;analyse des politiques publiques</strong><br />
            Faculté des sciences sociales · Université Laval<br />
            Pavillon Charles-De Koninck<br />
            1030 Avenue des Sciences Humaines<br />
            Québec (QC) G1V 0A6<br />
            <br />
            <a href="mailto:capp.ulaval@gmail.com">capp.ulaval@gmail.com</a>
          </div>
        </div>
      </section>
    </InfoPage>
  );
};

export default memo(ContactPage);
