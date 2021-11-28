import { createTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false
});

export type PaletteMode = 'light' | 'dark';

export default function App({ Component, pageProps }: any) {
  //const [loading, setLoading] = useState(false);
  const storage = typeof window !== 'undefined' ? localStorage.theme : 'light';
  const [storageTheme, setStorageTheme] = useState(storage);
  const colorTheme = storageTheme;

  // useEffect(() => {
  //   const jssStyles = document.querySelector('#jss-server-side');
  //   if (jssStyles) jssStyles.parentElement?.removeChild(jssStyles);

  //   const start = () => {
  //     console.log('start');
  //     NProgress.start();
  //     setLoading(true);
  //   };
  //   const end = () => {
  //     console.log('findished');
  //     NProgress.done();
  //     setLoading(false);
  //   };

  //   Router.events.on('routeChangeStart', start);
  //   Router.events.on('routeChangeComplete', end);
  //   Router.events.on('routeChangeError', end);
  //   return () => {
  //     Router.events.off('routeChangeStart', start);
  //     Router.events.off('routeChangeComplete', end);
  //     Router.events.off('routeChangeError', end);
  //   };
  // }, []);

  useEffect(() => {
    Router.events.on('routeChangeStart', () => NProgress.start());
    Router.events.on('routeChangeComplete', () => NProgress.done());
    Router.events.on('routeChangeError', () => NProgress.done());

    const root = window.document.documentElement;

    root.classList.remove(colorTheme);
    root.classList.add(storageTheme);
    localStorage.setItem('theme', storageTheme);
    //console.log('theme', storageTheme);
  }, [storageTheme, colorTheme]);

  const [theme, setTheme] = useState({
    palette: {
      type: storageTheme
    }
  });

  const toggleDarkTheme = () => {
    let newPaletteType = theme.palette.type === 'dark' ? 'light' : 'dark';
    setTheme({
      palette: {
        type: newPaletteType as PaletteMode
      }
    });
    setStorageTheme(newPaletteType);
  };

  const muiTheme = createTheme(theme);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Layout onChildClick={toggleDarkTheme} variation={theme.palette.type}>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

// export function reportWebVitals(metric: NextWebVitalsMetric) {
//   console.log(metric);
// }
