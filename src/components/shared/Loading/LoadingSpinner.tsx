import React, { FunctionComponent, memo } from 'react';

import { AnchorCategoryContextConsumer } from '../../../context/AnchorCategoryContext';

import Category from '../../../models/Category';
import './LoadingSpinner.scss';

interface LoadingSpinnerProps {}

const LoadingSpinner: FunctionComponent<LoadingSpinnerProps> = () => (
    <AnchorCategoryContextConsumer>
      {({ anchoredCategory }) => <div className={`LoadingSpinner ${anchoredCategory ?? Category.COMMON}`} />}
    </AnchorCategoryContextConsumer>
  );

export default memo(LoadingSpinner);
