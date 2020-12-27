import PropTypes from 'prop-types';
import {
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
import { ActionButton } from '@/components/Button';

function AddProjectEngineer({ projectId, authUserId, ...chakraProps }) {
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
      <ActionButton onClick={onOpen} colorScheme="teal" {...chakraProps}>
        Manage
      </ActionButton>

      <AddProjectEngineerModal onClose={onClose} isOpen={isOpen}>
        <Flex overflowY="scroll" w="full" maxHeight="500px" align="center">
          {profilesError || engineersError ? (
            <Text>Unable to load users</Text>
          ) : isLoadingProfiles || isLoadingEngineers ? (
            <Spinner />
          ) : (
            <VStack w="full" spacing={4} align="stretch" p={1}>
              {profiles.map((profile) => {
                if (profile.id === authUserId) {
                  return null;
                }

                return (
                  <Flex key={profile.id} align="center" justify="space-between">
                    <Text>{profile.name}</Text>
                    {isEngineer(profile.id) ? (
                      <ActionButton
                        onClick={() => removeEngineer(profile.id)}
                        leftIcon={<FaMinus />}
                        size="xs"
                      >
                        Remove
                      </ActionButton>
                    ) : (
                      <ActionButton
                        onClick={() => addEngineer(profile.id)}
                        leftIcon={<FaPlus />}
                        size="xs"
                      >
                        Add
                      </ActionButton>
                    )}
                  </Flex>
                );
              })}
            </VStack>
          )}
        </Flex>
      </AddProjectEngineerModal>
    </>
  );
}

AddProjectEngineer.propTypes = {
  projectId: PropTypes.string.isRequired,
  authUserId: PropTypes.number.isRequired
};

function AddProjectEngineerModal({ isOpen, onClose, children }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />

      <ModalContent mx={2} py={6}>
        <ModalCloseButton />

        <ModalHeader>
          <Heading as="h3" textAlign="center" fontSize="xl">
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
