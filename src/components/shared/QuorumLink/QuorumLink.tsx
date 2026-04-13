import React, { MouseEvent, ReactElement, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  to: string;
  children: ReactNode;
  id?: string;
  className?: string;
  ariaLabel?: string;
  onMouseEnter?: (e: MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLAnchorElement>) => void;
};
const QuorumLink = ({
  to,
  children,
  id,
  className,
  ariaLabel,
  onMouseEnter,
  onMouseLeave
}: Props): ReactElement => {
  const { i18n } = useTranslation();
  const urlMapping: { [key: string]: string } = {
    fr: `//${process.env.REACT_APP_QUORUM_FR_DOMAIN ?? 'projetquorum.com'}`,
    en: `//${process.env.REACT_APP_QUORUM_EN_DOMAIN ?? 'quorumproject.com'}`,
  };
  const currentLang = i18n.language.toLowerCase();

  const href = `${urlMapping[currentLang]}/${to}`;
  return (
    <a
      href={href}
      id={id}
      className={className}
      aria-label={ariaLabel}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >{children}</a>
  )
}
QuorumLink.defaultProps = {
  id: undefined,
  className: undefined,
  ariaLabel: undefined,
  onMouseEnter: undefined,
  onMouseLeave: undefined,
};

export default QuorumLink;
