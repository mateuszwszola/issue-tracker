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
  Textarea,
  useColorModeValue
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import client from '@/utils/api-client';
import { useProjectEngineers } from '@/hooks/use-project';
import { useApiUser } from '@/contexts/api-user-context';

const IssueForm = ({
  onSubmit,
  submitStatus,
  projectId,
  initialNameValue,
  initialDescValue,
  initialTypeValue,
  initialPriorityValue,
  initialStatusValue,
  initialAssigneeValue,
  isEditing,
  ...chakraProps
}) => {
  const { register, handleSubmit, errors } = useForm();

  const inputBgColor = useColorModeValue('white', 'transparent');

  const { user } = useApiUser();

  const { data: tData, error: tError } = useSWR('tickets/type', client);
  const { data: pData, error: pError } = useSWR('tickets/priority', client);
  const { data: sData, error: sError } = useSWR(isEditing ? 'tickets/status' : null, client);

  const types = tData?.types;
  const priorities = pData?.priorities;
  const statuses = sData?.statuses;

  const { engineers, isLoading: isLoadingEngineers, error: engineersError } = useProjectEngineers(
    projectId
  );

  const assignees = [
    { id: user?.id, name: user?.name },
    ...(engineers?.filter((u) => u.id !== user?.id) || [])
  ];

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} {...chakraProps}>
      <FormControl id="name" isInvalid={errors.name}>
        <FormLabel>Name</FormLabel>
        <Input
          defaultValue={initialNameValue}
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
          defaultValue={initialDescValue}
          ref={register}
          name="description"
          bgColor={inputBgColor}
          placeholder="Enter an issue description"
        />
      </FormControl>

      <FormControl mt={3} id="type_id" isInvalid={errors.type_id}>
        <FormLabel>Type</FormLabel>

        {tError ? (
          <Text>Unable to load</Text>
        ) : !types ? (
          <Text>Loading...</Text>
        ) : (
          <Select
            defaultValue={initialTypeValue}
            name="type_id"
            ref={register({ required: true })}
            bgColor={inputBgColor}
            placeholder="Select a ticket type"
          >
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </Select>
        )}

        {errors.type_id && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      {isEditing && (
        <FormControl mt={3} id="status_id" isInvalid={errors.status_id}>
          <FormLabel>Status</FormLabel>

          {sError ? (
            <Text>Unable to load</Text>
          ) : !statuses ? (
            <Text>Loading...</Text>
          ) : (
            <Select
              defaultValue={initialStatusValue}
              name="status_id"
              ref={register({ required: true })}
              bgColor={inputBgColor}
              placeholder="Select a ticket status"
            >
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </Select>
          )}

          {errors.status_id && <FormErrorMessage>This field is required</FormErrorMessage>}
        </FormControl>
      )}

      <FormControl mt={3} id="priority_id" isInvalid={errors.priority_id}>
        <FormLabel>Priority</FormLabel>

        {pError ? (
          <Text>Unable to load</Text>
        ) : !priorities ? (
          <Text>Loading...</Text>
        ) : (
          <Select
            defaultValue={initialPriorityValue}
            name="priority_id"
            ref={register({ required: true })}
            bgColor={inputBgColor}
            placeholder="Select a ticket priority"
          >
            {priorities.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </Select>
        )}

        {errors.priority_id && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <FormControl mt={3} id="assignee_id" isInvalid={errors.assignee_id}>
        <FormLabel>Assignee</FormLabel>

        {engineersError ? (
          <Text>Unable to load users...</Text>
        ) : isLoadingEngineers ? (
          <Text>Loading...</Text>
        ) : (
          <Select
            defaultValue={initialAssigneeValue}
            name="assignee_id"
            ref={register({ required: true })}
            bgColor={inputBgColor}
            placeholder="Select a user"
          >
            {assignees.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        )}

        {errors.assignee_id && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <Button
        isLoading={submitStatus === 'loading'}
        mt={8}
        w="full"
        type="submit"
        colorScheme="green"
      >
        {isEditing ? 'Save' : 'Create'}
      </Button>
    </Box>
  );
};

IssueForm.defaultProps = {
  isEditing: false
};

IssueForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  submitStatus: PropTypes.string.isRequired,
  projectId: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  initialNameValue: PropTypes.string,
  initialDescValue: PropTypes.string,
  initialTypeValue: PropTypes.number,
  initialPriorityValue: PropTypes.number,
  initialStatusValue: PropTypes.number,
  initialAssigneeValue: PropTypes.number
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
