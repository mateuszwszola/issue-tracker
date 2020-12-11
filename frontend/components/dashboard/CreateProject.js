import { useAccessToken } from '@/hooks/use-token';
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
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import useSWR, { mutate } from 'swr';
import { useState } from 'react';

const CreateProject = ({ onClose }) => {
  const { data: dataTypes, error: typesError } = useSWR('projects/type', fetcher);
  const { accessToken: token } = useAccessToken();
  const { data: dataUsers, error: usersError } = useSWR(
    token ? ['users', token] : null,
    (url, token) => fetcher(url, { token })
  );
  const toast = useToast();
  const inputBgColor = useColorModeValue('white', 'transparent');
  const { register, handleSubmit, errors } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectTypes = dataTypes?.types || null;
  const isLoadingProjectTypes = !typesError && !projectTypes;
  const users = dataUsers?.users || null;
  const isLoadingUsers = !usersError && !users;

  const onSubmit = (data) => {
    setIsSubmitting(true);

    fetcher('projects', { token, body: data })
      .then(() => {
        toast({
          title: 'Project created.',
          description: "We've created your project for you.",
          status: 'success',
          duration: 9000,
          isClosable: true
        });

        mutate(['projects']);
        onClose();
      })
      .catch((err) => {
        toast({
          title: 'An error occurred.',
          description: err.message || 'Unable to create a project',
          status: 'error',
          duration: 9000,
          isClosable: true
        });
        setIsSubmitting(false);
      });
  };

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

      <FormControl mt={3} id="type_id" isInvalid={errors.type_id}>
        <FormLabel>Type</FormLabel>
        <Select name="type_id" ref={register({ required: true })} bgColor={inputBgColor}>
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
                <option key={type.id} value={Number(type.id)}>
                  {type.name}
                </option>
              ))}
            </>
          )}
        </Select>
        {errors.type_id && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <FormControl mt={3} id="manager_id" isInvalid={errors.manager_id}>
        <FormLabel>Manager</FormLabel>
        <Select
          ref={register({ required: true })}
          name="manager_id"
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
                <option key={user.id} value={Number(user.id)}>
                  {user.name}
                </option>
              ))}
            </>
          )}
        </Select>
        {errors.manager_id && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <Button isLoading={isSubmitting} mt={8} w="full" type="submit" colorScheme="green">
        Submit
      </Button>
    </Box>
  );
};

CreateProject.propTypes = {
  onClose: PropTypes.func.isRequired
};

export const CreateProjectModal = ({ isOpen, onClose, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
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
