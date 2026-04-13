import React, { FunctionComponent, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const urlMapping = {
  en: { targetLanguage: 'fr', targetUrl: `//${process.env.REACT_APP_FR_DOMAIN}`},
  fr: { targetLanguage: 'en', targetUrl: 'https://www.duolingo.com/course/fr/en/Learn-French'},
};

const LanguageLink: FunctionComponent = () => {
  const { t, i18n } = useTranslation('AppLanguage');
  const lang = useMemo(() => urlMapping[i18n.language.toLowerCase() as 'fr' | 'en'], [i18n.language])
  return (
    <div className="LanguageLink">
      <a href={lang.targetUrl} title={t('other.long')}>
        {t('other.short')}
      </a>
    </div>
  );
};

export default memo(LanguageLink);
