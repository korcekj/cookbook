import type { FC } from 'react';

import { useCallback } from 'react';
import { Router, useRouter } from 'next/router';
import { pick, pickBy, identity } from 'lodash';
import { RECIPES_CONTROLLERS, RECIPES_QUERY_KEYS } from '@lib/constants';

import SortController from '@components/sort-controller';

const RecipesSortController: FC = () => {
  const router = useRouter();

  const route = useCallback(
    (q: { [key: string]: string | number }) => {
      const query = pickBy({ ...router.query, ...q }, identity);
      router.push({
        pathname: router.pathname,
        query,
      });
    },
    [router]
  );

  const reset = useCallback(() => {
    const query = pick({ ...router.query }, RECIPES_QUERY_KEYS);
    const pathname = router.asPath.split('?')[0].split('#')[0];
    router.push({
      pathname,
      query,
    });
  }, [router]);

  return (
    <SortController
      controllers={RECIPES_CONTROLLERS}
      route={route}
      reset={reset}
    />
  );
};

export default RecipesSortController;
