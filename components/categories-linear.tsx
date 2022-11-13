import type { FC } from 'react';

import { Children } from 'react';

import LinearLayout from '@components/linear-layout';

import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/outline';

const CategoriesLinear: FC = ({ children }) => {
  return (
    <LinearLayout
      parentClassName='relative md:mx-6'
      containerClassName='flex overflow-x-auto py-4 no-scrollbar snap-x gap-x-4'
      leftArrow={({ ...props }) => (
        <button
          className='
            absolute
            font-bold
            top-1/2
            -translate-y-1/2
            -left-4
            bg-emerald-700
            text-white
            rounded-full
            p-2
            z-10
            hidden
            md:inline-block
            transition-colors
            border-2
            border-white
            hover:bg-emerald-900
            disabled:hidden
          '
          type='button'
          {...props}
        >
          <ChevronLeftIcon className='w-4 h-4' />
        </button>
      )}
      rightArrow={({ ...props }) => (
        <button
          className='
            absolute
            font-bold
            top-1/2
            -translate-y-1/2
            -right-4
            bg-emerald-700
            text-white
            rounded-full
            p-2
            z-10
            hidden
            md:inline-block
            border-2
            transition-colors
            border-white
            hover:bg-emerald-900
            disabled:hidden
          '
          type='button'
          {...props}
        >
          <ChevronRightIcon className='w-4 h-4' />
        </button>
      )}
    >
      {Children.map(children, (child) => (
        <li
          className='
            snap-start
            shrink-0
            max-w-lg
            w-[60%]
            sm:w-[55%]
            md:w-[calc(33.33%-0.66rem)]
            lg:w-[calc(25%-0.75rem)]
            xl:w-[calc(20%-0.8rem)]
          '
        >
          {child}
        </li>
      ))}
    </LinearLayout>
  );
};

export default CategoriesLinear;
