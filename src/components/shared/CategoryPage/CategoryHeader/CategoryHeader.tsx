import React, { FunctionComponent, memo } from 'react';
import { Trans } from 'react-i18next';

import Category from '../../../../models/Category';
import CategoryTitle from '../../CategoryTitle/CategoryTitle';
import CategoryTop20 from '../CategoryTop20/CategoryTop20';
import './CategoryHeader.scss';

interface CategoryHeaderProps {
  category: Category;
}

const CategoryHeader: FunctionComponent<CategoryHeaderProps> = ({ category }) => (
  <div className="CategoryHeader">

    <div className="CategoryHeader-text">
      <CategoryTitle category={category} className="CategoryHeader-icon" />
      <Trans
        ns="Category"
        parent="h2"
        className="CategoryHeader-title"
        i18nKey={`${category}.teaser`}
        components={{ span: <span className="has-font-secondary" /> }}
      />
      <div className="CategoryHeader-description">
        <Trans
          ns="Category"
          parent="p"
          i18nKey={`${category}.description`}
          components={{ span: <span className="is-underlined" /> }}
        />
      </div>
    </div>

    <div className="CategoryHeader-top20">
      <CategoryTop20 category={category} />
    </div>

  </div>
);

export default memo(CategoryHeader);
