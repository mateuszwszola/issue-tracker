import NextLink from 'next/link';
import { Box, Flex, Link, Icon, IconButton, useColorMode } from '@chakra-ui/core';
import { GoRocket } from 'react-icons/go';
import { FiMoon, FiSun } from 'react-icons/fi';
import { projectName } from '../pages/index';

export const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box as="header" w="full">
      <Flex w="full" direction="row" justify="space-between" align="center" maxW="6xl" mx="auto" p={[2, 4]}>
        <Box>
          <NextLink href="/">
            <Link fontSize="xl" fontWeight="medium" textDecoration="none">
              <Icon as={GoRocket} mr={1} />
              {projectName}
            </Link>
          </NextLink>
        </Box>
        <Flex align="center">
          <NextLink href="/signin">
            <Link>Sign In</Link>
          </NextLink>

          <IconButton
            ml={4}
            size="sm"
            onClick={toggleColorMode}
            aria-label="Toggle theme"
            icon={colorMode === 'dark' ? <FiMoon /> : <FiSun />}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
