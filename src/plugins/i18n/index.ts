import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { langStorage } from '../storage';

import fr from './fr';
import en from './en';

const defaultLocale = 'fr';
const domainLocaleMap: { [key: string]: string } = {
  [process.env.REACT_APP_FR_DOMAIN ?? 'vitrinedemocratique.ca']: 'fr',
  [process.env.REACT_APP_EN_DOMAIN ?? 'en.vitrinedemocratique.ca']: 'en',
};

i18n
  .use({
    type: 'languageDetector',
    async: true, // If this is set to true, your detect function receives a callback function that you should call with your language, useful to retrieve your language stored in AsyncStorage for example
    init(/* services: Services, detectorOptions: object, i18nextOptions: InitOptions */) {
      // Need to be here, but not needed for now
    },
    detect(callback: (lng: string) => void) {
      const locale = domainLocaleMap[window.location.host] ?? defaultLocale;
      return callback(locale);
    },
    cacheUserLanguage(lng: string) {
      langStorage.setItem('current', lng);
    }
  })
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      fr,
      en,
    },

    fallbackLng: 'fr',
    nonExplicitSupportedLngs: true,
    initImmediate: false,
    debug: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
