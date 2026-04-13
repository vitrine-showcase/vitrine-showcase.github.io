import React, { FunctionComponent, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import FontSwitcher from './FontSwitcher/FontSwitcher';
import SocialIcons from '../SocialIcons/SocialIcons';
import Page from '../../../models/Page';
import Category from '../../../models/Category';

import './SiteMenus.scss';

type Props = {
  className?: string;
  onMouseOver?: (e: MouseEvent<HTMLAnchorElement>) => void;
  onMouseOut?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const categories = [Category.PUBLIC_OPINION, Category.MEDIA, Category.AUTHORITIES];
const SiteMenus: FunctionComponent<Props> = ({
  className, onMouseOver, onMouseOut,
}: Props) => {
  const { t } = useTranslation('SiteMenus');
  return (
    <div className={`SiteMenus ${className}`}>
      <nav className="primary-menu">
        {
          categories.map((category) => (
            <FontSwitcher
              key={category}
              to={`/${t(Page.CATEGORY, { ns: 'URL' })}/${t(`categories.${category}`, { ns: 'URL' })}`}
              text={t(`main.${category}`)}
              id={category}
              onMouseEnter={onMouseOver}
              onMouseLeave={onMouseOut}
            />
          ))
        }
      </nav>
      <nav className="secondary-menu">
        <NavLink to={`/${t(Page.ABOUT, { ns: 'URL' })}`}>{t('secondary.about')}</NavLink>
        <NavLink to={`/${t(Page.METHODOLOGY, { ns: 'URL' })}`}>{t('secondary.methodology')}</NavLink>
        <NavLink to={`/${t(Page.PARTNERS, { ns: 'URL' })}`}>{t('secondary.partners')}</NavLink>
        <NavLink to={`/${t(Page.CONTACT, { ns: 'URL' })}`}>{t('secondary.contact')}</NavLink>
      </nav>
      <nav className="social-menu">
        <SocialIcons />
      </nav>
    </div>
  )
};

SiteMenus.defaultProps = {
  className: '',
  onMouseOver: undefined,
  onMouseOut: undefined,
};

export default SiteMenus;
