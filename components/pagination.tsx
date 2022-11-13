import type { FC } from 'react';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { range, floor } from 'lodash';
import classNames from 'classnames';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

interface PaginationProps {
  page: number;
  pages: number;
  maxPages: number;
}

const Pagination: FC<PaginationProps> = ({ page, pages, maxPages }) => {
  const router = useRouter();

  const pagesArray = useMemo(() => {
    if (pages <= maxPages) return range(0, pages);
    const startPages = range(page - floor(maxPages / 2), page);
    const endPages = range(page + 1, page + 1 + floor(maxPages / 2));
    return [...startPages, page, ...endPages]
      .map((p, _, arr) => {
        if (p < 0) return arr.at(-1)! + (0 - p);
        else if (p >= pages) return arr.at(0)! - (p - pages + 1);
        else return p;
      })
      .sort();
  }, [page, pages, maxPages]);

  const validatePage = useCallback(
    (pageToVal: number) => {
      if (isNaN(pageToVal)) return false;
      if (pageToVal < 0 || pageToVal >= pages) return false;
      return true;
    },
    [pages]
  );

  const setPage = useCallback(
    (toPage) => {
      if (page === toPage || !validatePage(toPage)) return;
      router.push({
        query: {
          ...router.query,
          page: toPage,
        },
      });
    },
    [router, validatePage, page]
  );

  const onPageNumberClick = useCallback(
    (toPage) => {
      setPage(toPage);
    },
    [setPage]
  );

  const onPreviousPageClick = useCallback(() => {
    const prevPage = page - 1;
    setPage(prevPage);
  }, [page, setPage]);

  const onNextPageClick = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
  }, [page, setPage]);

  return (
    <div className='flex items-stretch justify-center'>
      <button
        onClick={onPreviousPageClick}
        disabled={!validatePage(page - 1)}
        className='
          bg-emerald-500
          text-white
          hover:bg-emerald-700
          active:bg-emerald-700
          font-bold
          uppercase
          text-xs
          px-4
          py-2
          rounded-l
          outline-none
          focus:outline-none
          ease-linear
          transition-all
          duration-150
          disabled:opacity-50
          disabled:cursor-not-allowed
        '
        type='button'
      >
        <ChevronLeftIcon className='w-4' />
      </button>
      {pagesArray.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={onPageNumberClick.bind(this, pageNumber)}
          className={classNames(
            { 'bg-emerald-500': page !== pageNumber },
            'bg-emerald-700',
            'text-white',
            'hover:bg-emerald-700',
            'active:bg-emerald-700',
            'font-bold',
            'uppercase',
            'text-xs',
            'px-4',
            'py-2',
            'outline-none',
            'focus:outline-none',
            'ease-linear',
            'transition-all',
            'duration-150'
          )}
          type='button'
        >
          {pageNumber + 1}
        </button>
      ))}
      <button
        onClick={onNextPageClick}
        disabled={!validatePage(page + 1)}
        className='
          bg-emerald-500
          text-white
          hover:bg-emerald-700
          active:bg-emerald-700
          font-bold
          uppercase
          text-xs
          px-4
          py-2
          rounded-r
          outline-none
          focus:outline-none
          ease-linear
          transition-all
          duration-150
          disabled:opacity-50
          disabled:cursor-not-allowed
        '
        type='button'
      >
        <ChevronRightIcon className='w-4' />
      </button>
    </div>
  );
};

export default Pagination;
