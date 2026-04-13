import React, { ReactElement, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
// Hack for iPhone unexpected vh unit management
import vhCheck from 'vh-check'
import { AnchorCategoryContextProvider } from '../../../context/AnchorCategoryContext';
import { ArticlesContextProvider } from '../../../context/ArticlesContext';
import { DataContextProvider } from '../../../context/DataContext';
import Page from '../../../models/Page';
import LoadingPage from '../Loading/LoadingPage';
import './App.scss';


const ArticlePage = lazy(() => import('../ArticlePage/ArticlePage'));
const HomePage = lazy(() => import('../Home/Home'));
const CategoryPage = lazy(() =>  import('../CategoryPage/CategoryPage'));
const ContentPage = lazy(() =>  import('../ContentPage/ContentPage'));

const contentPages = [Page.ABOUT, Page.CONTACT, Page.PARTNERS, Page.METHODOLOGY, Page.CONDITIONS, Page.PRIVACY];

const App = (): ReactElement => {
  useEffect(() => {
    vhCheck({
      cssVarName: 'vh-offset',
      force: true,
    });
  });

  const { t } = useTranslation('URL');

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Suspense fallback={<LoadingPage />}>
          <DataContextProvider>
            <AnchorCategoryContextProvider>
              <HomePage />
            </AnchorCategoryContextProvider>
          </DataContextProvider>
        </Suspense>}/>
        <Route path={`${t(Page.CATEGORY)}`} element={<ArticlesContextProvider><Outlet /></ArticlesContextProvider>}>
          <Route path=":categorySlug" element={<Suspense fallback={<LoadingPage />}>
              <CategoryPage />
            </Suspense>}
          />
          <Route path=":categorySlug/:articleSlug" element={<Suspense fallback={<LoadingPage />}>
              <ArticlePage />
            </Suspense>}
          />
        </Route>
        {contentPages.map((page) => (
          <Route
            path={`${t(page)}`}
            element={<Suspense fallback={<LoadingPage />}
          >
            <ContentPage contentSlug={page} />
          </Suspense>}/>)
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App;
