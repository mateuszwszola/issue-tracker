import PropTypes from 'prop-types';
import { Text } from '@chakra-ui/react';

function DisplayError({ message, ...chakraProps }) {
  return <Text {...chakraProps}>{message}</Text>;
}

DisplayError.propTypes = {
  message: PropTypes.string.isRequired
};

export default DisplayError;
