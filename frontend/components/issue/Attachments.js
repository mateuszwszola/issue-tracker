import { useRef, useState } from 'react';
import useSWR from 'swr';
import PropTypes from 'prop-types';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Image, Link, SimpleGrid, Spinner, Text, useToast } from '@chakra-ui/react';
import client from '@/utils/api-client';
import { FaPlus } from 'react-icons/fa';

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
        mt={2}
        onClick={() => inputRef.current.click()}
        leftIcon={<FaPlus />}
        variant="outline"
        colorScheme="blue"
        size="sm"
      >
        Upload photo
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
          <SimpleGrid mt={2} columns={[3, 5]} spacing={2}>
            {attachments.map((attachment) => (
              <Box
                as={Link}
                key={attachment.id}
                boxSize="100px"
                href={attachment.attachment_url}
                isExternal
              >
                <Image src={attachment.attachment_url} boxSize="100px" objectFit="cover" />
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
