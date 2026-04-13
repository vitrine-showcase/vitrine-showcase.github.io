import React, { ReactElement, ReactNode } from 'react';
import MainNavbar from '../MainNavbar/MainNavbar';
import MainFooter from '../MainFooter/MainFooter';
import MainMenu from '../MainMenu/MainMenu';

import './SitePage.scss';

type Props = {
  children: ReactNode;
  className?: string;
}
const SitePage = ({ children, className = '' }: Props): ReactElement => (
  <>
    <div className={`SitePage container ${className}`}>
      <MainNavbar>
        <MainMenu />
      </MainNavbar>
      <div className="content-ordering">{children}</div>
    </div>
    <MainFooter />
  </>
);
SitePage.defaultProps = {
  className: '',
};

export default SitePage;
