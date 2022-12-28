import type { FC } from 'react';
import type { Section } from '@lib/sanity.schema';

import { useState, useCallback } from 'react';
import classNames from 'classnames';

import Link from 'next/link';
import Ingredients from '@components/ingredients';
import Steps from '@components/steps';

import { HashtagIcon } from '@heroicons/react/solid';
import { UsersIcon } from '@heroicons/react/solid';
import { CakeIcon } from '@heroicons/react/solid';

interface SectionsProps {
  sections?: Section[];
  servings?: { size?: number; type?: 'portions' | 'pieces' };
}

const Sections: FC<SectionsProps> = ({ sections, servings }) => {
  const [servingsSize, setServingsSize] = useState({
    prev: servings?.size || 0,
    next: servings?.size || 0,
  });

  const onValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setServingsSize((state) => ({ ...state, next: +value }));
    },
    []
  );

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-4 print:hidden'>
        <div className='flex items-center rounded bg-emerald-900/80 text-white'>
          <div className='ml-4 mr-2'>
            {servings?.type === 'portions' && <UsersIcon className='w-4 h-4' />}
            {servings?.type === 'pieces' && <CakeIcon className='w-4 h-4' />}
          </div>
          <input
            type='number'
            className='border-none bg-transparent focus:focus:ring-0 text-white p-2 rounded'
            min='1'
            max={servingsSize.prev * 2}
            step='1'
            value={servingsSize.next}
            onChange={onValueChange}
          />
        </div>
        <input
          type='range'
          className='w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer'
          min='1'
          max={servingsSize.prev * 2}
          step='1'
          value={servingsSize.next}
          onChange={onValueChange}
        ></input>
      </div>
      {!!sections
        ? sections.map(({ title, steps, ingredients }, i) => (
            <div
              className={classNames('flex', 'flex-col', 'space-y-4', {
                border: !!title,
                rounded: !!title,
                'border-gray-100': !!title,
                'p-2': !!title,
              })}
              key={title || i}
            >
              {title && (
                <Link href={`#section-${i + 1}`}>
                  <a id={`section-${i + 1}`} className='inline-block'>
                    <div className='flex items-center space-x-1'>
                      <HashtagIcon className='w-5 h-5 text-gray-500' />
                      <h2 className='text-2xl font-semibold text-gray-900'>
                        {title.trim()}
                      </h2>
                    </div>
                  </a>
                </Link>
              )}
              <Ingredients
                servingsSize={servingsSize}
                ingredients={ingredients}
              />
              <Steps steps={steps} />
            </div>
          ))
        : null}
    </div>
  );
};

export default Sections;
