import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { langStorage } from '../plugins/storage';
import { ResponseMeta } from '../models/Response';

// Automatically add Accept-Language header with current language for every request.
export const languageInterceptor = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
  const { headers } = config;
  const locale = await langStorage.getItem('current') as string;
  return {
    ...config,
    headers: {
      ...headers,
      'Accept-Language': locale,
    },
  };
};

// Simplify the return
//    response.data and response.meta instead of response.data.data and response.data.meta
// OR ({data, meta}) instead of ({ data: { data, meta } })
export const responseInterceptor = async (response: AxiosResponse): Promise<AxiosResponse & { meta: ResponseMeta }> => {
  const {
    data: { data, meta },
  } = response;

  const { status_code: status, message: statusText } = meta;
  return {
    ...response,
    data,
    meta,
    status,
    statusText,
  };
};
