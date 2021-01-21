import { useDeleteAccount } from '@/hooks/use-user';
import { ButtonGroup, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { ActionButton } from '../Button';

function DeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteAccount, deleteStatus] = useDeleteAccount();

  return (
    <>
      {!isDeleting ? (
        <ActionButton colorScheme="red" onClick={() => setIsDeleting(true)}>
          Delete account
        </ActionButton>
      ) : (
        <Flex direction="column" align="flex-end">
          <Text>Are you sure? This action cannot be undone</Text>
          <ButtonGroup mt={2} spacing="4">
            <ActionButton
              isLoading={deleteStatus === 'loading'}
              onClick={deleteAccount}
              colorScheme="red"
            >
              Delete
            </ActionButton>
            <ActionButton onClick={() => setIsDeleting(false)}>Cancel</ActionButton>
          </ButtonGroup>
        </Flex>
      )}
    </>
  );
}

export default DeleteAccount;
