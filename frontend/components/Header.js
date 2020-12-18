import NextLink from 'next/link';
import {
  Box,
  Flex,
  Link,
  IconButton,
  useColorMode,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useAuth0 } from '@auth0/auth0-react';

export const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box as="header" w="full" borderBottom="1px" borderColor={borderColor}>
      <Flex w="full" justify="space-between" align="center" maxW="6xl" mx="auto" p={[2, 4]}>
        <NextLink href="/" passHref>
          <Link fontSize="lg" fontWeight="bold" letterSpacing="wide">
            MW_IT
          </Link>
        </NextLink>

        <HStack spacing={4}>
          <NextLink href="/projects" passHref>
            <Button as="a" variant="link" size="sm" colorScheme="blue">
              Projects
            </Button>
          </NextLink>

          <NextLink href="/issues" passHref>
            <Button as="a" variant="link" size="sm" colorScheme="blue">
              Issues
            </Button>
          </NextLink>

          <Box>
            {isAuthenticated ? (
              <>
                <Menu>
                  <Avatar as={MenuButton} size="sm" variant="ghost" />
                  <MenuList>
                    <NextLink href="/user" passHref>
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
              </>
            ) : (
              <Button colorScheme="blue" size="sm" onClick={() => loginWithRedirect()}>
                Sign In
              </Button>
            )}
          </Box>

          <IconButton
            size="sm"
            onClick={toggleColorMode}
            aria-label="Toggle theme"
            icon={colorMode === 'dark' ? <FiMoon /> : <FiSun />}
          />
        </HStack>
      </Flex>
    </Box>
  );
};
