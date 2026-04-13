import React, { MouseEvent, ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

import './FontSwitcher.scss';

type Props = {
  to: string;
  text: string;
  id?: string;
  onMouseEnter?: (e: MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const FontSwitcher = ({
  to, text, id, onMouseEnter, onMouseLeave,
}: Props): ReactElement => {
  const letterKeys = text.split('').map((letter: string, index: number) => ({letter, key: `${letter}=${index}`}));
  return (
    <NavLink
      to={to}
      id={id}
      className="FontSwitcher"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {
        letterKeys.map(({ letter, key }) => (
          <span key={key} data-letter={letter !== ' ' ? letter : '\u00a0'} />
      ))
    }
    </NavLink>
)
};
FontSwitcher.defaultProps = {
  id: undefined,
  onMouseEnter: undefined,
  onMouseLeave: undefined,
};

export default FontSwitcher;
