/* eslint-disable consistent-return */
import { writeFile } from 'fs';

import fr from '../src/plugins/i18n/fr';
import en from '../src/plugins/i18n/en';

type Translations = {
  [key: string]: string | any;
};

const languages: { [key: string]: Translations } = {
  fr,
  en,
};

const flattenObject = (obj: Translations, prefix: null | string = null, result: Translations = {}): Translations => {
  const newResults = result || {};

  // Preserve empty objects and arrays, they are lost otherwise
  if (typeof obj === 'object' && obj !== null && prefix && Object.keys(obj).length === 0) {
    newResults[prefix] = Array.isArray(obj) ? [] : {};
    return result;
  }

  const newPrefix = prefix ? `${prefix}.` : '';

  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (typeof val === 'object' && val !== null) {
      // Recursion on deeper objects
      flattenObject(val, `${newPrefix}${key}`, newResults);
    } else {
      newResults[`${newPrefix}${key}`] = val;
    }
  });

  return newResults;
};

const quoteField = (field: string): string => `"${field.replace(/"/g, '""')}"`;
const json2csv = (obj: Translations): string => {
  let results = '';
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    results += `${quoteField(key)},${quoteField(val)}\n`;
  });
  return results;
};


Object.keys(languages).forEach((key) => {
  const obj = languages[key];
  const flattenTranslation = flattenObject(obj);
  const csvContent = json2csv(flattenTranslation);
  // eslint-disable-next-line no-undef
  writeFile(`scripts/${key}.csv`, csvContent, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      return console.error(err);
    }
  });
});
