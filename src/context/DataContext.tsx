import React, { createContext, FunctionComponent, memo, useCallback, useMemo, useState } from 'react';
import { fetchChartEvent, fetchHomeChart } from '../api/chart';
import Category from '../models/Category';
import { ChartDate, ChartEvent } from '../models/Chart';

interface DataContextProps {
  categories: Category[];
  chartsEvents?: ChartEvent[];
  chartsData?: ChartDate[];
}

type CategoriesDataContextProps = DataContextProps & { [key in `chartData${Category}`]?: ChartDate }

const defaultCategories = [Category.PUBLIC_OPINION, Category.MEDIA, Category.AUTHORITIES];

const initDataContext: CategoriesDataContextProps = {
  categories: defaultCategories,
}

const DataContext = createContext<CategoriesDataContextProps>(initDataContext);

export const DataContextProvider: FunctionComponent = memo(({ children }) => {
    const [chartsData, setChartsData] = useState<ChartDate[]>();
    const [chartsEvents, setChartsEvents] = useState<ChartEvent[]>();

    const getEventsSlug = useCallback(() => {
      const eventsSlug = chartsData?.map(({ events }) => events).flat() ?? [];
      return eventsSlug.filter((slug: string, index: number) => eventsSlug.indexOf(slug) === index); // Get unique events slug
    }, [chartsData]);

    const initData = useCallback(async () => {
      if (!chartsData) {
        // Fetch Charts data
        const promises = defaultCategories.map((category: Category) => fetchHomeChart(category).then(({ data }) => data));
        await Promise.all(promises).then((chartsData) =>
          setChartsData(
            chartsData.map((data, index) => ({
              ...data,
              category: defaultCategories[index],
            })),
          ),
        ).catch(() => { /* API unavailable -- chart data is not used in the current UI */ });
      } else if (!chartsEvents) {
        // Fetch Charts events
        if (chartsData) {
          const eventsSlug = getEventsSlug();
          const promises = eventsSlug.map((eventsSlug: string) => fetchChartEvent(eventsSlug).then(({ data }) => data));
          await Promise.all(promises).then((chartsEvents) => setChartsEvents(chartsEvents))
            .catch(() => { /* API unavailable */ });
        }
      }
    }, [chartsData, setChartsData, chartsEvents, setChartsEvents, getEventsSlug]);

    const providerValues: CategoriesDataContextProps = useMemo(() => ({
      categories: defaultCategories,
      chartsData,
      chartsEvents,
      [`chartData${Category.AUTHORITIES}`]: chartsData?.find((chartData) => chartData.category === Category.AUTHORITIES),
      [`chartData${Category.MEDIA}`]: chartsData?.find((chartData) => chartData.category === Category.MEDIA),
      [`chartData${Category.PUBLIC_OPINION}`]: chartsData?.find((chartData) => chartData.category === Category.PUBLIC_OPINION),
    }), [defaultCategories, chartsData, chartsEvents]);

    initData();

    return (
      <DataContext.Provider
        value={providerValues}
      >
        {children}
      </DataContext.Provider>
    );
});


export const DataContextConsumer: FunctionComponent<{ children: FunctionComponent<CategoriesDataContextProps> }> = 
  memo(
    ({ children }) => (<DataContext.Consumer>{children}</DataContext.Consumer>)
  );
