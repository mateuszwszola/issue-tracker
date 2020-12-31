import { useApiUser } from '@/contexts/api-user-context';
import { useUpdateUser } from '@/hooks/use-user';
import { Box, FormControl, FormLabel, Input, FormErrorMessage, Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

function UpdateProfileForm({ ...chakraProps }) {
  const { user } = useApiUser();

  const { register, handleSubmit, errors } = useForm();

  const [updateUser, updateStatus] = useUpdateUser();

  const onSubmit = (data) => updateUser(user.id, data);

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} {...chakraProps}>
      <FormControl id="name" isInvalid={errors.name}>
        <FormLabel>Name</FormLabel>
        <Input
          defaultValue={user.name}
          ref={register({ required: true })}
          name="name"
          placeholder="Enter a name"
        />
        {errors.name && <FormErrorMessage>This field is required</FormErrorMessage>}
      </FormControl>

      <Button
        isLoading={updateStatus === 'loading'}
        mt={8}
        w="full"
        type="submit"
        colorScheme="green"
      >
        Update profile
      </Button>
    </Box>
  );
}

export default UpdateProfileForm;
