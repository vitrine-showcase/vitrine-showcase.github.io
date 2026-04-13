import React, { ReactElement }  from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Category from '../../../../models/Category';
import Page from '../../../../models/Page';
import CategoryTitle from '../../CategoryTitle/CategoryTitle';
import Button from '../../Button/Button';
import './Presentation.scss';

type Props = {
  category?: Category;
  hasCTA?: boolean;
}

const Presentation = ({
  category = Category.COMMON, hasCTA = false,
}: Props): ReactElement => {
  const { t } = useTranslation('Category');

  const descriptionTitle = hasCTA && (
    <CategoryTitle category={category} />
  );

  return (
    <div className="Presentation">
      <div className="Presentation-title">
        <Trans
          ns="Category"
          i18nKey={`${category}.teaser`}
          parent="h2"
          components={{ span: <span className="has-font-secondary" /> }}
        />
        {
          hasCTA && (
          <Button
            to={`${t(Page.CATEGORY, { ns: 'URL' })}/${category}`}
            text={t(`${category}.cta`)}
            className="invert"
          />
        )
        }
      </div>
      <div className="Presentation-description">
        {descriptionTitle}
        <p>
          <Trans
            ns="Category"
            i18nKey={`${category}.description`}
            components={{ mark: <mark />, span: <span className="is-underlined" /> }}
          />
        </p>
      </div>
    </div>
  );};
Presentation.defaultProps = {
  category: Category.COMMON,
  hasCTA: false,
};

export default Presentation;
