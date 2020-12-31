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

function UserDeleteAlert({ isOpen, setIsOpen, handleDelete }) {
  const cancelRef = useRef();

  return (
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
  );
}

UserDeleteAlert.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
};

function UserOptionsMenu({ onDelete, deleteStatus }) {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setIsDeleteAlertOpen(false);
  };

  return (
    <>
      <Menu fixed>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<FaEllipsisV />}
          bgColor="transparent"
        />
        <MenuList>
          <MenuItem
            onClick={() => setIsDeleteAlertOpen(true)}
            isDisabled={deleteStatus === 'loading'}
          >
            Delete
          </MenuItem>
        </MenuList>
      </Menu>

      <UserDeleteAlert
        isOpen={isDeleteAlertOpen}
        setIsOpen={setIsDeleteAlertOpen}
        handleDelete={handleDelete}
      />
    </>
  );
}

UserOptionsMenu.propTypes = {
  onDelete: PropTypes.func.isRequired,
  deleteStatus: PropTypes.string.isRequired
};

export default UserOptionsMenu;
