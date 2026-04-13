import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../Button/Button';
import Page from '../../../../models/Page';
import Markdown from '../../Markdown/Markdown';

export const CategoryNoData = (): ReactElement => {
  const { t } = useTranslation('Category');
  return (
    <div className="CategoryNoData">
      <Markdown content={t('noData.text')} />
      <Button
        text={t('noData.button.survey')}
        to={t(Page.SURVEY, { ns: 'URL' })}
        className="invert"
      />
    </div>
  );
};

export default CategoryNoData;
