import type { FC } from 'react';

import classNames from 'classnames';

interface SpinnerProps {
  className?: string;
}

const Spinner: FC<SpinnerProps> = ({ className }) => {
  return (
    <div
      className={classNames(
        'animate-spin',
        'inline-block',
        'border-current',
        'border-t-transparent',
        'rounded-full',
        className
      )}
    >
      <span className='sr-only'>Loading...</span>
    </div>
  );
};

export default Spinner;
