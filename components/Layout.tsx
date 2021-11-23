import Head from 'next/head';
import { Navbar } from './Navbar';

const Layout = ({ variation, onChildClick, children }) => {
  return (
    <>
      <Head>
        <title>Twitter Clone</title>
      </Head>
      <main id="app">
        <Navbar onChildClick={onChildClick} variation={variation} />
        {children}
      </main>
    </>
  );
};

export default Layout;
