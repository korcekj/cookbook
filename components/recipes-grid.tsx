import type { FC } from 'react';

const RecipesGrid: FC = ({ children }) => {
  return (
    <div className='py-4 grid gap-4 xl:gap-6 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]'>
      {children}
    </div>
  );
};

export default RecipesGrid;
