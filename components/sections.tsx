import type { FC } from 'react';
import type { Section } from '@lib/sanity.schema';

import classNames from 'classnames';

import Link from 'next/link';
import Ingredients from '@components/ingredients';
import Steps from '@components/steps';

import { HashtagIcon } from '@heroicons/react/solid';
import { MenuAlt1Icon } from '@heroicons/react/outline';
import { MenuAlt2Icon } from '@heroicons/react/outline';

interface SectionsProps {
  sections?: Section[];
  servings?: { size?: number; type?: 'portions' | 'pieces' };
}

const Sections: FC<SectionsProps> = ({ sections, servings }) => {
  return (
    <>
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
                        {title}
                      </h2>
                    </div>
                  </a>
                </Link>
              )}
              <div className='flex items-center space-x-2'>
                <MenuAlt1Icon className='flex-none w-4 h-4 text-gray-500' />
                <h3 className='text-lg font-light text-gray-800'>
                  Ingrediencie
                </h3>
              </div>
              <Ingredients servings={servings} ingredients={ingredients} />
              <div className='flex items-center space-x-2'>
                <MenuAlt2Icon className='flex-none w-4 h-4 text-gray-500' />
                <h3 className='text-lg font-light text-gray-800'>Postup</h3>
              </div>
              <Steps steps={steps} />
            </div>
          ))
        : null}
    </>
  );
};

export default Sections;
