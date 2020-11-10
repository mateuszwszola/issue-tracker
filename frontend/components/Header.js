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
  MenuDivider,
  MenuGroup,
  Avatar
} from '@chakra-ui/core';
import { GoRocket } from 'react-icons/go';
import { FiMoon, FiSun } from 'react-icons/fi';
import { projectName } from '../pages/index';
import { useAuth0 } from '@auth0/auth0-react';

export const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

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
          <NextLink href="/projects" passHref>
            <Button as="a" mr={4}>
              Projects
            </Button>
          </NextLink>

          {isAuthenticated ? (
            <>
              <Menu>
                <Avatar as={MenuButton} size="md" variant="ghost" />
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
            <Button onClick={() => loginWithRedirect()}>Sign In</Button>
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
