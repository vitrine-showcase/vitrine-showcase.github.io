export type ImportedFiles = {
  [key: string]: { default: string};
};
export const importAll = (r: ReturnType<typeof require.context>): ImportedFiles => {
  let files = {};
  r.keys().forEach((key: string) => {
    files = {
      ...files,
      [key]: r(key)
    };
  });
  return files;
};
export const importAllImages = (): ImportedFiles => {
  const r = require.context('../assets/images/', true, /\.(png|gif|jpg)$/);
  return importAll(r);
};

export default {
  importAll,
  importAllImages,
};
