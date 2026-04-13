import React, { FunctionComponent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import whiteLogo from './logo-white.png'
import blackLogo from './logo-black.png'
import './SiteBrand.scss';

interface SiteBrandProps {
  isWhite?: boolean;
}

export const SiteBrand: FunctionComponent<SiteBrandProps> = ({ isWhite }): ReactElement => {
  const { t } = useTranslation('App');
  const siteTitle = t('title');
  return (
    <NavLink className="SiteBrand" to="/" aria-label={siteTitle}>
      <img src={isWhite ? whiteLogo : blackLogo} alt="brand" />
    </NavLink>
  );
};

export default SiteBrand;
