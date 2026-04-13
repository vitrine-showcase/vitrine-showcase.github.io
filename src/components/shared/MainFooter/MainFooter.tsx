import React, { ReactElement } from 'react';

import FooterNavigation from './FooterNavigation/FooterNavigation';
import FooterLegal from './FooterLegal/FooterLegal';
import './MainFooter.scss';

const MainFooter = (): ReactElement => (
    <div className="MainFooter" id="MainFooter">
      <FooterNavigation />
      <FooterLegal />
    </div>
  )

export default MainFooter;
