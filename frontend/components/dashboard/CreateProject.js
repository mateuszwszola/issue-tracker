import PropTypes from 'prop-types';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Button,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  Heading
} from '@chakra-ui/react';
import useSWR from 'swr';
import fetcher from '@/utils/api-client';

const CreateProjectForm = ({ ...props }) => {
  const { data, error: typesError } = useSWR('projects/type', fetcher);

  const projectTypes = data?.types;

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
            <Text as="option" selected disabled>
              Something went wrong...
            </Text>
          ) : !projectTypes ? (
            <Text as="option" selected disabled>
              Loading...
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
