import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';

export function ActionButton({ children, ...props }) {
  return (
    <Button
      size="sm"
      fontSize="xs"
      textTransform="uppercase"
      rounded="full"
      fontWeight="bold"
      letterSpacing="wide"
      variant="outline"
      {...props}
    >
      {children}
    </Button>
  );
}

ActionButton.propTypes = {
  children: PropTypes.node
};
