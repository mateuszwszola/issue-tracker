import Head from 'next/head';
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack
} from '@chakra-ui/core';
import { Container } from '@/components/Container';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Main } from '@/components/Main';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

function Login(): JSX.Element {
  return (
    <>
      <Head>
        <title>Sign In | Issue Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Header />
        <Main>
          <Flex flex={1} justify="center" align="center">
            <Box w="full" maxW="md" px={[4, 6]} py={[6, 8]} rounded="lg">
              <Heading textAlign="center">Sign In</Heading>

              <Stack mt={8} direction="row" spacing={4}>
                <Button
                  w="full"
                  leftIcon={<AiFillGithub />}
                  colorScheme="gray"
                  variant="solid"
                >
                  GitHub
                </Button>
                <Button
                  w="full"
                  leftIcon={<FcGoogle />}
                  colorScheme="blue"
                  variant="outline"
                >
                  Google
                </Button>
              </Stack>

              <Box as="form" mt={6}>
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input type="email" />
                </FormControl>
                <FormControl mt={2} id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" />
                </FormControl>
                <Button w="full" mt={4} colorScheme="teal" type="submit">
                  Sign In
                </Button>
              </Box>
            </Box>
          </Flex>
        </Main>
        <Footer />
      </Container>
    </>
  );
}

export default Login;
