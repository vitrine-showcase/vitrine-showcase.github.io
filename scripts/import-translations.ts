/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
import { writeFile } from 'fs';
import csv from 'csvtojson';

const languages = ['fr', 'en'];
const csvBasePath = 'scripts';
const destPath = 'src/plugins/i18n';

type Translations = {
  [key: string]: string | any;
};

const unflattenObject = (obj: Translations): Translations => {
  const result = {};

  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    const keys = key.match(/^\.+[^.]*|[^.]*\.+$|(?:\.{2,}|[^.])+(?:\.+$)?/g); // Just a complicated regex to only match a single dot in the middle of the string
    if (keys) {
      keys.reduce((r: Translations, e: string, idx: number) => r[e] || 
        (r[e] = isNaN(Number(keys[idx + 1])) ? (keys.length - 1 === idx ? val : {}) : []), result);
    }
  });

  return result;
};

const getKeyValuePair = (content: Translations[]): Translations => {
  const results: Translations = {};
  content.forEach(({key, value}: Translations) => {
    results[key] = value;
  });
  return results;
};
const quoteKey = (key: string): string => key.indexOf('-') >= 0 ? `'${key}'` : key;
const quoteVal = (val: string): string => {
  if (val.indexOf('\n') < 0 && val.indexOf('${') < 0) {
    if (val.indexOf("'") >= 0) {
      return `"${val}"`;
    }
    return `'${val}'`;
  }
  return `\`${val.replace(/`/g, '\\`')}\``;
};
const stringify = (content: Translations | string, level = 1): string => {
  if (typeof content !== 'object' || Array.isArray(content)){
      return quoteVal(content as string);
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  const props: string = Object
          .keys(content)
          .map((key, index) => `${index > 0 ? '\n' : ''}${'  '.repeat(level)}${quoteKey(key)}: ${stringify(content[key], level + 1)},`)
          .join('');
  return `{\n${props}\n${'  '.repeat(level - 1)}}`;
}


const createTsFile = (content: Translations): string => `/* eslint-disable max-len */
export default ${stringify(content)};
`;

languages.forEach(async (lang: string) => {
  const jsonContent = await csv({
    noheader: true,
    headers: ['key', 'value'],
  }).fromFile(`${csvBasePath}/${lang}.csv`)
  const keyValuePairedContent = getKeyValuePair(jsonContent);
  const translationContent = unflattenObject(keyValuePairedContent);
  writeFile(`${destPath}/${lang}.ts`, createTsFile(translationContent), (err: NodeJS.ErrnoException | null) => {
    if (err) {
      return console.error(err);
    }
  });
});
