import React, { FunctionComponent } from 'react';

import SiteBrand from '../SiteBrand/SiteBrand';
import NavToolBox from './NavToolBox/NavToolBox';

import './MainNavbar.scss';

type Props = {
  isWhite?: boolean;
}

const MainNavbar: FunctionComponent<Props> = ({ children, isWhite }) => (
    <header className="section-outer">
      <div className="section-inner">
        <nav className="MainNavbar">
          <SiteBrand isWhite={isWhite} />
          <NavToolBox>
            { children }
          </NavToolBox>
        </nav>
      </div>
    </header>
  )

export default MainNavbar;
