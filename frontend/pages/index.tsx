import Head from 'next/head';
import { Text, Heading, Box, Button } from '@chakra-ui/core';
import Layout, { projectName } from '@/components/Layout';

export default function Home(): JSX.Element {
  return (
    <Layout>
      <Head>
        <title>Issue Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box mt="10%" py={8} maxW="500px" mx="auto">
        <Heading as="h1" size="xl">
          Manage your project work
        </Heading>

        <Text color="gray.500" mt={2}>
          Welcome to {projectName}. The software for tracking and managing
          project work, to help you and your team in creating great products
          easier.
        </Text>

        <Button mt={4} colorScheme="green" size="lg">
          Let&apos;s get started
        </Button>
      </Box>
      {/* 
      <Text>
        It helps to plan what needs to be done next. Create an issue (bug, the
        task, feature request), set the priority, assign people, manage
        deadlines and have everything displayed on the kanban board.
      </Text> */}
    </Layout>
  );
}
