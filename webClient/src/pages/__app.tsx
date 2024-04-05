import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/dist/shared/lib/router/router';
import '../styles/global.scss';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <Head>
        <title>Todo</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;