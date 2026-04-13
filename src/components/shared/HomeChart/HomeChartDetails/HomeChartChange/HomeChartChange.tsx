import React, { FunctionComponent } from 'react';

import './HomeChartChange.scss'

type Props = {
  value: number;
  color: string;
}

const HomeChartChange: FunctionComponent<Props> = ({ value, color }: Props) => (
  <div className="HomeChartChange">
    <span className="HomeChartChange-indicator" style={{ color }}>
      {value >= 0 ? '▲' : '▼'}
    </span>
    {`${Math.abs(value).toFixed(2)}%`}
  </div>
)

export default HomeChartChange;
