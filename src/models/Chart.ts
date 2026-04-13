import { BasicItem } from './BasicItem';
import Category from './Category';
import { Image } from './Image';

export interface Chart extends BasicItem {
  description: string;
  events: string[];
}

export interface ChartEvent {
  slug: string;
  title: string;
  text: string;
  date: string;
  image: Image;
}

type ChartDateItem = {
  date: string;
  y: number;
  change: number;
};
export interface ChartDate extends Chart {
  data: ChartDateItem[];
  category?: Category;
}
