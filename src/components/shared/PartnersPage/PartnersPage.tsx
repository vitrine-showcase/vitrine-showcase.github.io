import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import InfoPage from '../InfoPage/InfoPage';

import clessn from '../../../assets/images/partners/clessn_logo.png';
import clessnEN from '../../../assets/images/partners/clessn_logoEN.png';
import crdip from '../../../assets/images/partners/crdip_logo.png';
import crdipEN from '../../../assets/images/partners/crdip_logoEN.png';
import cecd from '../../../assets/images/partners/cecd_logo.png';
import cecdEN from '../../../assets/images/partners/cecd_logoEN.png';
import capp from '../../../assets/images/partners/capp_logo.png';
import cappEN from '../../../assets/images/partners/capp_logoEN.png';
import fodem from '../../../assets/images/partners/fodem_logo.png';
import fodemEN from '../../../assets/images/partners/fodem_logoEN.png';
import grcp from '../../../assets/images/partners/grcp_logo.png';
import grcpEN from '../../../assets/images/partners/grcp_logoEN.png';
import crcis from '../../../assets/images/partners/crcis_logo.png';
import crcisEN from '../../../assets/images/partners/crcis_logoEN.png';
import obvia from '../../../assets/images/partners/obvia_logo.png';
import obviaEN from '../../../assets/images/partners/obvia_logoEN.png';
import infoscope from '../../../assets/images/partners/infoscope_logo.png';
import infoscopeEN from '../../../assets/images/partners/infoscope_logoEN.png';
import glpl from '../../../assets/images/partners/glpl_logo.png';

type Logo = { src: string; srcEN: string; alt: string; href: string };

const ACADEMIC: Logo[] = [
  { src: capp,    srcEN: cappEN,    alt: 'CAPP',     href: 'https://capp-ulaval.ca/' },
  { src: clessn,  srcEN: clessnEN,  alt: 'CLESSN',   href: 'https://www.clessn.com/' },
  { src: crdip,   srcEN: crdipEN,   alt: 'CRDIP',    href: 'https://www.democratie.chaire.ulaval.ca/' },
  { src: cecd,    srcEN: cecdEN,    alt: 'CECD',     href: 'https://csdc-cecd.ca/fr/' },
  { src: fodem,   srcEN: fodemEN,   alt: 'FoDEM',    href: 'https://www.fodem.ca/' },
  { src: grcp,    srcEN: grcpEN,    alt: 'GRCP',     href: 'https://www.grcp.ulaval.ca/' },
  { src: crcis,   srcEN: crcisEN,   alt: 'CRCIS',    href: 'https://immigration-securite.chaire.ulaval.ca/fr/' },
  { src: obvia,   srcEN: obviaEN,   alt: 'Obvia',    href: 'https://obvia.ca/' },
];

const INDUSTRY: Logo[] = [
  { src: infoscope, srcEN: infoscopeEN, alt: 'Infoscope',                        href: 'https://www.infoscope.ca/' },
  { src: glpl,      srcEN: glpl,        alt: 'Les productions gros lait et petit lait', href: '#' },
];

type LogoGroupProps = { logos: Logo[]; isEN: boolean };
const LogoGroup = ({ logos, isEN }: LogoGroupProps) => (
  <div className="InfoPage-logos">
    {logos.map(({ src, srcEN, alt, href }) => (
      <a key={alt} href={href} target="_blank" rel="noreferrer">
        <img src={isEN ? srcEN : src} alt={alt} />
      </a>
    ))}
  </div>
);

const PartnersPage = (): ReactElement => {
  const { t, i18n } = useTranslation('Partners');
  const isEN = i18n.language.toLowerCase().startsWith('en');

  return (
    <InfoPage
      slug="partners"
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
    >
      <section className="InfoPage-section section-outer">
        <div className="section-inner">
          <h2 className="InfoPage-section-heading has-font-secondary">{t('academic.heading')}</h2>
          <LogoGroup logos={ACADEMIC} isEN={isEN} />
        </div>
      </section>

      <section className="InfoPage-section section-outer">
        <div className="section-inner">
          <h2 className="InfoPage-section-heading has-font-secondary">{t('industry.heading')}</h2>
          <LogoGroup logos={INDUSTRY} isEN={isEN} />
        </div>
      </section>
    </InfoPage>
  );
};

export default memo(PartnersPage);
