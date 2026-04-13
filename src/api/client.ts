import axios, { AxiosRequestConfig } from 'axios';
import { languageInterceptor, responseInterceptor } from './interceptors';

const baseApiConfig: AxiosRequestConfig = {
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
};

export const chartClient = axios.create({
  baseURL: process.env.REACT_APP_CHART_API_URL,
  ...baseApiConfig,
});
chartClient.interceptors.request.use(languageInterceptor);
chartClient.interceptors.response.use(responseInterceptor);


export const blogClient = axios.create({
  baseURL: process.env.REACT_APP_BLOG_API_URL,
  ...baseApiConfig,
});
blogClient.interceptors.request.use(languageInterceptor);
blogClient.interceptors.response.use(responseInterceptor);


export default {
  chartClient,
  blogClient
};
