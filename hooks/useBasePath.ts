import { useMemo } from 'react';

const useBasePath = () => {
  const basePath = useMemo(() => {
    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : '';

    return origin;
  }, []);

  return basePath;
};

export default useBasePath;
