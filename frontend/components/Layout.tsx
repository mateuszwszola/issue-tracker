import { ReactNode, FC } from 'react';
import {
  Flex,
  Box,
  Text,
  Icon,
  IconButton,
  useColorMode
} from '@chakra-ui/core';
import { GoRocket } from 'react-icons/go';
import { FiSun, FiMoon } from 'react-icons/fi';

type Props = {
  children?: ReactNode;
};

export const projectName = 'TheIssueTracker';

const Layout: FC = ({ children }: Props) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex minH="100vh" direction="column">
      <Box as="header" w="full" px={2} py={4}>
        <Flex
          w="full"
          maxW={1280}
          mx="auto"
          direction="row"
          justify="space-between"
          align="center"
        >
          <Flex fontSize="xl" fontWeight="medium" align="center">
            <Icon as={GoRocket} mr={1} />
            <Text>{projectName}</Text>
          </Flex>
          <Box>
            <IconButton
              onClick={toggleColorMode}
              aria-label="Toggle theme"
              icon={colorMode === 'dark' ? <FiMoon /> : <FiSun />}
            />
          </Box>
        </Flex>
      </Box>

      <Box as="main" px={2} flex={1}>
        {children}
      </Box>

      <Box as="footer" py={2} w="full">
        <Text align="center">{projectName}</Text>
      </Box>
    </Flex>
  );
};

export default Layout;
