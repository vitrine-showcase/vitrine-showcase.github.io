import React, { ReactElement, MouseEvent, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import './Button.scss';

type Props =  {
  to?: string;
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?(e: MouseEvent<HTMLButtonElement>): void;
  ariaLabel?: string;
  children?: ReactNode;
}

export const Button = ({
  to,
  text,
  type,
  loading: isLoading,
  disabled,
  className: propClassName,
  onClick: handleClick,
  ariaLabel,
  children,
}: Props): ReactElement => {
  /*
   * JSX line disabled for ESLint due to questionable rule implementation
   * Ref: https://github.com/yannickcr/eslint-plugin-react/issues/1555
   */
  let className = `Button ${propClassName}`;
  if (isLoading) {
    className += ' is-loading';
  }
  if (to) {
    return (
      <NavLink to={to} className={className} aria-label={ariaLabel}>
        {children || text}
      </NavLink>
    );
  }
  /* eslint-disable react/button-has-type */
  return (
    <button className={className} type={type} disabled={disabled} onClick={handleClick} aria-label={ariaLabel}>
      {children || text}
    </button>
  );
  /* eslint-enable react/button-has-type */
}
Button.defaultProps = {
  to: undefined,
  text: undefined,
  type: 'button',
  loading: false,
  disabled: false,
  className: undefined,
  onClick: undefined,
  ariaLabel: undefined,
  children: undefined,
};

export default Button;
