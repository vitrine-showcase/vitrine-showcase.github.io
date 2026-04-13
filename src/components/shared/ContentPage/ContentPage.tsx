import React, { FunctionComponent, memo } from 'react';

import { useTranslation } from 'react-i18next';
import SitePage from '../SitePage/SitePage';
import Markdown from '../Markdown/Markdown';

import './ContentPage.scss';

interface OwnProps {
  contentSlug?: string;
}

type ContentPageProps = OwnProps;

const ContentPage: FunctionComponent<ContentPageProps> = ({ contentSlug }) => {
  const { t } = useTranslation('Content')
  const withDropCap = contentSlug !== 'partners';
  return (
    <SitePage className={`ContentPage ContentPage-${contentSlug} full-page`}>
      <section className="section-inner">
        <h1 className="ContentPage-title">{t(`${contentSlug}.title`)}</h1>
        <Markdown content={t(`${contentSlug}.markdown`)} dropCap={withDropCap} />
      </section>
    </SitePage>
  );
}

export default memo(ContentPage);
