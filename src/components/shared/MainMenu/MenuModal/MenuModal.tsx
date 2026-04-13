import React, {
  forwardRef, ForwardRefRenderFunction, ReactNode,
} from 'react';
import Modal from '../../Modal/Modal';
import MenuLayout from '../MenuLayout/MenuLayout';
import useKeypress from '../../../../hooks/useKeyPress';
import useClick from '../../../../hooks/useClick';

type Props = {
  onClose: () => void;
}

export const MenuModal: ForwardRefRenderFunction<ReactNode, Props> = ({ onClose }: Props, ref) => {
  useKeypress('Escape', onClose);
  useClick(onClose);

  return (
    <Modal ref={ref}>
      <div className="MenuModal">
        <div className="MenuModal-inner">
          <MenuLayout onClose={onClose} />
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef(MenuModal);
