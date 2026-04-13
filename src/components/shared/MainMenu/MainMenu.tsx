import React, { ReactElement, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';

import Button from '../Button/Button';
import MenuModal from './MenuModal/MenuModal';
import './MainMenu.scss';

const MainMenu = (): ReactElement => {
  const { t } = useTranslation('MainMenu');
  const [menu, setMenu] = useState(false);
  const handleOpen = (): void => setMenu(true);
  const handleClose = (): void => setMenu(false);

  const nodeRef = useRef(null);
  return (
    <span>
      <Button onClick={handleOpen} className="MainMenu invert">
        {t('title')}
        <span className="hamburger"><span /></span>
      </Button>
      <CSSTransition
        in={menu}
        out={!menu}
        nodeRef={nodeRef}
        timeout={500}
        classNames="fade"
        mountOnEnter
        unmountOnExit
      >
        <MenuModal ref={nodeRef} key="MainMenuModal" onClose={handleClose} />
      </CSSTransition>
    </span>
  );
};
export default MainMenu;
