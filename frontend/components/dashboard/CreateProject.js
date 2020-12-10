import { useSWRWithToken } from '@/hooks/use-swr-w-token';
import fetcher from '@/utils/api-client';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
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
  useColorModeValue
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

const CreateProject = () => {
  const { data: dataTypes, error: typesError } = useSWR('projects/type', fetcher);
  const { data: dataUsers, error: usersError } = useSWRWithToken('users');
  const { register, handleSubmit, errors } = useForm();

  const projectTypes = dataTypes?.types || null;
  const isLoadingProjectTypes = !typesError && !projectTypes;
  const users = dataUsers?.users || null;
  const isLoadingUsers = !usersError && !users;

  const onSubmit = (data) => {
    console.log({ data });
  };

  const inputBgColor = useColorModeValue('white', 'transparent');

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl id="name" isInvalid={errors.name}>
        <FormLabel>Name</FormLabel>
        <Input
          ref={register({ required: true })}
          name="name"
          bgColor={inputBgColor}
          placeholder="Enter a project name"
        />
        {errors.name && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <FormControl mt={3} id="description">
        <FormLabel>Description</FormLabel>
        <Input
          ref={register}
          name="description"
          bgColor={inputBgColor}
          placeholder="Enter a project description"
        />
      </FormControl>

      <FormControl mt={3} id="type" isInvalid={errors.type}>
        <FormLabel>Type</FormLabel>
        <Select name="type" ref={register({ required: true })} bgColor={inputBgColor}>
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
        {errors.type && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <FormControl mt={3} id="manager" isInvalid={errors.manager}>
        <FormLabel>Manager</FormLabel>
        <Select
          ref={register({ required: true })}
          name="manager"
          bgColor={inputBgColor}
          placeholder="Select a project manager"
        >
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
        {errors.manager && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <Button mt={8} w="full" type="submit" colorScheme="green">
        Submit
      </Button>
    </Box>
  );
};

export const CreateProjectModal = ({ isOpen, onClose, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />

      <ModalContent mx={2} px={2} py={6}>
        <ModalCloseButton />

        <ModalHeader>
          <Heading as="h3" textAlign="center" fontSize="2xl">
            Create a new project
          </Heading>
        </ModalHeader>

        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

CreateProjectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default CreateProject;
