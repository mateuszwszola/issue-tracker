import { Box, Text } from '@chakra-ui/react';

function Attachments({ ...chakraProps }) {
  return (
    <Box {...chakraProps}>
      <Text fontSize="sm" fontWeight="medium">
        Attachments 0
      </Text>
    </Box>
  );
}

export default Attachments;
