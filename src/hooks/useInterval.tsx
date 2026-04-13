import { useEffect, useRef } from 'react';
import { getRandomInt } from '../helpers/number';

type Delay = number | {
  min: number;
  max: number;
};

/**
 * useInterval
 * @param {Delay} delay - the time in millisecond we need to wait before performing an action. Or a range where a random value will be chosen.
 * @param {function} action - the action to perform when the delay is reached.
 */
const useInterval = (delay: null | Delay, action: () => void): void => {
  const timeoutId = useRef<null | ReturnType<typeof setTimeout>>(null);
  const savedAction = useRef(action);
  const cancel = (): void => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
  };

  useEffect(() => {
    savedAction.current = action;
  });

  useEffect(() => {
    let interval = delay;
    if (delay !== null && typeof delay !== 'number') {
      interval = getRandomInt(delay.min, delay.max);
    }

    if (typeof interval === 'number') {
      const handleTick = (): void => {
        timeoutId.current = setTimeout(() => {
          savedAction.current();
          handleTick();
        }, interval as number);
      };

      handleTick();
    }

    return cancel;
  }, [delay, action]);

  return cancel();
};

export default useInterval;
