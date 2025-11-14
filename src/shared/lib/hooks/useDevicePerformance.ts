import { useMemo } from 'react';

export interface IDevicePerformance {
  isLowEnd: boolean;
  overscan: number;
  shouldReduceAnimations: boolean;
}

export const useDevicePerformance = (): IDevicePerformance => {
  return useMemo(() => {
    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    const isLowEnd = (isMobile && cores <= 4) || cores <= 2;

    return {
      isLowEnd,
      overscan: isLowEnd ? 2 : 5,
      shouldReduceAnimations: isLowEnd,
    };
  }, []);
};
