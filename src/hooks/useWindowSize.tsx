import { useState, useEffect } from 'react';

// Hook
function useWindowSize(): { width: number, height: number } {
  const [windowSize, setWindowSize] = useState<{
    width: number,
    height: number,
  }>({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return windowSize;
}

export default useWindowSize;
