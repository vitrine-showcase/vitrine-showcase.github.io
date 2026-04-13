import React, { FunctionComponent, ReactElement } from 'react';
import { TooltipPayload } from 'recharts';
import { Trans } from 'react-i18next';

import { DataKey, Legend } from '../HomeChart';
import HomeChartChange from './HomeChartChange/HomeChartChange';

import './HomeChartDetails.scss';
import variables from '../../../../assets/styles/variables.module.scss';

type Props =  {
  data?: Legend[];
  dataKeys: DataKey[];
}

const HomeChartDetails: FunctionComponent<Props> = ({ data, dataKeys }: Props): null | ReactElement => {
  if (data) {
    return (
      <div className="HomeChartDetails">
        {dataKeys.map((mapped) => {
          const { name, value, dataKey, payload }: TooltipPayload = data.find(({ dataKey }) => mapped.key === dataKey) || {} as TooltipPayload;
          const key = mapped?.key as string || `${name}-${value}`;
          const change = payload?.[`${dataKey}-change`] || 0;
          return (
            <div
              key={key}
              className={`HomeChartDetails-content ${dataKeys.length > 1 ? 'multi' : ''}`}
            >
              <div className="HomeChartDetails-content-title">
                <Trans
                  ns="HomeChartDetails"
                  i18nKey={`${mapped?.key ?? ''}${value === undefined ? 'Soon' : ''}`}
                  parent="span"
                  components={{ span: <span className="linebreak" /> }}
                />
              </div>
              {
                value !== undefined ? (
                  <HomeChartChange value={change as number} color={mapped?.color || variables.primary} />
                ) : null
              }
            </div>
            )
          })}
      </div>
    );
  }
  return null;
}
HomeChartDetails.defaultProps = {
  data: undefined,
};

export default HomeChartDetails;
