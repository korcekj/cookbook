import type { FC } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Search from '@components/search';

const Header: FC = () => {
  return (
    <>
      <Head>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#3f3d56' />
        <meta name='msapplication-TileColor' content='#11b981' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <header className='flex flex-col md:flex-row md:justify-between py-4 px-6 bg-gradient-to-r from-gray-300 to-emerald-500 rounded-b-lg'>
        <Link href='/'>
          <a className='flex items-center space-x-5'>
            <div className='w-12'>
              <Image
                src='/logo.svg'
                alt=''
                layout='responsive'
                width={50}
                height={50}
              />
            </div>
            <h1 className='text-3xl'>
              <span className='text-gray-700 font-bold'>Cook</span>
              <span className='text-gray-900 font-extrabold'>Book</span>
            </h1>
          </a>
        </Link>
        <Search
          searchId='header-search'
          placeholder='Hľadaj recept..'
          parentClassName='mt-5 md:m-0'
          inputClassName='
            w-full
            md:w-72 
            placeholder-emerald-700 
            text-emerald-900 
            bg-gray-100 
            border-transparent 
            focus:bg-gray-50 
            focus:ring-0 
            focus:border-emerald-600
            rounded
            border-2
          '
          iconClassName='w-6 h-6 text-white'
          labelClassName='hidden md:inline-block'
        />
      </header>
    </>
  );
};

export default Header;
