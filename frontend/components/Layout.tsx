import { ReactNode, FunctionComponent } from 'react';
import { Flex, Box } from '@chakra-ui/core';

type Props = {
  children?: ReactNode;
};

const Layout: FunctionComponent = ({ children }: Props) => {
  return (
    <Flex
      minH="100vh"
      px={2}
      direction="column"
      justify="center"
      align="center"
    >
      <Flex
        as="main"
        py={20}
        flex={1}
        direction="column"
        justify="center"
        align="center"
      >
        {children}
      </Flex>

      <Box as="footer" py={2}>
        Issue Tracker
      </Box>
    </Flex>
  );
};

export default Layout;
