import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import norwegianTranslations from './locales/no.json';
import englishTranslations from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      no: {
        translation: norwegianTranslations
      },
      en: {
        translation: englishTranslations
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;