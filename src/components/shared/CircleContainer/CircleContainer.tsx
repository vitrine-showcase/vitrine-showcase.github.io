import React, { ReactElement, ReactNode } from 'react';
import './CircleContainer.scss';

type Props = {
  children: ReactNode;
  className?: string;
};

export const CircleContainer = ({ children, className }: Props): ReactElement => (
  <div className={`CircleContainer ${className}`}>
    <div className="CircleContainer-body">
      <div className="CircleContainer-body-content">
        { children}
      </div>
    </div>
  </div>
);

CircleContainer.defaultProps = {
  className: '',
};
export default CircleContainer;
