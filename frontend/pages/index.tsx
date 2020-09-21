import Head from 'next/head';
import { Text, Heading, Box, Flex, Button, Image } from '@chakra-ui/core';
import Layout, { projectName } from '@/components/Layout';

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Issue Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Flex
          as="section"
          w="full"
          flex={1}
          direction={{ base: 'column', lg: 'row' }}
          justify={{ base: 'center', lg: 'space-between' }}
          align="center"
        >
          <Box
            flexBasis={{ base: '100%', lg: '50%' }}
            maxW={['md', 'lg']}
            mx={{ base: 'auto', lg: 0 }}
          >
            <Heading as="h1" size="xl">
              Manage your project work
            </Heading>

            <Text fontSize={{ md: 'lg' }} color="gray.500" mt={2}>
              Welcome to {projectName}. The software for tracking and managing
              project work, to help you and your team in creating great products
              easier.
            </Text>

            <Button
              mt={4}
              colorScheme="green"
              textTransform="uppercase"
              fontWeight="bold"
              fontSize="sm"
            >
              Let&apos;s get started
            </Button>
          </Box>
          <Box
            flexBasis={{ base: '100%', lg: '50%' }}
            mt={{ base: 8, lg: 0 }}
            maxW={['md', 'lg']}
            mx={{ base: 'auto', lg: 0 }}
          >
            <Image maxW="full" src="/project_team.svg" />
          </Box>
          {/* 
        <Text>
          It helps to plan what needs to be done next. Create an issue (bug, the
          task, feature request), set the priority, assign people, manage
          deadlines and have everything displayed on the kanban board.
        </Text> */}
        </Flex>
      </Layout>
    </>
  );
}
