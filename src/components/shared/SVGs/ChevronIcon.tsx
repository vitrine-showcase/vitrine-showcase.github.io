import React, { ReactElement, SVGProps } from 'react';

import variables from '../../../assets/styles/variables.module.scss';

export enum ChevronDirection {
  RIGHT,
  LEFT,
};
export const ChevronIcon = (
  { width = 8, height = 13, color = variables.primary, direction = ChevronDirection.RIGHT }: SVGProps<SVGElement>
): ReactElement => {
  const paths: {[key: string]: string} = {
    [ChevronDirection.RIGHT]: 'M1.5 11.5L6.5 6.5L1.5 1.5',
    [ChevronDirection.LEFT]: 'M6.70001 1.5L1.70001 6.5L6.70001 11.5',
  };
  return (
    <svg width={width} height={height} viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={paths[direction]} stroke={color} strokeWidth="1.5" strokeMiterlimit="10" />
    </svg>
  )
};
export default ChevronIcon;
