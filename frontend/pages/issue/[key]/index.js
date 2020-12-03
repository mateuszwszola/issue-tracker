import { useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  useDisclosure,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader
} from '@chakra-ui/react';
import { Layout } from '@/components/Layout';
import { BackButton } from '@/components/BackButton';

function Issue() {
  const router = useRouter();
  const { key: issueKey } = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <Layout>
      <Box>
        <BackButton>Go back</BackButton>
        <Heading as="h2" fontSize="xl" mt={6}>
          Issue: {issueKey}
        </Heading>
      </Box>

      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Open
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Issue: {issueKey}</DrawerHeader>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Layout>
  );
}

export default Issue;
