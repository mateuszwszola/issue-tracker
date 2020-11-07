import PropTypes from 'prop-types';
import Head from 'next/head';
import { Container } from '@/components/Container';
import { Main } from '@/components/Main';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const Layout = ({ title, withOverlay, user, loading = false, children }) => {
  return (
    <>
      <Head>
        <title>{title ? `${title} | ` : ''}Issue Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container withOverlay={withOverlay}>
        <Header user={user} loading={loading} />
        <Main>{children}</Main>
        <Footer />
      </Container>
    </>
  );
};

Layout.defaultProps = {
  title: '',
  withOverlay: false,
  loading: false
};

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  withOverlay: PropTypes.bool,
  user: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  children: PropTypes.element
};
