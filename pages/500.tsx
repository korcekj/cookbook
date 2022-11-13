import type { NextPage } from 'next';

import ImageHint from '@components/image-hint';

const Custom500: NextPage = () => {
  return (
    <ImageHint
      imgSrc='/images/undraw-server-down.svg'
      imgAlt='page not found'
      className='mt-4 py-2'
    >
      <span className='my-5 font-medium text-gray-700'>
        Došlo k neočakávanému problému
      </span>
    </ImageHint>
  );
};

export default Custom500;
