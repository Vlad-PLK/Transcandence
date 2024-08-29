import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import enJSON from './translations/en.json'
import ruJSON from './translations/ru.json'
import frJSON from './translations/fr.json'


// not like to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init


const languages = ['en', 'ru', 'fr'];

i18n
    /*
     load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
     learn more: https://github.com/i18next/i18next-http-backend
    */
    .use(Backend)
    /*
     detect user language
     learn more: https://github.com/i18next/i18next-browser-languageDetector
    */
    .use(LanguageDetector)
    /*
     pass the i18n instance to react-i18next.
    */
    .use(initReactI18next)
    /*
     init i18next
     for all options read: https://www.i18next.com/overview/configuration-options
    */
    .init({
        lng:"en",
        fallbackLng: 'en', // use et if detected lng is not available
        saveMissing: true, // send not translated keys to endpoint
        debug: true, //TODO: remove debug when finishing production
        interpolation: { escapeValue: false },
        whitelist: languages,
        resources: {
            en: {"translation": enJSON},
            ru: {"translation": ruJSON},
            fr: {"translation": frJSON}
        },
        react: {
            useSuspense: false
        }
    })


export default i18n;