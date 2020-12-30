import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  IconButton,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/react';
import { FaEllipsisV } from 'react-icons/fa';

function UserDeleteAlert({ onDelete, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef();

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <>
      {children(setIsOpen)}

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={() => setIsOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete a user
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? This action cannot be undone.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

UserDeleteAlert.propTypes = {
  children: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

function UserOptionsMenu({ onDelete }) {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<FaEllipsisV />}
        bgColor="transparent"
      />
      <MenuList>
        <UserDeleteAlert onDelete={onDelete}>
          {(setIsOpen) => <MenuItem onClick={() => setIsOpen(true)}>Delete</MenuItem>}
        </UserDeleteAlert>
      </MenuList>
    </Menu>
  );
}

UserOptionsMenu.propTypes = {
  onDelete: PropTypes.func.isRequired
};

export default UserOptionsMenu;
