import React, { FunctionComponent, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Category from '../../../../models/Category';
import ChevronIcon from '../../SVGs/ChevronIcon';
import { ArticlePreview as ArticlePreviewType } from '../../../../models/Blog';
import { format as formatDate } from '../../../../helpers/date';
import './ArticlePreview.scss';

interface ArticlePreviewProps {
  category?: Category;
  article: ArticlePreviewType;
}

const ArticlePreview: FunctionComponent<ArticlePreviewProps> = ({
  category,
  article: {
    title, lead_image: leadImage, published_on: publishedOn, slug,
  }
}) => {
  const { t } = useTranslation('ArticlePreview');
  return (
    <section className={`ArticlePreview ${category}`}>
      <div className="ArticlePreview-figure-wrapper">
        <Link to={slug} className="ArticlePreview-content-read">
          <figure className="ArticlePreview-figure">
            {leadImage ? <img src={leadImage} alt={title} /> : null}
          </figure>
        </Link>
      </div>
      <section className="ArticlePreview-content">
        <div className="ArticlePreview-content-header">
          <span className="ArticlePreview-content-header-date">{formatDate(publishedOn)}</span>
        </div>
        <Link to={slug}>
          <h4 className="ArticlePreview-content-title">{title}</h4>
        </Link>
        <Link to={slug} className="ArticlePreview-content-read">
          <span className="chevron">
            <ChevronIcon />
          </span>
          <span>{t('read')}</span>
        </Link>
      </section>
    </section>
  );
}

export default memo(ArticlePreview);
