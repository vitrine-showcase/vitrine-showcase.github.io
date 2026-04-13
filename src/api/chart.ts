import { AxiosResponse } from 'axios';
import { chartClient } from './client';

import Category from '../models/Category';
import { ChartDate, ChartEvent } from '../models/Chart';

export const fetchHomeChart = (category: Category): Promise<AxiosResponse<ChartDate>> =>
  chartClient.get<ChartDate>(`/charts/quorum-chart-${category}/`);

export const fetchChartEvent = (eventSlug: string): Promise<AxiosResponse<ChartEvent>> =>
  chartClient.get<ChartEvent>(`/events/${eventSlug}/`);

export default {
  fetchHomeChart,
  fetchChartEvent,
};
