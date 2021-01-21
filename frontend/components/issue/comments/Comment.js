import { useState } from 'react';
import PropTypes from 'prop-types';
import { Flex, IconButton } from '@chakra-ui/react';
import { MdEdit } from 'react-icons/md';
import { useApiUser } from '@/contexts/api-user-context';
import CommentPreview from './comment/CommentPreview';
import CommentEditor from './comment/CommentEditor';

function Comment({ comment, issueId, mutate }) {
  const { user } = useApiUser();
  const [isEditing, setIsEditing] = useState(false);
  const canEdit = user?.is_admin || user?.id === comment.user_id;

  if (canEdit && isEditing) {
    return (
      <CommentEditor
        issueId={issueId}
        commentId={comment.id}
        initialComment={comment.comment}
        mutate={mutate}
        setIsEditing={setIsEditing}
      />
    );
  }

  return (
    <>
      {canEdit && (
        <Flex w="full" justify="flex-end" align="center">
          <IconButton
            variant="ghost"
            onClick={() => setIsEditing(true)}
            aria-label="Edit comment"
            icon={<MdEdit />}
          />
        </Flex>
      )}
      <CommentPreview comment={comment} />
    </>
  );
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  issueId: PropTypes.number.isRequired,
  mutate: PropTypes.func.isRequired
};

export default Comment;
