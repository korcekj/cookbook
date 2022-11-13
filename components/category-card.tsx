import type { FC } from 'react';
import type { Category } from '@lib/sanity.schema';

import { memo } from 'react';
import classNames from 'classnames';

import Link from 'next/link';

import { TagIcon } from '@heroicons/react/solid';

interface CategoryCardProps {
  category: Category & { recipesCount?: number };
}

const CategoryCard: FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link href={`/categories/${category.slug?.current}`}>
      <a
        className={classNames(
          'flex',
          'items-center',
          'gap-x-4',
          'w-full ',
          'h-full',
          'bg-emerald-400/10',
          'hover:bg-emerald-400/20',
          'transition-colors',
          'rounded-md',
          'shadow',
          'hover:shadow-md',
          'px-4',
          'py-3',
          { 'justify-center': category.recipesCount === undefined },
          { 'justify-between': category.recipesCount !== undefined }
        )}
      >
        <div className='flex items-center gap-x-2'>
          <TagIcon className='w-4 h-4 text-emerald-900' />
          <span className='text-lg font-semibold text-emerald-900 line-clamp-1'>
            {category.title}
          </span>
        </div>
        {category.recipesCount !== undefined && (
          <span className='text-xs font-bold px-2 py-1 bg-emerald-700 text-white rounded-full'>
            {category.recipesCount}
          </span>
        )}
      </a>
    </Link>
  );
};

export default memo(CategoryCard);
