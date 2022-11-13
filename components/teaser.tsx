import type { FC, ReactNode } from 'react';

import classNames from 'classnames';

interface TeaserProps {
  title: string | ReactNode;
  description: string | ReactNode;
  reversed?: boolean;
}

const Teaser: FC<TeaserProps> = ({
  reversed,
  title,
  description,
  children,
}) => {
  return (
    <div
      className={classNames(
        'flex',
        'flex-col',
        'md:flex-row',
        'gap-y-6',
        'md:gap-x-6',
        'bg-gradient-to-r',
        'from-gray-100',
        'to-gray-300',
        'rounded-md',
        'p-6',
        { 'flex-col-reverse': reversed },
        { 'md:flex-row-reverse': reversed }
      )}
    >
      <div className='flex-1 md:self-center'>
        <div className='flex flex-col gap-y-2'>
          <h2 className='line-clamp-2 text-xl font-semibold text-gray-900 text-center'>
            {title}
          </h2>
          <p className='leading-relaxed text-base font-light text-gray-700 text-justify'>
            {description}
          </p>
        </div>
      </div>
      <div className='flex-none border-b md:border-r border-gray-500/50'></div>
      <div className='flex-1 md:self-center'>{children}</div>
    </div>
  );
};

Teaser.defaultProps = {
  reversed: false,
};

export default Teaser;
