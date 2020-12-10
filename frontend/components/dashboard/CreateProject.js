import { useSWRWithToken } from '@/hooks/use-swr-w-token';
import fetcher from '@/utils/api-client';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import useSWR from 'swr';

const CreateProjectForm = ({ ...props }) => {
  const { data: dataTypes, error: typesError } = useSWR('projects/type', fetcher);
  const { data: dataUsers, error: usersError } = useSWRWithToken('users');

  const projectTypes = dataTypes?.types || null;
  const users = dataUsers?.users || null;
  const isLoadingUsers = !usersError && !users;
  const isLoadingProjectTypes = !typesError && !projectTypes;

  const inputBgColor = useColorModeValue('white', 'transparent');

  return (
    <Box as="form" {...props}>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input bgColor={inputBgColor} placeholder="Enter a project name" />
      </FormControl>

      <FormControl mt={3} id="description">
        <FormLabel>Description</FormLabel>
        <Input bgColor={inputBgColor} placeholder="Enter a project description" />
      </FormControl>

      <FormControl mt={3} id="type" isRequired>
        <FormLabel>Type</FormLabel>
        <Select bgColor={inputBgColor}>
          {typesError ? (
            <Text as="option" disabled>
              Unable to load types
            </Text>
          ) : isLoadingProjectTypes ? (
            <Text as="option" disabled>
              Loading types...
            </Text>
          ) : (
            <>
              {projectTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </>
          )}
        </Select>
      </FormControl>

      <FormControl mt={3} id="manager" isRequired>
        <FormLabel>Manager</FormLabel>
        <Select bgColor={inputBgColor}>
          {usersError ? (
            <Text as="option" disabled>
              Unable to load users
            </Text>
          ) : isLoadingUsers ? (
            <Text as="option" disabled>
              Loading users...
            </Text>
          ) : (
            <>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </>
          )}
        </Select>
      </FormControl>

      <Button mt={8} w="full" type="submit" colorScheme="green">
        Submit
      </Button>
    </Box>
  );
};

const CreateProjectModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />

      <ModalContent mx={2} px={2} py={6}>
        <ModalHeader>
          <Heading as="h3" textAlign="center" fontSize="2xl">
            Create a new project
          </Heading>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <CreateProjectForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

CreateProjectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export function useCreateProjectModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const CreateProjectModalComponent = ({ ...props }) => {
    return <CreateProjectModal isOpen={isOpen} onClose={onClose} {...props} />;
  };

  return {
    createProjectModal: CreateProjectModalComponent,
    onOpen
  };
}

export default CreateProjectForm;
