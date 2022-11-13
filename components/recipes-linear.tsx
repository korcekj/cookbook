import type { FC } from 'react';

import { Children } from 'react';

import LinearLayout from '@components/linear-layout';

import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/outline';

const RecipesLinear: FC = ({ children }) => {
  return (
    <LinearLayout
      parentClassName='relative md:mx-6'
      containerClassName='flex overflow-x-auto no-scrollbar py-4 snap-x gap-x-4'
      leftArrow={({ ...props }) => (
        <button
          className='
            absolute
            font-bold
            top-1/2
            -left-6
            -translate-y-1/2
            bg-emerald-700
            text-white
            rounded-full
            p-3
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
          <ChevronLeftIcon className='w-6' />
        </button>
      )}
      rightArrow={({ ...props }) => (
        <button
          className='
            absolute
            font-bold
            top-1/2
            -right-6
            -translate-y-1/2
            bg-emerald-700
            text-white
            rounded-full
            p-3
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
          <ChevronRightIcon className='w-6' />
        </button>
      )}
    >
      {Children.map(children, (child) => (
        <li
          className='
            snap-start
            shrink-0
            max-w-lg
            w-[85%]
            sm:w-[55%]
            md:w-[calc(50%-0.5rem)]
            lg:w-[calc(33.33%-0.66rem)]
            xl:w-[calc(25%-0.75rem)]
          '
        >
          {child}
        </li>
      ))}
    </LinearLayout>
  );
};

export default RecipesLinear;
