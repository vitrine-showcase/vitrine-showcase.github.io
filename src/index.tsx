// IE11 Polyfills
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'intersection-observer';

import React from 'react';
import ReactDOM from 'react-dom';

import reportWebVitals from './reportWebVitals';
import './plugins/i18n';

import App from './components/shared/App/App';
import './assets/styles/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// eslint-disable-next-line no-console
reportWebVitals(process.env.REACT_APP_DEPLOY_ENV !== 'production' ? console.log : undefined);
