import { Flex } from '@chakra-ui/core';

type Props = {
  children: React.ReactNode;
};

export const Main: React.FC<Props> = ({ children }: Props) => {
  return (
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
  );
};
