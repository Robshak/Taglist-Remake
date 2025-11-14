import { useEffect, useState } from 'react';

export const useMobileDetect = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 1024px)').matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else
      mq.addListener(handler as unknown as (this: MediaQueryList, ev: MediaQueryListEvent) => void);
    setIsMobile(mq.matches);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else
        mq.removeListener(
          handler as unknown as (this: MediaQueryList, ev: MediaQueryListEvent) => void
        );
    };
  }, []);

  return isMobile;
};
