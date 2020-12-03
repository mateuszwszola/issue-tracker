import PropTypes from 'prop-types';
import Head from 'next/head';
import { Container } from '@/components/Container';
import { Main } from '@/components/Main';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const Layout = ({ title, withOverlay, children }) => {
  return (
    <>
      <Head>
        <title>{title ? `${title} | ` : ''}MW_Issue_Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container withOverlay={withOverlay}>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </Container>
    </>
  );
};

Layout.defaultProps = {
  title: '',
  withOverlay: false
};

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  withOverlay: PropTypes.bool,
  children: PropTypes.node
};
