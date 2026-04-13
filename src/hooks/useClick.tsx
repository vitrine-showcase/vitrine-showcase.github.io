import { useEffect } from 'react';
/**
 * useClick
 * @param {function} action - the action to perform on click
 */
const useClick = (action: () => void): void => {
  useEffect(() => {
    window.addEventListener('click', action, true);
    return (): void => window.removeEventListener('click', action);
  }, [action]);
};

export default useClick;
