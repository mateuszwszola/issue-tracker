import { Skeleton } from '@chakra-ui/react';

const renderSkeletons = ({ noOfSkeletons, ...skeletonProps }) => {
  const skeletons = [];
  for (let i = 0; i < noOfSkeletons; i++) {
    skeletons.push(<Skeleton key={i} {...skeletonProps} />);
  }
  return skeletons;
};

export { renderSkeletons };
