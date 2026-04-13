import React, { ReactElement } from 'react';
import SiteBrand from '../../SiteBrand/SiteBrand';
import SiteMenus from '../../SiteMenus/SiteMenus';

import './FooterNavigation.scss';

const FooterNavigation = (): ReactElement => (
  <section className="FooterNavigation">
    <div className="branding">
      <SiteBrand isWhite />
    </div>
    <SiteMenus />
  </section>
);

export default FooterNavigation;
