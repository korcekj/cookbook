import type { FC } from 'react';
import type { Ingredient } from '@lib/sanity.schema';

import React, { useState, useCallback, useMemo } from 'react';
import { toFraction } from '@lib/utils';
import classNames from 'classnames';

import { CheckCircleIcon } from '@heroicons/react/outline';
import { UsersIcon } from '@heroicons/react/solid';
import { CakeIcon } from '@heroicons/react/solid';

interface IngredientsProps {
  servings?: { size?: number; type?: 'portions' | 'pieces' };
  ingredients?: Ingredient[];
}

interface IngredientItemProps {
  servingsSize: { prev: number; next: number };
  title?: string;
  quantity?: number;
  unit?: string;
}

const Ingredients: FC<IngredientsProps> = ({ servings, ingredients }) => {
  const servingsSize = servings?.size || 0;
  const [value, setValue] = useState(servingsSize);

  const onValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setValue(+value);
    },
    []
  );

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-4 print:hidden'>
        <div className='flex items-center rounded border bg-gray-100 border-gray-300'>
          {servings?.type === 'portions' && (
            <UsersIcon className='w-4 h-4 text-gray-700 mx-2' />
          )}
          {servings?.type === 'pieces' && (
            <CakeIcon className='w-4 h-4 text-gray-700 mx-2' />
          )}
          <input
            type='number'
            className='border-none p-1 bg-gray-100 text-gray-900 rounded'
            min='1'
            max={servingsSize * 2}
            step='1'
            value={value}
            onChange={onValueChange}
          />
        </div>
        <input
          type='range'
          className='w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer'
          min='1'
          max={servingsSize * 2}
          step='1'
          value={value}
          onChange={onValueChange}
        ></input>
      </div>
      <ul className='block space-y-2 md:space-y-0 md:grid md:gap-4 md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]'>
        {ingredients?.map((ingredient) => (
          <IngredientItem
            key={ingredient.title}
            servingsSize={{
              prev: servingsSize,
              next: value,
            }}
            {...ingredient}
          />
        ))}
      </ul>
    </div>
  );
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
        <span className='font-medium'>{title}</span>
        <span>
          ({toFraction(value)} {unit})
        </span>
      </div>
    </li>
  );
};

export default Ingredients;
