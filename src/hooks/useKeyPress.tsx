import { useEffect } from 'react';
/**
 * useKeyPress
 * @param {string} key - the name of the key to respond to, compared against event.key
 * @param {function} action - the action to perform on key press
 */
const useKeypress = (key: string, action: () => void): void => {
  useEffect(() => {
    const onKeyup = (e: KeyboardEvent): void => {
      if (e.key === key) action();
    };
    window.addEventListener('keyup', onKeyup);
    return (): void => window.removeEventListener('keyup', onKeyup);
  }, [key, action]);
};

export default useKeypress;
