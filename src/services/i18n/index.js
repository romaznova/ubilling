import i18n from 'i18n-js';

import uk from './locales/uk.json';
import ru from './locales/ru.json';
import en from './locales/en.json';
import moment from 'moment';
import {AsyncStorage} from 'react-native';
const storage = '@UbillingStorage';

let localTranslations = { uk, ru, en };

function initLanguage() {
    i18n.defaultLocale = 'ru';
    i18n.locale = 'ru';
    i18n.fallbacks = true;
    i18n.translations = localTranslations;
}

function getTranslation(language) {
    return AsyncStorage.getItem(`${storage}:translation:${language}`, (err, result) => {
        result =  JSON.parse(result);
        console.log({result, localTranslations});
    });
}

function compareTranslation(local, entered) {
    console.log({local, entered});
}

function setTranslation(language, translation) {
    AsyncStorage.setItem(`${storage}:translation:${language}`, JSON.stringify({translation}));
}

export function setLang(language = 'ru') {
    i18n.locale = language;
    moment.locale(language);
}

initLanguage();

export const translations = i18n.translations;

export default i18n;
