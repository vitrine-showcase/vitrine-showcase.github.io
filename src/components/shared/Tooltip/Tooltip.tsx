import React, { FunctionComponent, ReactElement, ReactNode } from 'react';

import Markdown from '../Markdown/Markdown';
import './Tooltip.scss';

type Props = {
  children: ReactNode;
  content: string;
  className?: string;
};

export const Tooltip: FunctionComponent<Props> = ({ children, className, content }: Props): ReactElement => (
  <div
    className={`Tooltip-wrapper ${className}`}
  >
    { children }
    <Markdown content={content} className="Tooltip-tip" fullWidth />
  </div>
);

Tooltip.defaultProps = {
  className: '',
};
export default Tooltip;
