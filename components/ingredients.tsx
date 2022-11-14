import type { FC } from 'react';
import type { Ingredient } from '@lib/sanity.schema';

import React, { useState, useCallback, useMemo } from 'react';
import { toFraction } from '@lib/utils';
import classNames from 'classnames';

import { CheckCircleIcon } from '@heroicons/react/outline';
import { UsersIcon } from '@heroicons/react/solid';

interface IngredientsProps {
  portion?: number;
  ingredients?: Ingredient[];
}

interface IngredientItemProps {
  portion: { prev: number; next: number };
  title?: string;
  quantity?: number;
  unit?: string;
}

const Ingredients: FC<IngredientsProps> = ({ portion = 0, ingredients }) => {
  const [value, setValue] = useState(portion);

  const onValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setValue(+value);
    },
    []
  );

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-4'>
        <div className='flex items-center rounded border bg-gray-100 border-gray-300'>
          <UsersIcon className='w-4 h-4 text-gray-700 mx-2' />
          <input
            type='number'
            className='border-none p-1 bg-gray-100 text-gray-900 rounded'
            min='1'
            max='20'
            step='1'
            value={value}
            onChange={onValueChange}
          />
        </div>
        <input
          type='range'
          className='w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer'
          min='1'
          max='20'
          step='1'
          value={value}
          onChange={onValueChange}
        ></input>
      </div>
      <ul className='block space-y-2 md:space-y-0 md:grid md:gap-4 md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]'>
        {ingredients?.map((ingredient) => (
          <IngredientItem
            key={ingredient.title}
            portion={{
              prev: portion,
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
  portion,
  title,
  quantity = 0,
  unit,
}) => {
  const [checked, setChecked] = useState(false);

  const value = useMemo(() => {
    return (quantity * portion.next) / portion.prev;
  }, [quantity, portion]);

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
      {checked ? (
        <CheckCircleIcon className='w-5 h-5 text-gray-900' />
      ) : (
        <CheckCircleIcon className='w-5 h-5 text-gray-300' />
      )}
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
