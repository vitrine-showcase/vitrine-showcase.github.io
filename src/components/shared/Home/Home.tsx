import React, { memo, ReactElement } from 'react';

import SitePage from '../SitePage/SitePage';
import Sections from './Sections';
import HomeIntro from './HomeIntro/HomeIntro';
import useAnchoredCategory from '../../../hooks/useAnchoredCategory';
import './Home.scss';

const Home = (): ReactElement => {
  const { anchoredCategory } = useAnchoredCategory();

  return (
    <SitePage className={`HomePage ${anchoredCategory}`}>
      <HomeIntro />
      <Sections />
    </SitePage>
  );
};

export default memo(Home);
