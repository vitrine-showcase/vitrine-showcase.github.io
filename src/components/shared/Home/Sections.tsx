import React, { FunctionComponent, memo } from 'react';
import Category from '../../../models/Category';
import CategorySection from './CategorySection/CategorySection';

const Sections: FunctionComponent = () => (
  <>
    <CategorySection category={Category.MEDIA} cta />
    <CategorySection category={Category.AUTHORITIES} cta />
    <CategorySection category={Category.PUBLIC_OPINION} cta />
  </>
);

export default memo(Sections);
