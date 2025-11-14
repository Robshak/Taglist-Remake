import { useAnimationControls } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export const useMobileSwiper = (isMobile: boolean) => {
  const swiperControls = useAnimationControls();
  const detailsRef = useRef<HTMLDivElement>(null);
  const [detailsW, setDetailsW] = useState(0);

  useEffect(() => {
    if (!isMobile) return;
    const update = () => {
      const el = detailsRef.current;
      if (!el) return;
      const w = el.getBoundingClientRect().width;
      setDetailsW(w);
      swiperControls.set({ x: -w });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isMobile, swiperControls]);

  return {
    swiperControls,
    detailsRef,
    detailsW,
  };
};
