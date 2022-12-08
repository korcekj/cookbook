import type { FC } from 'react';
import type { Section } from '@lib/sanity.schema';

import classNames from 'classnames';

import Steps from '@components/steps';

import { MenuAlt2Icon } from '@heroicons/react/outline';

interface SectionsProps {
  sections?: Section[];
}

const Sections: FC<SectionsProps> = ({ sections }) => {
  return (
    <>
      {!!sections
        ? sections.map(({ title, steps }, i) => (
            <div
              className={classNames('flex', 'flex-col', 'space-y-2', {
                border: !!title,
                rounded: !!title,
                'border-gray-100': !!title,
                'p-2': !!title,
              })}
              key={title || i}
            >
              {title && (
                <div className='flex items-center space-x-2'>
                  <MenuAlt2Icon className='w-4 h-4' />
                  <h3 className='text-lg font-semibold text-gray-800'>
                    {title}
                  </h3>
                </div>
              )}
              <Steps steps={steps} />
            </div>
          ))
        : null}
    </>
  );
};

export default Sections;
