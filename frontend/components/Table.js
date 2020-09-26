import { Box } from '@chakra-ui/core';
import PropTypes from 'prop-types';

export const Table = ({ children, ...props }) => (
  <Box as="table" {...props}>
    {children}
  </Box>
);

Table.propTypes = {
  children: PropTypes.node.isRequired
};

export const THead = ({ children, ...props }) => (
  <Box as="thead" {...props}>
    {children}
  </Box>
);

THead.propTypes = {
  children: PropTypes.node.isRequired
};

export const TBody = ({ children, ...props }) => (
  <Box as="tbody" {...props}>
    {children}
  </Box>
);

TBody.propTypes = {
  children: PropTypes.node.isRequired
};

export const Tr = ({ children, ...props }) => (
  <Box as="tr" {...props}>
    {children}
  </Box>
);

Tr.propTypes = {
  children: PropTypes.node.isRequired
};

export const Th = ({ children, ...props }) => (
  <Box as="th" {...props}>
    {children}
  </Box>
);

Th.propTypes = {
  children: PropTypes.node.isRequired
};

export const Td = ({ children, ...props }) => (
  <Box as="td" {...props}>
    {children}
  </Box>
);

Td.propTypes = {
  children: PropTypes.node.isRequired
};
