import PropTypes from 'prop-types';
import { ButtonGroup, Flex } from '@chakra-ui/react';
import { ActionButton } from '@/components/Button';

function EditIssueControls({ isEditing, setIsEditing }) {
  return (
    <Flex w="full" justify="flex-end">
      {isEditing ? (
        <ButtonGroup>
          <ActionButton onClick={() => {}} colorScheme="green">
            Save
          </ActionButton>
          <ActionButton onClick={() => setIsEditing(false)}>Cancel</ActionButton>
        </ButtonGroup>
      ) : (
        <>
          <ActionButton onClick={() => setIsEditing(true)}>Edit</ActionButton>
        </>
      )}
    </Flex>
  );
}

EditIssueControls.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired
};

export default EditIssueControls;
