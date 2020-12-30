import PropTypes from 'prop-types';
import { Tr, Td } from '@chakra-ui/react';
import UserOptionsMenu from '@/components/dashboard/users/userRow/OptionsMenu';
import { format } from 'date-fns';

function UserRow({ user, onDelete }) {
  const createdAt = format(new Date(user.created_at), 'dd MMM, yyyy');

  return (
    <Tr>
      <Td>{user.id}</Td>
      <Td>{user.email}</Td>
      <Td>{user.name}</Td>
      <Td>{createdAt}</Td>
      <Td>
        <UserOptionsMenu onDelete={onDelete} />
      </Td>
    </Tr>
  );
}

UserRow.propTypes = {
  user: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default UserRow;
