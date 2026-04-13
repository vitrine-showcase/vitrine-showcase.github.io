import React, { createContext, Dispatch, FunctionComponent, memo, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Category from '../models/Category';
import { Article, ArticlePreview } from '../models/Blog';
import { fetchArticlesPreview, fetchArticle } from '../api/blog'

export interface ArticlesContextProps {
  setCurrentCategory: Dispatch<SetStateAction<Category | undefined>>
  setCurrentArticle: Dispatch<SetStateAction<Article | undefined>>
  currentCategory?: Category;
  currentArticle?: Article;
  currentArticlesPreview?: ArticlePreview[];
}

const initArticlesContext: ArticlesContextProps = {
  setCurrentCategory: () => {},
  setCurrentArticle: () => {},
}

const ArticlesContext = createContext<ArticlesContextProps>(initArticlesContext);

export const ArticlesContextProvider: FunctionComponent = memo(({ children }) => {
  const [ currentCategory, setCurrentCategory ] = useState<Category>();
  const [ currentArticle, setCurrentArticle ] = useState<Article>();
  const [ currentArticlesPreview, setCurrentArticlesPreview ] = useState<ArticlePreview[]>();

  const { categorySlug, articleSlug } = useParams();

  useEffect(() => {
    if (currentCategory) {
        fetchArticlesPreview(currentCategory).then(({ data }) => {
          setCurrentArticlesPreview(data);
        }).catch(() => { /* Blog API unavailable */ });
    }
  }, [currentCategory, setCurrentArticlesPreview]);

  useEffect(() => {
    if (articleSlug) {
      setCurrentArticle(undefined);
      fetchArticle(articleSlug).then(({ data }) => {
        setCurrentArticle(data);
      }).catch(() => { /* Blog API unavailable */ });
    }
  }, [articleSlug, setCurrentArticle])

  useEffect(() => {
    setCurrentCategory(categorySlug as Category);
  }, [categorySlug, setCurrentCategory]);

  const providerValues: ArticlesContextProps = useMemo(() => ({
    setCurrentCategory,
    setCurrentArticle,
    currentCategory,
    currentArticle,
    currentArticlesPreview,
  }), [currentCategory, currentArticle, currentArticlesPreview, setCurrentCategory, setCurrentArticle]);

  return (
    <ArticlesContext.Provider
      value={providerValues}
    >
      {children}
    </ArticlesContext.Provider>
  );
});

export const ArticlesContextConsumer: FunctionComponent<{ children: FunctionComponent<ArticlesContextProps> }> =
  memo(
    ({ children }) => (<ArticlesContext.Consumer>{children}</ArticlesContext.Consumer>)
  );
