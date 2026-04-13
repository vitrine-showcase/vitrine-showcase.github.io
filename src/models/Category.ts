import { BasicItem } from './BasicItem';

export enum Category {
  COMMON = 'common',
  PUBLIC_OPINION = 'civimetreplus',
  MEDIA = 'radarplus',
  AUTHORITIES = 'agoraplus',
}

export type CategoryItem = BasicItem<Category>
export default Category;
