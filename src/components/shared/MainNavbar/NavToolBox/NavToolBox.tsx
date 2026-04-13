import React, { FunctionComponent } from 'react';
import LanguageLink from '../../LanguageLink/LanguageLink';

import './NavToolBox.scss';

const NavToolBox: FunctionComponent = ({ children }) =>
   (
    <div className="NavToolBox">
      <div className="NavToolBox-lang">
        <LanguageLink />
      </div>
      { children }
    </div>
  );
NavToolBox.defaultProps = {
  children: undefined,
};

// TODO reenable every comments if we need support for en
export default NavToolBox;
