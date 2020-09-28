import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/core';

export const TableLink = ({ children, href, ...props }) => (
  <NextLink href={href} passHref>
    <Button
      {...props}
      as="a"
      variant="link"
      d="flex"
      justifyContent="flex-start"
      alignItems="center"
      minH="50px"
      p={2}
      colorScheme="blue"
      fontWeight="normal"
      fontSize={['sm', 'md']}
    >
      {children}
    </Button>
  </NextLink>
);

TableLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired
};
