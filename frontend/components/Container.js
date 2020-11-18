import PropTypes from 'prop-types';
import { Flex } from '@chakra-ui/react';

const overlayProps = {
  bgImage: `url('/shiny_overlay.svg')`,
  bgSize: 'cover',
  bgPos: 'center',
  bgRepeat: 'no-repeat',
  bgAttachment: 'fixed'
};

export const Container = ({ withOverlay, children, ...props }) => {
  return (
    <Flex minH="100vh" direction="column" {...props} {...(withOverlay ? overlayProps : null)}>
      {children}
    </Flex>
  );
};

Container.defaultProps = {
  withOverlay: false
};

Container.propTypes = {
  withOverlay: PropTypes.bool,
  children: PropTypes.node.isRequired
};
