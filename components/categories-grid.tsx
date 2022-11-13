import type { FC } from 'react';

const CategoriesGrid: FC = ({ children }) => {
  return (
    <div className='py-4 grid gap-4 xl:gap-6 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]'>
      {children}
    </div>
  );
};

export default CategoriesGrid;
