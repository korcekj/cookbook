import { FC } from 'react';

const CategoryCardSkeleton: FC = () => {
  return (
    <div className='flex items-center shadow p-4 space-x-2 rounded-md overflow-hidden w-full h-full'>
      <div className='animate-pulse bg-emerald-300 rounded w-8 h-6'></div>
      <div className='animate-pulse bg-emerald-300 rounded w-32 h-6'></div>
    </div>
  );
};

export default CategoryCardSkeleton;
