import Head from 'next/head';
import { Text, Heading, Box, Flex, Button, Image } from '@chakra-ui/core';
import NextLink from 'next/link';
import Layout, { projectName } from '@/components/Layout';

function Home(): JSX.Element {
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
          py={4}
          direction={{ base: 'column', lg: 'row-reverse' }}
          justify={{ base: 'center', lg: 'space-between' }}
          align="center"
        >
          <Box
            flexBasis={{ base: '100%', lg: '50%' }}
            maxW={{ base: 'md', lg: 'full' }}
            mx={{ base: 'auto', lg: 0 }}
            ml={{ lg: '1rem' }}
          >
            <Image maxW="full" src="/project_team.svg" />
          </Box>
          <Box
            flexBasis={{ base: '100%', lg: '50%' }}
            maxW={{ base: 'md', lg: 'full' }}
            mt={{ base: 4, lg: 0 }}
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

            <Box mt={[4, 6]}>
              <NextLink href="/login">
                <Button
                  as="a"
                  cursor="pointer"
                  colorScheme="green"
                  textTransform="uppercase"
                  fontWeight="bold"
                  fontSize="sm"
                  letterSpacing="wide"
                >
                  Let&apos;s get started
                </Button>
              </NextLink>
            </Box>
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

export default Home;
