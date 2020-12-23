import { Avatar, Flex, Heading } from '@chakra-ui/react';
import { useApiUser } from 'contexts/api-user-context';
import CreateProject from '@/components/dashboard/admin/CreateProject';
import Nav from '@/components/dashboard/Nav';

function AdminDashboard() {
  const { user } = useApiUser();
  // const { isLoading, users, error } = useUsers();

  return (
    <>
      <Nav />
      <Flex justify="space-between" wrap="wrap">
        <Flex wrap="wrap">
          <Avatar size="lg" name={user.name} src={user.picture} />
          <Heading ml={4} as="h2" fontSize="3xl" fontWeight="semibold">
            {user.name}
          </Heading>
        </Flex>

        <CreateProject />

        {/*<Table mt={4} variant="simple">*/}
        {/*  <TableCaption>Users</TableCaption>*/}
        {/*  <Thead>*/}
        {/*    <Tr>*/}
        {/*      <Th>Key</Th>*/}
        {/*      <Th>Name</Th>*/}
        {/*      <Th>Lead</Th>*/}
        {/*    </Tr>*/}
        {/*  </Thead>*/}
        {/*  <Tbody>*/}
        {/*    {data?.projects?.map((project) => (*/}
        {/*      <Tr key={project.id}>*/}
        {/*        <Td>{project.key}</Td>*/}
        {/*        <Td>{project.name}</Td>*/}
        {/*        <Td>{project.manager_id}</Td>*/}
        {/*      </Tr>*/}
        {/*    ))}*/}
        {/*  </Tbody>*/}
        {/*</Table>*/}
      </Flex>
    </>
  );
}

export default AdminDashboard;
