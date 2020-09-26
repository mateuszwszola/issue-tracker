import { Box } from '@chakra-ui/core';

export const Table: React.FC<{ children: React.ReactNode }> = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => (
  <Box as="table" {...props}>
    {children}
  </Box>
);

export const THead: React.FC<{ children: React.ReactNode }> = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => (
  <Box as="thead" {...props}>
    {children}
  </Box>
);

export const TBody: React.FC<{ children: React.ReactNode }> = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => (
  <Box as="tbody" {...props}>
    {children}
  </Box>
);

export const Tr: React.FC<{ children: React.ReactNode }> = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => (
  <Box as="tr" {...props}>
    {children}
  </Box>
);

export const Th: React.FC<{ children: React.ReactNode }> = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => (
  <Box as="th" {...props}>
    {children}
  </Box>
);

export const Td: React.FC<{ children: React.ReactNode }> = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => (
  <Box as="td" {...props}>
    {children}
  </Box>
);
