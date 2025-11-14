import { useEffect, useRef, useState } from 'react';

interface UseOptimizedImageOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useOptimizedImage = (
  src: string | undefined,
  options: UseOptimizedImageOptions = {}
) => {
  const { threshold = 0.1, rootMargin = '50px' } = options;
  const [loaded, setLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current || !src) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src, rootMargin, threshold]);

  return {
    imgRef,
    loaded,
    shouldLoad,
    onLoad: () => setLoaded(true),
  };
};

export const generateImageSrcSet = (baseUrl: string | undefined): string => {
  if (!baseUrl) return '';

  const sizes = [150, 300, 600];
  return sizes.map((size) => `${baseUrl} ${size}w`).join(', ');
};

export const getOptimalImageSize = (containerWidth: number): string => {
  if (containerWidth <= 100) return '(max-width: 768px) 80px, 100px';
  if (containerWidth <= 200) return '(max-width: 768px) 150px, 200px';
  return '(max-width: 768px) 200px, 300px';
};
