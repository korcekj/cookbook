import type { FC } from 'react';
import type { AppProps } from 'next/app';

import { ToastContainer } from 'react-toastify';
import Header from '@components/header';
import Breadcrumbs from '@components/breadcrumbs';

import 'react-toastify/dist/ReactToastify.min.css';
import '@styles/global.css';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Header />
      <main className='p-4'>
        <Breadcrumbs />
        <Component {...pageProps} />
      </main>
      <ToastContainer newestOnTop={true} draggable={true} limit={5} />
    </>
  );
};

export default App;
