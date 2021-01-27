import { useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, CircularProgress, Image, Text, useToast } from '@chakra-ui/react';
import client from '@/utils/api-client';
import { FaPlus } from 'react-icons/fa';

function AddAttachment() {
  const inputRef = useRef();
  const toast = useToast();
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const uploadFile = async (file, signedRequest, url) => {
    try {
      await fetch(signedRequest, { method: 'PUT', body: file });
      toast({
        title: 'Attachment uploaded.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      setImageUrl(url);
      inputRef.current.value = '';
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
        `tickets/attachment/sign-s3?file-name=${encodeURIComponent(
          file.name
        )}&file-type=${encodeURIComponent(file.type)}`,
        {
          token
        }
      );

      await uploadFile(file, data.signedRequest, data.url);
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
      {loading && <CircularProgress isIndeterminate />}
      <Box boxSize="100px">{imageUrl && <Image w="full" objectFit="cover" src={imageUrl} />}</Box>

      <Button
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

function Attachments({ ...chakraProps }) {
  const { isAuthenticated } = useAuth0();

  return (
    <Box {...chakraProps}>
      <Text fontSize="sm" fontWeight="medium">
        Attachments 0
      </Text>
      {isAuthenticated && <AddAttachment />}
    </Box>
  );
}

export default Attachments;
