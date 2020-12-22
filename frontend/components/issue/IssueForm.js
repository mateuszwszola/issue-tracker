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
  useColorModeValue
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

const IssueForm = ({ onSubmit }) => {
  const { register, handleSubmit, errors } = useForm();

  const inputBgColor = useColorModeValue('white', 'transparent');

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl id="project" isInvalid={errors.project_id}>
        <FormLabel>Project</FormLabel>
        <Select name="project" ref={register({ required: true })} bgColor={inputBgColor}>
          <option>Select a project</option>
        </Select>
        {errors.project_id && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <FormControl id="name" isInvalid={errors.name}>
        <FormLabel>Name</FormLabel>
        <Input
          ref={register({ required: true })}
          name="name"
          bgColor={inputBgColor}
          placeholder="Enter a name"
        />
        {errors.name && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <FormControl mt={3} id="description">
        <FormLabel>Description</FormLabel>
        <Input
          ref={register}
          name="description"
          bgColor={inputBgColor}
          placeholder="Enter issue description"
        />
      </FormControl>

      <FormControl mt={3} id="type_id" isInvalid={errors.type_id}>
        <FormLabel>Type</FormLabel>
        <Select name="type_id" ref={register({ required: true })} bgColor={inputBgColor}>
          <option>Select issue type</option>
        </Select>
        {errors.type_id && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <FormControl mt={3} id="status_id" isInvalid={errors.status_id}>
        <FormLabel>Status</FormLabel>
        <Select name="status_id" ref={register({ required: true })} bgColor={inputBgColor}>
          <option>Select issue status</option>
        </Select>
        {errors.status_id && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <FormControl mt={3} id="priority_id" isInvalid={errors.priority_id}>
        <FormLabel>Priority</FormLabel>
        <Select
          ref={register({ required: true })}
          name="priority_id"
          bgColor={inputBgColor}
          placeholder="Select issue priority"
        >
          <option>Select priority</option>
        </Select>
        {errors.priority_id && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <FormControl mt={3} id="assignee_id" isInvalid={errors.assignee_id}>
        <FormLabel>Assignee</FormLabel>
        <Select
          ref={register({ required: true })}
          name="assignee_id"
          bgColor={inputBgColor}
          placeholder="Select a user"
        >
          <option>Select a user</option>
        </Select>
        {errors.assignee_id && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <Button isLoading={status === 'loading'} mt={8} w="full" type="submit" colorScheme="green">
        Submit
      </Button>
    </Box>
  );
};

IssueForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export const IssueFormModal = ({ isOpen, onClose, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />

      <ModalContent mx={2} px={2} py={6}>
        <ModalCloseButton />

        <ModalHeader>
          <Heading as="h3" textAlign="center" fontSize="2xl">
            Create new issue
          </Heading>
        </ModalHeader>

        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

IssueFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default IssueForm;
