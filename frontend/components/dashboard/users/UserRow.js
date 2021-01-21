import PropTypes from 'prop-types';
import UserOptionsMenu from '@/components/dashboard/users/userRow/OptionsMenu';
import { Tr, Td, Flex } from '@chakra-ui/react';

function UserRow({ user, ...chakraProps }) {
  return (
    <Tr {...chakraProps}>
      <Td>{user.id}</Td>
      <Td>{user.email}</Td>
      <Td>{user.name}</Td>

      <Td>
        <Flex w="full" justify="flex-end">
          <UserOptionsMenu />
        </Flex>
      </Td>
    </Tr>
  );
}

UserRow.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserRow;
