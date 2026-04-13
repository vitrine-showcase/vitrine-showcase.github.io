import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../Button/Button';
import CircleContainer from '../CircleContainer/CircleContainer';
import Page from '../../../models/Page';
import './MainAction.scss';

const MainAction = (): ReactElement => {
  const { t } = useTranslation('MainAction');
  const isFooterInViewport = false; // TODO need to know when footer is in viewport

  return (
    <aside>
      <div className={`MainAction ${isFooterInViewport ? 'MainAction-end' : ''}`}>
        <div className="content-container">
          <CircleContainer className="half">
            <p>{t('survey.text')}</p>
            <Button text={t('survey.button')} to={t(Page.SURVEY, { ns: 'URL' })} data-testid="MainAction-button" />
          </CircleContainer>
        </div>
      </div>
    </aside>
  );
};

export default MainAction;
