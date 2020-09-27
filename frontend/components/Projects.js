import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Heading, Box, Flex, Button, Link, Text, Avatar, AvatarGroup } from '@chakra-ui/core';
import { InputSearch } from '@/components/projects/InputSearch';
import { ButtonSort } from '@/components/projects/ButtonSort';
import { Table, THead, TBody, TFoot, Tr, Th, Td } from '@/components/Table';

const Caption = ({ children, ...props }) => {
  return (
    <Box as="caption" {...props}>
      {children}
    </Box>
  );
};

Caption.propTypes = {
  children: PropTypes.node.isRequired
};

export const Projects = ({ data }) => {
  return (
    <>
      <Flex direction="row" justify="space-between" align="center" wrap="wrap">
        <Heading size="lg">Projects</Heading>
        <Button size="sm" colorScheme="blue">
          Create project
        </Button>
      </Flex>

      <InputSearch />

      <Table mt={8} w="full" border="2px" borderColor="gray.200">
        <Caption mb={1}>
          <Text fontSize="sm" textAlign="left" textTransform="uppercase" letterSpacing="wide" fontWeight="medium">
            Number of projects ({data.length})
          </Text>
        </Caption>
        <THead borderBottom="2px" borderColor="gray.200" bg="gray.100">
          <Tr>
            {['Name', 'Key', 'Lead', 'People'].map((name) => (
              <Th px={2} py={1} key={name}>
                <Flex align="center">
                  <Text mr={2} fontSize={['xs', 'sm']} fontWeight="medium">
                    {name}
                  </Text>
                  <ButtonSort />
                </Flex>
              </Th>
            ))}
          </Tr>
        </THead>
        <TBody borderBottom="2px" borderColor="gray.200">
          {data &&
            data.map((project) => (
              <Tr key={project.id} fontSize={['sm', 'md']}>
                <Td px={2} py={[2, 4]}>
                  <NextLink href="#">
                    <Link>{project.name}</Link>
                  </NextLink>
                </Td>
                <Td px={2} py={[2, 4]}>
                  {project.key}
                </Td>
                <Td px={2} py={[2, 4]}>
                  <Flex align="center">
                    <Avatar bg="red.500" size="sm" />
                    <Text ml={2}>{project.lead}</Text>
                  </Flex>
                </Td>
                <Td px={2} py={[2, 4]}>
                  <AvatarGroup size="sm" max={2}>
                    <Avatar />
                    <Avatar />
                    <Avatar />
                    <Avatar />
                  </AvatarGroup>
                </Td>
              </Tr>
            ))}
        </TBody>
        <TFoot borderTop="2px" borderColor="gray.200">
          <Tr fontSize="sm">
            <Td p={2} colSpan="2">
              <Flex align="center">
                <Button size="sm" variant="link" colorScheme="blue">
                  Show more projects
                </Button>
              </Flex>
            </Td>
            <Td p={2} colSpan="2">
              <Text textAlign="right" color="gray.500" fontWeight="medium">
                {data.length} of {data.length}
              </Text>
            </Td>
          </Tr>
        </TFoot>
      </Table>
    </>
  );
};

Projects.defaultProps = {
  data: [
    {
      id: 1,
      key: 'PRO-1',
      name: 'Project #1',
      lead: 'John Doe',
      users: [
        {
          id: 1,
          name: 'User name',
          picture: 'picture'
        }
      ]
    },
    {
      id: 2,
      key: 'PRO-2',
      name: 'Project #2',
      lead: 'Janna Doe',
      users: [
        {
          id: 1,
          name: 'User name',
          picture: 'picture'
        }
      ]
    }
  ]
};

Projects.propTypes = {
  data: PropTypes.array.isRequired
};
