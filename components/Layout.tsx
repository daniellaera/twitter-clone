import Head from 'next/head';
import { Navbar } from './Navbar';

interface LayoutProps {
  variation?: string | undefined;
  onChildClick?: () => void;
  children: JSX.Element;
}

const Layout = ({ variation, onChildClick, children }: LayoutProps) => {
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
