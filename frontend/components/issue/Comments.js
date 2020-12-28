import { Box, Text, useColorModeValue } from '@chakra-ui/react';

function Comments({ ...chakraProps }) {
  const dividerColor = useColorModeValue('gray.200', 'gray.700');
  const secondaryColor = useColorModeValue('gray.500', 'gray.500');

  return (
    <Box borderTop="1px" borderColor={dividerColor} {...chakraProps}>
      <Text mt={2} textAlign="right" color={secondaryColor} fontSize="sm">
        Comments 0
      </Text>
    </Box>
  );
}

export default Comments;
