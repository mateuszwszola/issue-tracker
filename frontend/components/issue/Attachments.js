import { useRef, useState } from 'react';
import useSWR from 'swr';
import PropTypes from 'prop-types';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Button,
  IconButton,
  Image,
  Link,
  SimpleGrid,
  Spinner,
  Text,
  useToast
} from '@chakra-ui/react';
import client from '@/utils/api-client';
import { FaPlus } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

function AddAttachment({ issueId, onUpload }) {
  const inputRef = useRef();
  const toast = useToast();
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);

  const uploadFile = async (file, signedRequest, url, token) => {
    try {
      await fetch(signedRequest, { method: 'PUT', body: file });

      // Add image url on the backend
      const { attachment } = await client(`tickets/${issueId}/attachment`, {
        token,
        body: { attachment_url: url }
      });

      toast({
        title: 'Attachment uploaded.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      inputRef.current.value = '';
      onUpload(attachment);
    } catch (err) {
      toast({
        title: 'An error occurred.',
        description: 'Unable to upload a file.',
        status: 'error',
        duration: 9000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const getSignedRequest = async (file) => {
    setLoading(true);

    try {
      const token = await getAccessTokenSilently();

      const { data } = await client(
        `tickets/${issueId}/attachment/sign-s3?file-name=${encodeURIComponent(
          file.name
        )}&file-type=${encodeURIComponent(file.type)}`,
        {
          token
        }
      );

      await uploadFile(file, data.signedRequest, data.url, token);
    } catch (err) {
      toast({
        title: 'An error occurred.',
        description: 'Unable to upload a file.',
        status: 'error',
        duration: 9000,
        isClosable: true
      });
      setLoading(false);
    }
  };

  const onFileChange = async () => {
    const { files } = inputRef.current;
    const file = files[0];
    if (file) {
      await getSignedRequest(file);
    }
  };

  return (
    <>
      <Button
        isLoading={loading}
        loadingText="Uploading..."
        mt={4}
        onClick={() => inputRef.current.click()}
        leftIcon={<FaPlus />}
        variant="outline"
        colorScheme="blue"
        size="sm"
      >
        Add a photo
      </Button>

      <input id="fileUpload" ref={inputRef} type="file" onChange={onFileChange} hidden />
    </>
  );
}

AddAttachment.propTypes = {
  issueId: PropTypes.number,
  onUpload: PropTypes.func.isRequired
};

function Attachments({ issueId, canUpload, ...chakraProps }) {
  const { getAccessTokenSilently } = useAuth0();
  const toast = useToast();
  const { data, error, mutate } = useSWR(`tickets/${issueId}/attachment`, client);
  const attachments = data?.attachments || [];

  const onUpload = async (attachment) => {
    await mutate(
      (data) => ({
        attachments: [...(data?.attachments || []), attachment]
      }),
      false
    );
  };

  const onDelete = async (attachmentId) => {
    const token = await getAccessTokenSilently();
    client(`tickets/${issueId}/attachment/${attachmentId}`, { method: 'DELETE', token }).catch(
      () => {
        toast({
          title: 'Unable to delete an attachment.',
          status: 'error',
          duration: 9000,
          isClosable: true
        });
      }
    );

    await mutate(
      (data) => ({
        attachments: data.attachments.filter((attachment) => attachment.id !== attachmentId)
      }),
      false
    );
  };

  return (
    <Box {...chakraProps}>
      {error ? (
        <Text>Unable to load attachments</Text>
      ) : !data ? (
        <Spinner />
      ) : (
        <>
          <Text fontSize="sm" fontWeight="medium">
            Attachments {attachments?.length}
          </Text>
          <SimpleGrid mt={4} columns={[2, 4, 5]} spacing={4}>
            {attachments.map((attachment) => (
              <Box key={attachment.id} boxSize="100px" pos="relative">
                {canUpload && (
                  <Box pos="absolute" top={-5} right={-5}>
                    <IconButton
                      onClick={() => onDelete(attachment.id)}
                      size="xs"
                      variant="ghost"
                      aria-label="Delete a photo"
                      icon={<MdClose />}
                    />
                  </Box>
                )}
                <Link href={attachment.attachment_url} isExternal>
                  <Image src={attachment.attachment_url} boxSize="100px" objectFit="cover" />
                </Link>
              </Box>
            ))}
          </SimpleGrid>
          {canUpload && <AddAttachment issueId={issueId} onUpload={onUpload} />}
        </>
      )}
    </Box>
  );
}

Attachments.propTypes = {
  issueId: PropTypes.number,
  canUpload: PropTypes.bool.isRequired
};

export default Attachments;
