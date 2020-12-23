import PropTypes from 'prop-types';
import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import {
  useAddProjectEngineer,
  useProjectEngineers,
  useRemoveProjectEngineer
} from '@/hooks/use-project';
import { useProfiles } from '@/hooks/use-profile';
import { FaMinus, FaPlus } from 'react-icons/fa';

function AddProjectEngineer({ projectId, ...chakraProps }) {
  const { profiles, isLoading: isLoadingProfiles, error: profilesError } = useProfiles();
  const { engineers, isLoading: isLoadingEngineers, error: engineersError } = useProjectEngineers(
    projectId
  );
  const [addEngineer] = useAddProjectEngineer(projectId);
  const [removeEngineer] = useRemoveProjectEngineer(projectId);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isEngineer = (userId) => {
    return !!engineers?.find((engineer) => engineer.id === userId);
  };

  return (
    <>
      <Button onClick={onOpen} size="sm" colorScheme="teal" variant="solid" {...chakraProps}>
        Manage
      </Button>

      <AddProjectEngineerModal onClose={onClose} isOpen={isOpen}>
        <Flex px={2} py={4} overflowY="scroll" w="full" maxHeight="500px" align="center">
          {profilesError || engineersError ? (
            <Text>Unable to load users</Text>
          ) : isLoadingProfiles || isLoadingEngineers ? (
            <Spinner />
          ) : (
            <VStack w="full" spacing={3} align="stretch">
              {profiles.map((profile) => (
                <Flex key={profile.id} align="center" justify="space-between">
                  <Text>{profile.name}</Text>
                  {isEngineer(profile.id) ? (
                    <Button
                      onClick={() => removeEngineer(profile.id)}
                      size="sm"
                      leftIcon={<FaMinus />}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button onClick={() => addEngineer(profile.id)} size="sm" leftIcon={<FaPlus />}>
                      Add
                    </Button>
                  )}
                </Flex>
              ))}
            </VStack>
          )}
        </Flex>
      </AddProjectEngineerModal>
    </>
  );
}

AddProjectEngineer.propTypes = {
  projectId: PropTypes.string.isRequired
};

function AddProjectEngineerModal({ isOpen, onClose, children }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />

      <ModalContent mx={2} px={2} py={6}>
        <ModalCloseButton />

        <ModalHeader>
          <Heading as="h3" textAlign="center" fontSize="2xl">
            Manage project engineers
          </Heading>
        </ModalHeader>

        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}

AddProjectEngineerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default AddProjectEngineer;
