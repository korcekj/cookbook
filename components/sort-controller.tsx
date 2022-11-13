import type { FC } from 'react';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { OrderKey, OrderDir } from '@lib/constants';

import { SwitchVerticalIcon } from '@heroicons/react/outline';
import { ArrowNarrowDownIcon } from '@heroicons/react/outline';
import { ArrowNarrowUpIcon } from '@heroicons/react/outline';
import { RefreshIcon } from '@heroicons/react/outline';

interface QueryParams {
  orderKey?: OrderKey;
  orderDir?: OrderDir;
}

interface SortControllerParams {
  controllers: {
    [key: string]: string;
  }[];
  route: (q: { [key: string]: string | number }) => void;
  reset: () => void;
}

const SortController: FC<SortControllerParams> = ({
  controllers,
  route,
  reset,
}) => {
  const { query }: { query: QueryParams } = useRouter();

  const sortItems = useMemo<{ [key: string]: string | null }>(() => {
    const orderKeys = query.orderKey?.split(',') || [];
    const orderDirs = query.orderDir?.split(',') || [];
    return orderKeys
      .filter((key) => !!key)
      .reduce(
        (reducer, key, i) => ({ ...reducer, [key]: orderDirs[i] || null }),
        {}
      );
  }, [query.orderKey, query.orderDir]);

  const onSortClick = useCallback(
    (key: string) => {
      let orderPairs = { ...sortItems };
      if (!orderPairs[key]) orderPairs = { ...orderPairs, [key]: OrderDir.ASC };
      else if (orderPairs[key] === OrderDir.ASC)
        orderPairs = { ...orderPairs, [key]: OrderDir.DESC };
      else if (orderPairs[key] === OrderDir.DESC) delete orderPairs[key];

      const orderKeys = Object.keys(orderPairs);
      const orderDirs = Object.values(orderPairs);
      route({
        orderKey: orderKeys.join(','),
        orderDir: orderDirs.join(','),
        page: 0,
      });
    },
    [sortItems, route]
  );

  const onResetClick = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className='bg-gray-200 text-gray-700 rounded'>
      <ul className='space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between py-3 px-4'>
        {controllers.map(({ key, title }) => (
          <li key={key}>
            <div
              onClick={() => onSortClick(key)}
              className='flex items-center p-1 space-x-1 rounded focus:bg-gray-300 hover:bg-gray-300 hover:cursor-pointer'
            >
              {!sortItems[key] && <SwitchVerticalIcon className='w-4 h-4' />}
              {sortItems[key] === OrderDir.ASC && (
                <ArrowNarrowDownIcon className='w-4 h-4' />
              )}
              {sortItems[key] === OrderDir.DESC && (
                <ArrowNarrowUpIcon className='w-4 h-4' />
              )}
              <span>{title}</span>
            </div>
          </li>
        ))}
        <li>
          <button
            onClick={onResetClick}
            type='button'
            className='
              flex
              w-full
              justify-center
              items-center
              space-x-1
              bg-gray-500
              text-white
              hover:bg-gray-600
              focus:bg-gray-600
              text-sm
              py-2
              px-3  
              rounded
              outline-none
              focus:outline-none
              transition-colors
            '
          >
            <RefreshIcon className='w-4 h-4 justi' />
            <span>Resetovať</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SortController;
