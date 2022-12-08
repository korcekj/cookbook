import type { FC } from 'react';

import { useCallback } from 'react';
import classNames from 'classnames';

import {
  FacebookShareButton,
  PinterestShareButton,
  WhatsappShareButton,
} from 'next-share';

import { FacebookIcon } from 'next-share';
import { PinterestIcon } from 'next-share';
import { WhatsappIcon } from 'next-share';
import { PrinterIcon } from '@heroicons/react/outline';

interface RecipeSocialsProps {
  url: string;
  image: string;
  quote?: string;
  parentClassName?: string;
}

const RecipeSocials: FC<RecipeSocialsProps> = ({
  url,
  image,
  quote,
  parentClassName,
}) => {
  const onPrintClick = useCallback(() => {
    if (typeof window !== 'undefined') window.print();
  }, []);

  return (
    <div
      className={classNames(
        'flex',
        'items-center',
        'space-x-2',
        parentClassName
      )}
    >
      <FacebookShareButton url={url} quote={quote}>
        <FacebookIcon
          className='hover:scale-105 transition-transform duration-150'
          size={40}
          round
        />
      </FacebookShareButton>
      <WhatsappShareButton url={url} title={quote} separator=' '>
        <WhatsappIcon
          className='hover:scale-105 transition-transform duration-150'
          size={40}
          round
        />
      </WhatsappShareButton>
      <PinterestShareButton url={url} media={image} description={quote}>
        <PinterestIcon
          className='hover:scale-105 transition-transform duration-150'
          size={40}
          round
        />
      </PinterestShareButton>
      <a
        className='text-white bg-gray-900/70 rounded-full p-2 hover:scale-105 transition-transform duration-150 cursor-pointer'
        onClick={onPrintClick}
      >
        <PrinterIcon className='w-6 h-6' />
      </a>
    </div>
  );
};

export default RecipeSocials;
