import React, { MouseEvent, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import SiteMenus from '../../SiteMenus/SiteMenus';
import Button from '../../Button/Button';
import Category from '../../../../models/Category';

import './MenuLayout.scss';
import MainNavbar from '../../MainNavbar/MainNavbar';

type Props = {
  onClose: () => void;
}

export const MenuLayout = ({ onClose }: Props): ReactElement => {
  const { t } = useTranslation('MainMenu');
  const [category, setCategory] = useState(Category.COMMON);
  const handleOver = (e: MouseEvent<HTMLAnchorElement>): void => {
    setCategory(e.currentTarget.id as Category);
  };
  const handleOut = (): void => {
    setCategory(Category.COMMON);
  };

  return (
    <div className={`MenuLayout ${category}`}>
      <MainNavbar isWhite={category === Category.COMMON}>
        <Button onClick={onClose}>
          {t('close')}
          <span className="close" />
        </Button>
      </MainNavbar>
      <div className="MenuLayout-body section-inner">
        <SiteMenus className="modal" onMouseOver={handleOver} onMouseOut={handleOut} />
      </div>
    </div>
  );
};

export default MenuLayout;
