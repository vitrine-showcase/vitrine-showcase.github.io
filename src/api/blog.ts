import { AxiosResponse } from 'axios';
import { Article, ArticlePreview } from '../models/Blog';
import Category from '../models/Category';
import { blogClient } from './client';

export const fetchArticlesPreview = (category: Category): Promise<AxiosResponse<ArticlePreview[]>> =>
  blogClient.get<ArticlePreview[]>('/articles', { params: { category } });

export const fetchArticle = (articleSlug: string): Promise<AxiosResponse<Article>> =>
  blogClient.get<Article>(`/articles/${articleSlug}/`);

export default {
  fetchArticlesPreview,
  fetchArticle,
};
