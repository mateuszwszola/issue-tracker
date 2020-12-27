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
  Textarea,
  useColorModeValue
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useSWR from 'swr';
import client from '@/utils/api-client';
import { useProjectEngineers } from '@/hooks/use-project';
import { useApiUser } from '@/contexts/api-user-context';

const IssueForm = ({ onSubmit, submitStatus, projectId }) => {
  const { register, handleSubmit, errors } = useForm();

  const inputBgColor = useColorModeValue('white', 'transparent');

  const [loadTypes, setLoadTypes] = useState(false);
  const [loadPriorities, setLoadPriorities] = useState(false);
  const [loadEngineers, setLoadEngineers] = useState(false);

  const { data: tData, error: tError } = useSWR(loadTypes ? 'tickets/type' : null, client);
  const { data: pData, error: pError } = useSWR(loadPriorities ? 'tickets/priority' : null, client);

  const { engineers, isLoading: isLoadingEngineers, error: engineersError } = useProjectEngineers(
    loadEngineers ? projectId : null
  );

  const types = tData?.types;
  const priorities = pData?.priorities;

  const { user } = useApiUser();

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
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
        <Textarea
          ref={register}
          name="description"
          bgColor={inputBgColor}
          placeholder="Enter issue description"
        />
      </FormControl>

      <FormControl mt={3} id="type_id" isInvalid={errors.type_id}>
        <FormLabel>Type</FormLabel>

        <Select
          onClick={() => setLoadTypes(true)}
          name="type_id"
          ref={register({ required: true })}
          bgColor={inputBgColor}
          placeholder="Select a ticket type"
        >
          {tError ? (
            <option disabled>Unable to load types</option>
          ) : !types ? (
            <option disabled>Loading...</option>
          ) : (
            <>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </>
          )}
        </Select>

        {errors.type_id && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <FormControl mt={3} id="priority_id" isInvalid={errors.priority_id}>
        <FormLabel>Priority</FormLabel>

        <Select
          onClick={() => setLoadPriorities(true)}
          name="priority_id"
          ref={register({ required: true })}
          bgColor={inputBgColor}
          placeholder="Select a ticket priority"
        >
          {pError ? (
            <option disabled>Unable to load ticket priorities</option>
          ) : !priorities ? (
            <option disabled>Loading...</option>
          ) : (
            <>
              {priorities.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </>
          )}
        </Select>

        {errors.priority_id && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <FormControl mt={3} id="assignee_id" isInvalid={errors.assignee_id}>
        <FormLabel>Assignee</FormLabel>

        <Select
          onClick={() => setLoadEngineers(true)}
          name="assignee_id"
          ref={register({ required: true })}
          bgColor={inputBgColor}
          placeholder="Select a user"
        >
          {engineersError ? (
            <option disabled>Unable to load users...</option>
          ) : isLoadingEngineers ? (
            <option disabled>Loading...</option>
          ) : (
            <>
              <option value={user?.id}>{user?.name}</option>

              {engineers.map((engineer) => (
                <option key={engineer.id} value={engineer.id}>
                  {engineer.name}
                </option>
              ))}
            </>
          )}
        </Select>

        {errors.assignee_id && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <Button
        isLoading={submitStatus === 'loading'}
        mt={8}
        w="full"
        type="submit"
        colorScheme="green"
      >
        Submit
      </Button>
    </Box>
  );
};

IssueForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  submitStatus: PropTypes.string.isRequired,
  projectId: PropTypes.number.isRequired
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
