import NextLink from 'next/link';
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiUser } from 'contexts/api-user-context';

export const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { loginWithRedirect, logout } = useAuth0();
  const { user } = useApiUser();

  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box as="header" w="full" borderBottom="1px" borderColor={borderColor}>
      <Flex
        w="full"
        justify="space-between"
        align="center"
        maxW="6xl"
        mx="auto"
        p={[2, 4]}
        wrap="wrap"
      >
        <Flex as="nav">
          <NextLink href="/" passHref>
            <Link fontSize="lg" fontWeight="bold" letterSpacing="wide">
              MWIT
            </Link>
          </NextLink>

          <NextLink href="/projects" passHref>
            <Button ml={6} as="a" variant="link" size="sm" colorScheme="blue">
              Projects
            </Button>
          </NextLink>

          <NextLink href="/issues" passHref>
            <Button ml={4} as="a" variant="link" size="sm" colorScheme="blue">
              Issues
            </Button>
          </NextLink>
        </Flex>

        <Box>
          {user ? (
            <Menu>
              <Avatar as={MenuButton} size="sm" variant="ghost" />
              <MenuList>
                <NextLink href={`/user/${user.id}`} passHref>
                  <MenuItem as="a">Profile</MenuItem>
                </NextLink>
                <NextLink href="/dashboard" passHref>
                  <MenuItem as="a">Dashboard</MenuItem>
                </NextLink>
                <NextLink href="/settings" passHref>
                  <MenuItem as="a">Settings</MenuItem>
                </NextLink>
                <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button colorScheme="blue" size="sm" onClick={() => loginWithRedirect()}>
              Sign In
            </Button>
          )}
          <IconButton
            ml={4}
            size="sm"
            onClick={toggleColorMode}
            aria-label="Toggle theme"
            icon={colorMode === 'dark' ? <FiMoon /> : <FiSun />}
          />
        </Box>
      </Flex>
    </Box>
  );
};
