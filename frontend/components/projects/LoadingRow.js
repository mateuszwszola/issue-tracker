import { Td, Tr } from '@/components/Table';
import { Avatar, AvatarGroup, Skeleton, SkeletonCircle } from '@chakra-ui/react';

export const LoadingRow = () => {
  return (
    <Tr>
      <Td p={1}>
        <Skeleton width="100%" height="40px" />
      </Td>
      <Td p={1}>
        <Skeleton width="100%" height="40px" />
      </Td>
      <Td p={1}>
        <SkeletonCircle size="10" />
      </Td>
      <Td p={1}>
        <AvatarGroup>
          <SkeletonCircle size="10" as={Avatar} />
          <SkeletonCircle size="10" as={Avatar} />
          <SkeletonCircle size="10" as={Avatar} />
        </AvatarGroup>
      </Td>
    </Tr>
  );
};
