import type { FC } from 'react';
import type { UrlObject } from 'url';

import classNames from 'classnames';

import Link from 'next/link';
import Image from 'next/image';

interface CardPlaceholderProps {
  to?: string | UrlObject;
  imgSrc?: string;
  imgAlt?: string;
  parentClassName?: string;
}

const CardPlaceholder: FC<CardPlaceholderProps> = ({
  to,
  imgSrc,
  imgAlt,
  parentClassName,
  children,
}) => {
  return to ? (
    <Link href={to}>
      <a className={classNames('group', parentClassName)}>
        <div className='relative w-full h-full rounded-md overflow-hidden'>
          {!!imgSrc && (
            <Image
              src={imgSrc}
              alt={imgAlt}
              layout='fill'
              objectFit='cover'
              className='group-hover:scale-105 duration-150 transition-transform'
            />
          )}
          <div className='absolute w-full h-full bg-gray-900/70 flex items-center justify-center'>
            {children}
          </div>
        </div>
      </a>
    </Link>
  ) : (
    <div className={classNames(parentClassName)}>
      <div className='relative w-full h-full group rounded-md overflow-hidden'>
        {!!imgSrc && (
          <Image
            src={imgSrc}
            alt={imgAlt}
            layout='fill'
            objectFit='cover'
            className='group-hover:scale-105 duration-150 transition-transform'
          />
        )}
        <div className='absolute w-full h-full bg-gray-900/70 flex items-center justify-center'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CardPlaceholder;
