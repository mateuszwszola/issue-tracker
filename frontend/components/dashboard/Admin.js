import CreateProject, { CreateProjectModal } from '@/components/dashboard/admin/CreateProject';
import client from '@/utils/api-client';
import {
  Avatar,
  Button,
  Flex,
  Heading,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure
} from '@chakra-ui/react';
import { useApiUser } from 'contexts/api-user-context';
import { FaPlus } from 'react-icons/fa';
import useSWR from 'swr';

function AdminDashboard() {
  const {
    isOpen: isCreateProjectModalOpen,
    onOpen: openCreateProjectModal,
    onClose: closeCreateProjectModal
  } = useDisclosure();

  const { user } = useApiUser();

  const { data, error } = useSWR('projects', client);

  return (
    <Flex justify="space-between" wrap="wrap">
      <Flex wrap="wrap">
        <Avatar size="lg" name={user.name} src={user.picture} />
        <Heading ml={4} as="h2" fontSize="3xl" fontWeight="semibold">
          {user.name}
        </Heading>
      </Flex>

      <Button
        my={1}
        size="sm"
        colorScheme="blue"
        leftIcon={<FaPlus />}
        onClick={openCreateProjectModal}
      >
        Create project
      </Button>

      <CreateProjectModal isOpen={isCreateProjectModalOpen} onClose={closeCreateProjectModal}>
        <CreateProject onClose={closeCreateProjectModal} />
      </CreateProjectModal>

      <Table mt={4} variant="simple">
        <TableCaption>Projects</TableCaption>
        <Thead>
          <Tr>
            <Th>Key</Th>
            <Th>Name</Th>
            <Th>Lead</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.projects?.map((project) => (
            <Tr key={project.id}>
              <Td>{project.key}</Td>
              <Td>{project.name}</Td>
              <Td>{project.manager_id}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
}

export default AdminDashboard;
