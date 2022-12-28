import type { FC } from 'react';
import type { Step } from '@lib/sanity.schema';

import { MenuAlt2Icon } from '@heroicons/react/outline';

interface StepsProps {
  steps?: Step[];
}

interface StepItemProps {
  title?: string;
  order?: number;
}

const Steps: FC<StepsProps> = ({ steps }) => {
  return steps ? (
    <>
      <div className='flex items-center space-x-2'>
        <MenuAlt2Icon className='flex-none w-4 h-4 text-gray-500' />
        <h3 className='text-lg font-light text-gray-800'>Postup</h3>
      </div>
      <ul className='space-y-2 md:space-y-4'>
        {steps?.map((step, i) => (
          <StepItem key={step.title} order={i + 1} {...step} />
        ))}
      </ul>
    </>
  ) : null;
};

const StepItem: FC<StepItemProps> = ({ title, order = 1 }) => {
  return (
    <li className='flex space-x-4'>
      <div className='flex items-center justify-center bg-gray-300 rounded w-8'>
        <span className='text-gray-900'>{order}.</span>
      </div>
      <div className='flex-1 items-center justify-center bg-gray-100 rounded p-2'>
        <p className='text-gray-900 leading-relaxed text-justify'>
          {title?.trim()}
        </p>
      </div>
    </li>
  );
};

export default Steps;
