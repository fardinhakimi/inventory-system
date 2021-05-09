import { AppProps } from 'next/app'
import Head from 'next/head'
import { GlobalStyle } from '../styles/global'
function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>
      <GlobalStyle/>
      <Component {...pageProps} />
    </>
  )
}

export default App
