import NextLink from 'next/link';
import {
  Box,
  Flex,
  Link as ChakraLink,
  Icon,
  IconButton,
  useColorMode,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  Avatar,
  HStack
} from '@chakra-ui/react';
import { GoRocket } from 'react-icons/go';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useAuth0 } from '@auth0/auth0-react';

export const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

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
        <NextLink href="/" passHref>
          <ChakraLink fontSize="xl">
            <Icon as={GoRocket} />
          </ChakraLink>
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
                    <MenuGroup title="Profile">
                      <MenuItem>
                        <NextLink href="/profile" passHref>
                          <a>Profile</a>
                        </NextLink>
                      </MenuItem>
                      <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>
                        Sign Out
                      </MenuItem>
                    </MenuGroup>
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
