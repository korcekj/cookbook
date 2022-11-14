import type { FC, FormEvent } from 'react';

import { useRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import { SearchIcon } from '@heroicons/react/solid';

interface SearchProps {
  searchId: string;
  placeholder: string;
  inputClassName?: string;
  iconClassName?: string;
  parentClassName?: string;
  labelClassName?: string;
}

const Search: FC<SearchProps> = ({
  searchId,
  placeholder,
  inputClassName,
  iconClassName,
  labelClassName,
  parentClassName,
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = inputRef.current?.value;

    if (!q || !q.trim()) return;
    inputRef.current.value = '';

    router.push({
      pathname: '/search',
      query: {
        q,
      },
    });
  };

  return (
    <form onSubmit={onSearch}>
      <div className={classNames('flex', 'items-center', parentClassName)}>
        <label
          htmlFor={searchId}
          className={classNames('mr-3', labelClassName)}
        >
          <SearchIcon className={classNames(iconClassName)} />
        </label>
        <input
          id={searchId}
          ref={inputRef}
          type='text'
          placeholder={placeholder}
          className={classNames(
            'w-full',
            'rounded',
            'border-2',
            inputClassName
          )}
        />
      </div>
    </form>
  );
};

export default Search;
