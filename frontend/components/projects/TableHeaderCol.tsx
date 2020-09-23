import { Flex, Text } from '@chakra-ui/core';
import { SortButton } from '@/components/projects/SortButton';

export const TableHeaderCol: React.FC<{ name: string }> = ({
  name
}: {
  name: string;
}) => {
  return (
    <Flex flex="1" align="center">
      <Text mr={1} fontSize="sm" fontWeight="medium">
        {name}
      </Text>
      <SortButton />
    </Flex>
  );
};
