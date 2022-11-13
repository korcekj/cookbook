import { FC } from 'react';

const RecipeCardSkeleton: FC = () => {
  return (
    <div className='flex flex-col shadow rounded-md overflow-hidden w-full h-full'>
      <div className='animate-pulse w-full h-40 bg-emerald-300'></div>
      <div className='flex-1 p-4'>
        <div className='flex flex-col justify-evenly h-full'>
          <div className='flex gap-x-3 mb-2'>
            <span
              className='
                animate-pulse
                rounded
                w-12
                h-5
                bg-emerald-300
              '
            ></span>
            <span
              className='
                animate-pulse
                rounded
                w-12
                h-5
                bg-emerald-300
              '
            ></span>
          </div>
          <div className='animate-pulse bg-emerald-300 rounded w-full h-5 mb-2'></div>
          <div className='animate-pulse bg-emerald-300 rounded w-full h-12 mb-2'></div>
          <div className='animate-pulse bg-emerald-300 rounded w-24 h-7 mb-1'></div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCardSkeleton;
