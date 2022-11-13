import type { NextPage } from 'next';

import ImageHint from '@components/image-hint';

const Custom404: NextPage = () => {
  return (
    <ImageHint
      imgSrc='/images/undraw-page-not-found.svg'
      imgAlt='page not found'
      className='mt-4 py-2'
    >
      <span className='my-5 font-medium text-gray-700'>
        Stránku sa nepodarilo nájsť
      </span>
    </ImageHint>
  );
};

export default Custom404;
