import localForage from 'localforage';

export const langStorage = localForage.createInstance({
  name: 'quorum',
  storeName: 'lang',
});
export default {
  langStorage,
};
