import Head from 'next/head';
import NextLink from 'next/link';
import {
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
  Button,
  useColorModeValue,
  Box,
  VStack,
  StackDivider,
  Link,
  Text
} from '@chakra-ui/core';
import { Container } from '@/components/Container';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Main } from '@/components/Main';
import { BsSearch } from 'react-icons/bs';

type User = {
  id: number;
  name: string;
  picture: string;
};

type Project = {
  id: number;
  name: string;
  lead: string;
  users: User[];
};

function Projects({ data }: { data: Project[] }): JSX.Element {
  const inputBgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <>
      <Head>
        <title>Welcome | Issue Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Header />
        <Main>
          <Flex
            direction="row"
            justify="space-between"
            align="center"
            wrap="wrap"
          >
            <Heading size="lg">Projects</Heading>
            <Button size="sm" colorScheme="blue">
              Create project
            </Button>
          </Flex>
          <Box mt={4} w="full" maxW="12rem">
            <InputGroup size="sm">
              <Input placeholder="Search..." bg={inputBgColor} />
              <InputRightElement>
                <Icon as={BsSearch} />
              </InputRightElement>
            </InputGroup>
          </Box>

          <VStack mt={8} divider={<StackDivider />} align="stretch">
            {data.map((project) => (
              <Flex key={project.id} p={2} h="40px">
                <Box flexBasis="50%">
                  <NextLink href="#">
                    <Link>{project.name}</Link>
                  </NextLink>
                </Box>
                <Box flexBasis="50%">
                  <Text>{project.lead}</Text>
                </Box>
              </Flex>
            ))}
          </VStack>
        </Main>
        <Footer />
      </Container>
    </>
  );
}

Projects.defaultProps = {
  data: [
    {
      id: 1,
      name: 'Project #1',
      lead: 'John Doe',
      users: [
        {
          id: 'user-1',
          name: 'User name',
          picture: 'picture'
        }
      ]
    },
    {
      id: 2,
      name: 'Project #2',
      lead: 'Janna Doe',
      users: [
        {
          id: 'user-2',
          name: 'User name',
          picture: 'picture'
        }
      ]
    }
  ]
};

export default Projects;
