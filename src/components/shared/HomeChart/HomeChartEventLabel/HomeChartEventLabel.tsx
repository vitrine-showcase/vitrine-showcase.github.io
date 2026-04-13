import React, { ReactElement, RefObject } from 'react';
import { ResponsiveContainer, ViewBox } from 'recharts';
import { ChartEvent } from '../../../../models/Chart';

import './HomeChartEventLabel.scss';

type Props = {
  active: boolean;
  event: ChartEvent;
  offset?: number;
  viewBox?: ViewBox;
  containerRef: RefObject<ResponsiveContainer>;
}
const HomeChartEventLabel = ({
  active, event, offset = 0, viewBox, containerRef,
}: Props): null | ReactElement => {
  if (active) {
    const { title, text, image: imageInfo } = event;
    const { x = 0, y = 0 } = viewBox as ViewBox;
    const labelWidth = 320;
    const labelHeight = 128;
    const parentWidth = containerRef?.current?.state?.containerWidth || (x + labelWidth);
    const newX = Math.max(Math.min(x - (labelWidth / 2), parentWidth - labelWidth), 0);
    return (
      <foreignObject x={newX} y={y - labelHeight - offset} width={labelWidth} height={labelHeight}>
        <div className="HomeChartEventLabel-tooltip">
          {
          (imageInfo?.url
            ? (
              <div className="HomeChartEventLabel-tooltip-image">
                <img src={imageInfo?.url} alt={imageInfo?.name} />
              </div>
            )
            : null)
          }
          <div className="HomeChartEventLabel-tooltip-content">
            <p className="label">{title}</p>
            <p className="intro">{text}</p>
          </div>
        </div>
      </foreignObject>
    );
  }
  return null;
}
HomeChartEventLabel.defaultProps = {
  offset: 0,
  viewBox: undefined,
};

export default HomeChartEventLabel;
