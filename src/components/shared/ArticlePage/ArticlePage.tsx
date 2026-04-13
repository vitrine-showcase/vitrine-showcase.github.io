import React, { FunctionComponent, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ArticlesContextConsumer } from '../../../context/ArticlesContext';
import Category from '../../../models/Category';
import Page from '../../../models/Page';
import CategoryTitle from '../CategoryTitle/CategoryTitle';
import Markdown from '../Markdown/Markdown';
import SitePage from '../SitePage/SitePage';
import ChevronIcon, { ChevronDirection } from '../SVGs/ChevronIcon';
import { format as formatDate } from '../../../helpers/date';
import './ArticlePage.scss';

interface ArticlePageProps {}

const ArticlePage: FunctionComponent<ArticlePageProps> = () => {
  const { t } = useTranslation(['Article', 'URL']);
  return (<ArticlesContextConsumer>
  {({
      currentCategory,
      currentArticle,
    }) => {
        if (!currentArticle) {
          return <>loading...</>
        }
        const { title, author, published_on: publishedOn, lead, lead_image: leadImage, content, footer } = currentArticle;
        return (<SitePage className={`Article full-page ${currentCategory}`}>
        <section className="Article-header section-inner">
          <CategoryTitle category={currentCategory as Category} className="Article-header-icon" />
          <Link to={`/${t(Page.CATEGORY, { ns: 'URL' })}/${currentCategory}`} className="Article-header-back">
            <span className="chevron">
              <ChevronIcon className="chevron" direction={ChevronDirection.LEFT} />
            </span>
            <span>{t('back')}</span>
          </Link>
        </section>
        <section className="Article-content section-inner">
          <Markdown content={`# ${title}`} />

          <div className="Article-content-intro">
            <div className="Article-content-published">
              <div><span>{t('author', { author })}</span></div>
              <div><span>{t('publishedOn', { date: formatDate(publishedOn) })}</span></div>
            </div>
            <Markdown content={lead} dropCap fullWidth />
          </div>

          <div className="Article-figure-wrapper">
            <figure className="Article-figure">
              {leadImage && <img src={leadImage} alt={title} /> }
            </figure>
          </div>

          <Markdown content={content} />

          { footer && <Markdown className="Article-footer" content={footer} fullWidth /> }
        </section>
      </SitePage>)}}
</ArticlesContextConsumer>)}

export default memo(ArticlePage);
