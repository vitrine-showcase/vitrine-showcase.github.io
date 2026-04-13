import i18n from '../plugins/i18n';

/**
 * format
 * @param {string} dateStr - the date string to format
 */
export const format = (dateStr: string, options: Intl.DateTimeFormatOptions | undefined = undefined): string => {
  try {
    const date = new Date(Date.parse(dateStr));
    return Intl.DateTimeFormat(i18n.language, options).format(date);
  } catch {
    return dateStr;
  }
};

/**
 * getMonth
 * @param {string} dateStr - the date string to format
 */
export const getMonth = (dateStr: string): string => format(dateStr, { month: 'long' });

export default {
  format,
  getMonth,
};
