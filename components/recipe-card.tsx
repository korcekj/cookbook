import type { FC } from 'react';
import type { Recipe, Category } from '@lib/sanity.schema';

import { memo } from 'react';
import { urlFor } from '@lib/sanity';
import { sum } from 'lodash';
import { humanizeMinutes } from '@lib/moment';

import { UsersIcon } from '@heroicons/react/solid';
import { ClockIcon } from '@heroicons/react/outline';

import Image from 'next/image';
import Link from 'next/link';

type Undefinable<T> = T | undefined;

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeItem: FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div
      className='
        flex
        flex-col
        shadow
        hover:shadow-md
        rounded-md
        overflow-hidden
        w-full
        h-full
      '
    >
      {!!recipe.image?.asset && (
        <Link href={`/recipes/${recipe.slug?.current}`}>
          <a>
            <div className='relative w-full h-52'>
              <span
                className='
                  absolute
                  top-4
                  left-4
                  z-10
                  flex
                  items-center
                  gap-x-2
                  text-xs
                  px-2
                  font-medium
                  bg-gray-900/50
                  text-white
                  rounded
                  py-1
                '
              >
                <ClockIcon className='w-5 h-5 text-white' />
                <span className='whitespace-nowrap'>
                  {humanizeMinutes(sum([recipe.preparation, recipe.cook]))}
                </span>
              </span>
              <Image
                className='hover:scale-105 transition-transform duration-150'
                src={urlFor(recipe.image.asset).url()!}
                alt={recipe.title}
                layout='fill'
                objectFit='cover'
                placeholder='blur'
                blurDataURL={
                  urlFor(recipe.image.asset).quality(10).blur(50).url()!
                }
              />
            </div>
          </a>
        </Link>
      )}
      <div className='flex-1 p-4'>
        <div className='flex flex-col justify-between h-full'>
          <div className='mb-2'>
            <div className='flex space-x-3 pb-2'>
              <div
                className='
                  flex
                  items-center
                  space-x-2
                  text-xs
                  px-2
                  font-medium
                  bg-emerald-900/80
                  text-white
                  rounded
                  py-0.5
                '
              >
                <UsersIcon className='w-4 h-4' />
                <span>{recipe.portion}</span>
              </div>
              <span
                className='
                  text-xs
                  px-2
                  font-medium
                  bg-emerald-400/10
                  text-emerald-900
                  rounded
                  py-0.5
                '
              >
                {(recipe.category as Undefinable<Category>)?.title}
              </span>
            </div>
            <h2 className='line-clamp-2 text-xl font-semibold mb-2 text-gray-900'>
              {recipe.title}
            </h2>
            <p className='line-clamp-3 leading-relaxed text-base font-light mb-2 text-gray-700 text-justify'>
              {recipe.description}
            </p>
          </div>
          <Link href={`/recipes/${recipe.slug?.current}`}>
            <a className='inline-block'>
              <button
                className='
                  bg-emerald-900
                  text-white
                  hover:bg-emerald-700
                  font-bold
                  uppercase
                  text-xs
                  px-4
                  py-2
                  rounded
                  outline-none
                  focus:outline-none
                  transition-colors
                '
                type='button'
              >
                Detaily receptu
              </button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(RecipeItem);
