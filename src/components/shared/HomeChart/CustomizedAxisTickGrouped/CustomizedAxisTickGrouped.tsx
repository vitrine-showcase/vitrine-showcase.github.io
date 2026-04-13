import React, { ReactElement } from 'react';
import {
  Text,
} from 'recharts';

import { ChartData } from '../HomeChart';
import { getMonth } from '../../../../helpers/date';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
const CustomizedAxisTickGrouped = ({data, payload: { value, index, offset }, x, y}: any): null | ReactElement => {
  const cutGroup = (date: string): string => date.substring(0, 7);
  const currentGroup = cutGroup(value);
  const dataInGroup = data.filter(({ name }: ChartData) => cutGroup(name as string) === currentGroup);
  const middleElementInGroup = dataInGroup[Math.floor((dataInGroup.length - 1) / 2)];
  const middleElementIdx = data.findIndex(({ name }: ChartData) => name === middleElementInGroup?.name);
  if (middleElementIdx === index) {
    return (
      <Text
        x={x + offset}
        y={y}
        width={100}
        height={25}
        fill="gray"
        textAnchor="middle"
        verticalAnchor="start"
      >
        {getMonth(value).toLowerCase()}
      </Text>
    );
  }
  return null;
}

export default CustomizedAxisTickGrouped;
