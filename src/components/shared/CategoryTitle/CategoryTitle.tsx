import React, { FunctionComponent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import CategoryIcon from '../CategoryIcon/CategoryIcon';
import Category from '../../../models/Category';
import './CategoryTitle.scss';

type Props = {
  category: Category;
  className?: string;
}

export const CategoryTitle: FunctionComponent<Props> = ({ category, className = '' }: Props): ReactElement => {
  const { t } = useTranslation('Category');
  return (
    <h4 className={`CategoryTitle ${className}`}>
      <span className="CategoryTitle-icon"><CategoryIcon category={category} monochrome /></span>
      <span>{t(`${category}.title`)}</span>
    </h4>
  )
};
CategoryTitle.defaultProps = {
  className: '',
};

export default CategoryTitle;
