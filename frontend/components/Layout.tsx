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

export const projectName = 'TheIssueTracker';

type Props = {
  children?: React.ReactNode;
};

const Layout: React.FC = ({ children }: Props) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex minH="100vh" direction="column">
      <Box as="header" w="full">
        <Flex
          w="full"
          direction="row"
          justify="space-between"
          align="center"
          maxW="6xl"
          mx="auto"
          px={[2, 4]}
          py={4}
        >
          <Flex align="center" fontSize="xl" fontWeight="medium">
            <Icon as={GoRocket} />
            <Text ml={1}>{projectName}</Text>
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

      <Flex
        as="main"
        flex={1}
        direction="column"
        w="full"
        maxW="6xl"
        mx="auto"
        px={[2, 4]}
        py={4}
      >
        {children}
      </Flex>

      <Box as="footer" w="full">
        <Box w="full" px={[2, 4]} py={2} maxW="6xl" mx="auto">
          <Text align="center" color="gray.500">
            &copy;{projectName}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Layout;
