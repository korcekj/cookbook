import type { FC } from 'react';

import classNames from 'classnames';

import Image from 'next/image';

interface ImageHintProps {
  imgSrc: string;
  imgAlt?: string;
  className?: string;
}

const ImageHint: FC<ImageHintProps> = ({
  children,
  className,
  imgSrc,
  imgAlt,
}) => {
  return (
    <div className={classNames('flex', 'flex-col', 'items-center', className)}>
      <div className='relative w-full h-52 md:h-72'>
        <Image src={imgSrc} alt={imgAlt} layout='fill' priority />
      </div>
      {children}
    </div>
  );
};

export default ImageHint;
