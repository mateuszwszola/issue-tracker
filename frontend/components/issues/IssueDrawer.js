import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const IssueDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { selectedIssue, projectKey } = router.query;

  useEffect(() => {
    setIsOpen(!!selectedIssue);
  }, [selectedIssue]);

  const handleClose = () => {
    router.push(`/issues/${encodeURIComponent(projectKey)}`);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={handleClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Issue Drawer</DrawerHeader>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
