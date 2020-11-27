import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const styles = {
  table: {
    borderCollapse: 'collapse'
  }
};

const childrenPropTypes = {
  children: PropTypes.node
};

export const Table = ({ children, ...props }) => (
  <Box as="table" {...props} style={styles.table}>
    {children}
  </Box>
);

Table.propTypes = childrenPropTypes;

export const THead = ({ children, ...props }) => (
  <Box as="thead" {...props}>
    {children}
  </Box>
);

THead.propTypes = childrenPropTypes;

export const TBody = ({ children, ...props }) => (
  <Box as="tbody" {...props}>
    {children}
  </Box>
);

TBody.propTypes = childrenPropTypes;

export const TFoot = ({ children, ...props }) => (
  <Box as="tfoot" {...props}>
    {children}
  </Box>
);

TFoot.propTypes = childrenPropTypes;

export const Tr = ({ children, ...props }) => (
  <Box as="tr" {...props}>
    {children}
  </Box>
);

Tr.propTypes = childrenPropTypes;

export const Th = ({ children, ...props }) => (
  <Box as="th" {...props}>
    {children}
  </Box>
);

Th.propTypes = childrenPropTypes;

export const Td = ({ children, ...props }) => (
  <Box as="td" {...props}>
    {children}
  </Box>
);

Td.propTypes = childrenPropTypes;

export const Caption = ({ children, ...props }) => {
  return (
    <Box as="caption" {...props}>
      {children}
    </Box>
  );
};

Caption.propTypes = childrenPropTypes;
