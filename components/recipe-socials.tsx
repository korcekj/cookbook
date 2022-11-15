import type { FC } from 'react';

import { useCallback } from 'react';
import classNames from 'classnames';

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'next-share';

import { FacebookIcon } from 'next-share';
import { TwitterIcon } from 'next-share';
import { WhatsappIcon } from 'next-share';
import { PrinterIcon } from '@heroicons/react/outline';

interface RecipeSocialsProps {
  url: string;
  quote?: string;
  parentClassName?: string;
}

const RecipeSocials: FC<RecipeSocialsProps> = ({
  url,
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
        <FacebookIcon size={40} round />
      </FacebookShareButton>
      <WhatsappShareButton url={url} title={quote} separator=' '>
        <WhatsappIcon size={40} round />
      </WhatsappShareButton>
      <TwitterShareButton url={url} title={quote}>
        <TwitterIcon size={40} round />
      </TwitterShareButton>
      <a
        className='text-white bg-gray-900/50 rounded-full p-2 hover:bg-gray-900/70 hover:cursor-pointer'
        onClick={onPrintClick}
      >
        <PrinterIcon className='w-6 h-6' />
      </a>
    </div>
  );
};

export default RecipeSocials;
