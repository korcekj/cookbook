import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { ceil } from 'lodash';

interface QueryParams {
  page?: string;
}

const usePagination = (count: number = 0, limit: number = 0) => {
  const { query }: { query: QueryParams } = useRouter();

  const page = useMemo(() => {
    const page = query.page ? parseInt(query.page) : 0;
    return page;
  }, [query.page]);

  const pages = useMemo(() => ceil(count / limit), [count, limit]);

  return { page, pages };
};

export default usePagination;
