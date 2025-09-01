import { useEffect, useState, RefObject } from 'react';

export const useScrollAnimation = (ref: RefObject<HTMLElement>, threshold = 0.001) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { 
        threshold,
        rootMargin: '300px' 
      }
    );

    const currentElement = ref.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [ref, threshold]);

  return isVisible;
};

export const useStaggeredScrollAnimation = (refs: RefObject<HTMLElement>[], threshold = 0.1, delay = 100) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observers = refs.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleItems(prev => new Set([...prev, index]));
            }, index * delay);
          }
        },
        { 
          threshold,
          rootMargin: '50px' 
        }
      );

      const currentElement = ref.current;
      if (currentElement) {
        observer.observe(currentElement);
      }

      return { observer, element: currentElement };
    });

    return () => {
      observers.forEach(({ observer, element }) => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [refs, threshold, delay]);

  return visibleItems;
};