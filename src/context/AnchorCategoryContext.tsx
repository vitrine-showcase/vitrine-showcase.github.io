import React, { createContext, FunctionComponent, memo, useMemo } from 'react';
import { useLocation } from 'react-router';
import Category from '../models/Category';

export interface ArchorCategoryContextProps {
  anchoredCategory?: Category;
}

const initArchorCategoryContext: ArchorCategoryContextProps = {}

export const AnchorCategoryContext = createContext<ArchorCategoryContextProps>(initArchorCategoryContext);

export const AnchorCategoryContextProvider: FunctionComponent = memo(({ children }) => {
  const { hash } = useLocation();

  const values: ArchorCategoryContextProps = useMemo(() => ({
    anchoredCategory: Object.values(Category).find((category) => `#${category}` === hash)
  }), [hash]);

  return (<AnchorCategoryContext.Provider value={values}>{children}</AnchorCategoryContext.Provider>)
});

export const AnchorCategoryContextConsumer: FunctionComponent<{ children: FunctionComponent<ArchorCategoryContextProps> }> =
  memo(
    ({ children }) => (<AnchorCategoryContext.Consumer>{children}</AnchorCategoryContext.Consumer>)
  );
