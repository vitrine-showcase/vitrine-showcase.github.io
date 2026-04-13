/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, MutableRefObject } from 'react';

function useOnScreen(rootMargin = '0px'): [MutableRefObject<any>, boolean] {
    // State and setter for storing whether element is visible
    const ref = useRef();
    const [isIntersecting, setIntersecting] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Update our state when observer callback fires
          setIntersecting(entry.isIntersecting);
        },
        {
          rootMargin,
        }
      );
      if (ref.current) {
        observer.observe(ref.current);
      }
      return () => {
        if (ref.current) {
          observer.unobserve(ref.current as any);
        }
      };
    }, []);
  
    return [ref, isIntersecting];
  }

export default useOnScreen;
