import type { FC } from 'react';
import type { Ingredient } from '@lib/sanity.schema';

import React, { useState, useMemo } from 'react';
import { toFraction } from '@lib/utils';
import classNames from 'classnames';

import { CheckCircleIcon } from '@heroicons/react/outline';
import { MenuAlt1Icon } from '@heroicons/react/outline';

interface IngredientsProps {
  servingsSize: { prev: number; next: number };
  ingredients?: Ingredient[];
}

interface IngredientItemProps {
  servingsSize: { prev: number; next: number };
  title?: string;
  quantity?: number;
  unit?: string;
}

const Ingredients: FC<IngredientsProps> = ({ servingsSize, ingredients }) => {
  return ingredients ? (
    <>
      <div className='flex items-center space-x-2'>
        <MenuAlt1Icon className='flex-none w-4 h-4 text-gray-500' />
        <h3 className='text-lg font-light text-gray-800'>Ingrediencie</h3>
      </div>
      <ul className='block space-y-2 md:space-y-0 md:grid md:gap-4 md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]'>
        {ingredients?.map((ingredient) => (
          <IngredientItem
            key={ingredient.title}
            servingsSize={servingsSize}
            {...ingredient}
          />
        ))}
      </ul>
    </>
  ) : null;
};

const IngredientItem: FC<IngredientItemProps> = ({
  servingsSize,
  title,
  quantity = 0,
  unit,
}) => {
  const [checked, setChecked] = useState(false);

  const value = useMemo(() => {
    return (quantity * servingsSize.next) / servingsSize.prev;
  }, [quantity, servingsSize]);

  return (
    <li
      key={title}
      className={classNames(
        'flex',
        'items-center',
        'space-x-2',
        'p-2',
        'border',
        'border-gray-100',
        'rounded',
        'hover:bg-gray-100',
        'hover:cursor-pointer',
        {
          'bg-gray-100': checked,
        }
      )}
      onClick={() => setChecked((v) => !v)}
    >
      <CheckCircleIcon
        className={classNames('w-5', 'h-5', {
          'text-gray-900': checked,
          'text-gray-300': !checked,
        })}
      />
      <div className='text-base font-light text-gray-900 space-x-1 overflow-x-auto'>
        <span className='font-medium'>{title?.trim()}</span>
        <span>
          ({toFraction(value)} {unit?.trim()})
        </span>
      </div>
    </li>
  );
};

export default Ingredients;
