import React, { FunctionComponent, memo } from 'react';

import LoadingSpinner from './LoadingSpinner';
import './LoadingPage.scss'

interface LoadingPageProps {}

const LoadingPage: FunctionComponent<LoadingPageProps> = () => (<div className="LoadingPage">
  <LoadingSpinner/>
</div>);

export default memo(LoadingPage);