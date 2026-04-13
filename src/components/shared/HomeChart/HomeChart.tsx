import React, { createRef, ReactElement, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Coordinate,
  Label,
  Line,
  LineChart,
  LineType,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  XAxisProps,
  YAxis,
} from 'recharts';

import CustomizedAxisTickGrouped from './CustomizedAxisTickGrouped/CustomizedAxisTickGrouped';
import InfoIcon from '../SVGs/InfoIcon';
import HomeChartDetails from './HomeChartDetails/HomeChartDetails';
import HomeChartEventLabel from './HomeChartEventLabel/HomeChartEventLabel';
import { ChartEvent } from '../../../models/Chart';

import './HomeChart.scss';
import variables from '../../../assets/styles/variables.module.scss';

export type DataKey = {
  key: string;
  color?: string;
  lineType?: LineType;
  displayDots?: boolean;
}
export type Legend = {
  name: string;
  value: number | string;
  dataKey?: string;
}
export type ChartData = {
  [key: string]: string | number;
}

type Props = {
  data: ChartData[];
  dataKeys: DataKey[];
  xAxisAttr?: XAxisProps;
  yAxis: { min: number; max: number };
  events?: ChartEvent[];
}

const HomeChart = ({
  data, dataKeys, xAxisAttr, yAxis, events,
}: Props): null | ReactElement => {
  if (data.length <= 0) {
    return null;
  }

  const { t } = useTranslation('HomeChart');
  const containerRef = createRef<ResponsiveContainer>();
  const [legendData, setLegendData] = useState<Legend[]>();
  const [currentEvent, setCurrentEvent] = useState<ChartEvent>();

  const handleEventMouseEnter = (currentEvent: ChartEvent): void => setCurrentEvent(currentEvent);
  const handleEventMouseLeave = (): void => setCurrentEvent(undefined);

  const MemoizedInfoIcon = useCallback(({ viewBox }): ReactElement => <InfoIcon {...viewBox} />, []);
  const MemoizedCustomTooltip = useCallback(({ active, payload }: TooltipProps): null | ReactElement => {
    let newLegendData = payload as Legend[] || null;
    if (!active && data.length > 0) {
      const lastData = data[data.length - 1];
      newLegendData = dataKeys.map(({ key }) => ({
        name: `${lastData.name}-${key}`,
        value: lastData[key],
        dataKey: key,
        payload: {
          [`${key}-change`]: lastData[`${key}-change`]
        },
      }));
    }

    useEffect(() => {
      if (JSON.stringify(legendData) !== JSON.stringify(newLegendData)) {
        setLegendData(newLegendData);
      }
    }, [newLegendData, legendData]);

    const [firstPayload] = payload ?? [];
    if (firstPayload) {
      const { payload: { name: label = '' } } = firstPayload;
      return (
        <span>{ label }</span>
      );
    }
    return null;
  }, [data, dataKeys, legendData, setLegendData]);

  // https://github.com/recharts/recharts/issues/804
  // TODO We want to display the dots at the end of the lines. It would be better by having the `dot` prop in Line
  // to receive a function and display the dot conditionnaly. For now, I'm using ReferenceDot for every line...
  const lastData = data[data.length - 1];
  const lastDots: {x: string | number; y: string | number; color: string}[] = Object.keys(lastData).filter((key: string) => key !== 'name' && key.indexOf('-change') < 0).map((key: string) => ({
    x: lastData.name,
    y: lastData[key],
    color: dataKeys.find(({key: dataKey}) => dataKey === key)?.color ?? variables.primary,
  }));
  return (
    <div className="HomeChart">
      <HomeChartDetails data={legendData} dataKeys={dataKeys} />
      <ResponsiveContainer ref={containerRef}>
        <LineChart data={data}>
          <ReferenceLine y={50} stroke={variables.primary} strokeWidth="3" strokeDasharray="1 12" strokeLinecap="round" />
          {dataKeys.map((dataKey: DataKey) => (
            <Line
              key={dataKey.key}
              type={dataKey?.lineType ?? 'natural'}
              dataKey={dataKey.key}
              strokeWidth={2}
              stroke={dataKey?.color ?? variables.primary}
              activeDot={{r: 4, stroke: 'none', fill: dataKey?.color ?? variables.primary}}
              dot={false}
            />
          ))}
          {lastDots.map(({x, y, color}) => (
            <ReferenceDot
              key={`${x}-${y}-${color}`}
              x={x}
              y={y}
              r={4}
              stroke="none"
              fill={color}
            />
          ))}
          <XAxis
            dataKey={xAxisAttr?.dataKey ?? 'name'}
            axisLine={!!xAxisAttr?.axisLine}
            tickLine={!!xAxisAttr?.tickLine}
            interval={0}
            tick={<CustomizedAxisTickGrouped data={data} />}
            {...xAxisAttr}
          />
          <YAxis domain={[yAxis.min ?? 'dataMin', yAxis.max ?? 'dataMax']} hide />
          <ReferenceLine y={52} strokeWidth={0}>
            <Label value={t('yAxis.up') as string} offset={0} position="insideRight" />
          </ReferenceLine>
          <ReferenceLine y={48} strokeWidth={0}>
            <Label value={t('yAxis.down') as string} offset={0} position="insideRight" />
          </ReferenceLine>
          <Tooltip
            content={<MemoizedCustomTooltip />}
            position={{ y: -25 } as Coordinate}
            offset={-45}
            cursor={{ stroke: variables.primary, strokeWidth: 1, strokeOpacity: 0.2 }}
            wrapperStyle={{ zIndex: -1 }}
            active
          />
          {events ? events.map((chartEvent: ChartEvent) => {
            const { date, slug } = chartEvent;
            return (
              <ReferenceDot
                key={`${slug}`}
                className="HomeChart-event"
                label={<Label content={<MemoizedInfoIcon />} />}
                x={date}
                y={50}
                fill={variables.primary}
                stroke="none"
                onMouseEnter={(): void => handleEventMouseEnter(chartEvent)}
                onMouseOut={handleEventMouseLeave}
              >
                <Label content={<HomeChartEventLabel active={chartEvent === currentEvent} event={chartEvent} containerRef={containerRef} />} position="insideTop" />
              </ReferenceDot>
            );
          }) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>

  );
};
HomeChart.defaultProps = {
  xAxisAttr: undefined,
  events: undefined,
};

export default HomeChart;
