import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import ULavalLogo from '../../SVGs/ULavalLogo';
import Page from '../../../../models/Page';

import './FooterLegal.scss';

const FooterLegal = (): ReactElement => {
  const { t } = useTranslation('FooterLegal');
  return (
    <section className="FooterLegal-wrapper">
      <div className="FooterLegal">
        <div className="FooterLegal-conditions">
          <NavLink to={`/${t(Page.CONDITIONS, { ns: 'URL' })}`}>{t('conditions')}</NavLink>
        </div>
        <div className="FooterLegal-privacy">
          <NavLink to={`/${t(Page.PRIVACY, { ns: 'URL' })}`}>{t('privacy')}</NavLink>
        </div>
        <div className="FooterLegal-copy">
          <a href="/">{t('copyright')}</a>
        </div>
        <div className="FooterLegal-logo">
          <ULavalLogo />
        </div>
      </div>
    </section>
  )
}

export default FooterLegal;
