import React, { FunctionComponent, ReactNode } from 'react';

import SitePage from '../SitePage/SitePage';
import './InfoPage.scss';

type Props = {
  slug: string;
  eyebrow?: string;
  title: string | ReactNode;
  description?: string;
  children?: ReactNode;
}

const InfoPage: FunctionComponent<Props> = ({ slug, eyebrow, title, description, children }) => (
  <SitePage className={`InfoPage InfoPage--${slug}`}>
    <section className="InfoPage-header section-outer">
      <div className="section-inner">
        {eyebrow && <span className="InfoPage-eyebrow has-font-secondary">{eyebrow}</span>}
        <h1 className="InfoPage-title">{title}</h1>
        {description && <p className="InfoPage-description">{description}</p>}
      </div>
    </section>
    {children}
  </SitePage>
);

export default InfoPage;
