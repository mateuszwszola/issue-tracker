import Head from 'next/head';
import { Text } from '@chakra-ui/core';
import Layout from '@/components/Layout';

export default function Home(): JSX.Element {
  return (
    <Layout>
      <Head>
        <title>Issue Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Text as="h1" fontSize="3rem" textAlign="center">
        Welcome to Issue Tracker
      </Text>

      <Text as="p" color="gray.500" textAlign="center">
        Track your project work
      </Text>
    </Layout>
  );
}
