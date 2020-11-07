import NextLink from 'next/link';
import {
  Box,
  Flex,
  Link as ChakraLink,
  Icon,
  IconButton,
  useColorMode,
  Button,
  Link
} from '@chakra-ui/core';
import { GoRocket } from 'react-icons/go';
import { FiMoon, FiSun } from 'react-icons/fi';
import { projectName } from '../pages/index';
import { useFetchUser } from 'utils/user';

export const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { loading, user } = useFetchUser();

  return (
    <Box as="header" w="full">
      <Flex
        w="full"
        direction="row"
        justify="space-between"
        align="center"
        maxW="6xl"
        mx="auto"
        p={[2, 4]}
      >
        <Box>
          <NextLink href="/" passHref>
            <ChakraLink fontSize="xl" fontWeight="medium">
              <Icon as={GoRocket} mr={1} />
              {projectName}
            </ChakraLink>
          </NextLink>
        </Box>
        <Flex align="center">
          {!loading && user ? (
            <Button as={Link} href="/api/logout">
              Log Out
            </Button>
          ) : (
            <Button as={Link} href="/api/login">
              Log In
            </Button>
          )}

          <IconButton
            ml={4}
            onClick={toggleColorMode}
            aria-label="Toggle theme"
            icon={colorMode === 'dark' ? <FiMoon /> : <FiSun />}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
