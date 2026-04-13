import { BasicItem } from './BasicItem';
import { CategoryItem } from './Category';

export enum BlogStatus {
  IDLE,
  FETCHING_ARTICLES,
  FETCHING_ARTICLE,
}

export interface ArticlePreview {
  published_on: string;
  lead_image: string;
  title: string;
  slug: string;
  language: BasicItem;
  category: CategoryItem;
  author: string;
  lead: string;
  tags: BasicItem[];
  mood?: number; 
}

export interface Article extends ArticlePreview {
  content: string;
  footer: string;
}
