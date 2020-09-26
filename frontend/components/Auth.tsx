import NextLink from 'next/link';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Link,
  useColorModeValue
} from '@chakra-ui/core';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

type Props = {
  signin: boolean;
};

export const Auth: React.FC<Props> = ({ signin }: Props) => {
  const boxBgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box
      w="full"
      maxW="md"
      px={[4, 6]}
      py={[6, 8]}
      rounded="lg"
      boxShadow="md"
      bg={boxBgColor}
    >
      <Heading textAlign="center">{signin ? 'Sign In' : 'Sign Up'}</Heading>

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
          {signin ? 'Sign In' : 'Sign Up'}
        </Button>
      </Box>

      <Stack mt={4} direction="column" spacing={2}>
        <NextLink href={signin ? '/signup' : '/signin'}>
          <Link color="teal.500">
            {signin
              ? 'Do not have an account? Sign Up now'
              : 'Already have an account? Sign In now'}
          </Link>
        </NextLink>

        <Link color="teal.500">Sign In as a Demo user</Link>
      </Stack>
    </Box>
  );
};