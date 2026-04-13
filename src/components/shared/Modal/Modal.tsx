/* eslint-disable no-unused-expressions */
import React, {
  useEffect, useRef, forwardRef, ForwardRefRenderFunction, ReactNode, MutableRefObject,
} from 'react';
import { createPortal } from 'react-dom';

import './Modal.scss';

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  keepBodyScroll?: boolean;
}

const modalRoot = document.getElementById('root');

const Modal: ForwardRefRenderFunction<ReactNode, Props> = ({ children, className, onClick, keepBodyScroll = true }, ref) => {
  const elRef = useRef<HTMLDivElement>(document.createElement('div'));

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/35572
  const castedRef = ref as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    const myRef = elRef.current;
    modalRoot?.appendChild(myRef);
    return (): void => { modalRoot?.removeChild(myRef); };
  }, []);

  useEffect(() => {
    if (keepBodyScroll) {
      document.body.classList.add('keep-scroll');
    } else {
      document.body.classList.remove('keep-scroll');
    }
    return (): void => { document.body.classList.remove('keep-scroll'); };
  }, [keepBodyScroll]);

  return createPortal(<div className={`Modal ${className}`} ref={castedRef} onClick={onClick} aria-hidden="true">{children}</div>, elRef.current);
};

export default forwardRef(Modal);
