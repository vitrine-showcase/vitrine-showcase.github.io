import React, { ReactElement, SVGProps } from 'react';

export const InfoIcon = ({ width = 16, height = 17, x, y }: SVGProps<SVGElement>): ReactElement => (
    <svg width={width} height={height} x={x} y={y} viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8.5" r="8" fill="#020202" className="InfoIcon-background" />
      <path d="M7 8.5H9V13.5H7V8.5Z" fill="#F5F5F0" className="InfoIcon-i" />
      <circle cx="8" cy="5.5" r="1" fill="#F5F5F0" className="InfoIcon-i" />
    </svg>
  );
export default InfoIcon;
