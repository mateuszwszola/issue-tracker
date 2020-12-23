import PropTypes from 'prop-types';
import { useProjectTypes } from '@/hooks/use-project';
import { useUsers } from '@/hooks/use-user';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

const ProjectForm = ({
  onSubmit,
  status,
  initialNameValue,
  initialDescValue,
  initialTypeId,
  initialManagerId
}) => {
  const {
    projectTypes,
    isLoading: isLoadingProjectTypes,
    error: projectTypesError
  } = useProjectTypes();
  const { users, isLoading: isLoadingUsers, error: usersError } = useUsers();

  const { register, handleSubmit, errors } = useForm();

  const inputBgColor = useColorModeValue('white', 'transparent');

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl id="name" isInvalid={errors.name}>
        <FormLabel>Name</FormLabel>
        <Input
          defaultValue={initialNameValue || ''}
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
          defaultValue={initialDescValue || ''}
          ref={register}
          name="description"
          bgColor={inputBgColor}
          placeholder="Enter a project description"
        />
      </FormControl>

      <FormControl mt={3} id="type_id" isInvalid={errors.type_id}>
        <FormLabel>Type</FormLabel>

        {projectTypesError ? (
          <Text as="span">Unable to load types</Text>
        ) : isLoadingProjectTypes ? (
          <Text as="span">Loading...</Text>
        ) : (
          <Select
            defaultValue={initialTypeId}
            name="type_id"
            ref={register({ required: true })}
            bgColor={inputBgColor}
          >
            {projectTypes.map((type) => (
              <option key={type.id} value={Number(type.id)}>
                {type.name}
              </option>
            ))}
          </Select>
        )}

        {errors.type_id && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <FormControl mt={3} id="manager_id" isInvalid={errors.manager_id}>
        <FormLabel>Manager</FormLabel>

        {usersError ? (
          <Text as="span">Unable to load users</Text>
        ) : isLoadingUsers ? (
          <Text as="span">Loading users...</Text>
        ) : (
          <Select
            defaultValue={initialManagerId}
            ref={register({ required: true })}
            name="manager_id"
            bgColor={inputBgColor}
            placeholder="Select a project manager"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        )}

        {errors.manager_id && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <Button isLoading={status === 'loading'} mt={8} w="full" type="submit" colorScheme="green">
        Submit
      </Button>
    </Box>
  );
};

ProjectForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  initialNameValue: PropTypes.string,
  initialDescValue: PropTypes.string,
  initialTypeId: PropTypes.number,
  initialManagerId: PropTypes.number
};

export default ProjectForm;
