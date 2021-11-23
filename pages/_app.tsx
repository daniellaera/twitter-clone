import { createTheme, CssBaseline, ThemeProvider, useTheme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

export type PaletteMode = 'light' | 'dark';

export default function App({ Component, pageProps }) {
  const storage = typeof window !== 'undefined' ? localStorage.theme : 'light';
  const [storageTheme, setStorageTheme] = useState(storage);
  const colorTheme = storageTheme;

  useEffect(() => {
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

  // typeof window !== 'undefined' ? localStorage.theme : 'light';

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
