import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';

const NextButtonLink = ({ href, children, ...props }) => {
  return (
    <NextLink href={href} passHref>
      <Button as="a" variant="link" colorScheme="blue" {...props}>
        {children}
      </Button>
    </NextLink>
  );
};

NextButtonLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node
};

export { NextButtonLink };
