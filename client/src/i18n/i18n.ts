import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import no from './no.json';
import en from './en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      no: { translation: no },
      en: { translation: en }
    },
    lng: 'en', // Change default to English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;