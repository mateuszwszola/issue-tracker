import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { FiArrowLeft } from 'react-icons/fi';

export const BackButton = ({ children }) => {
  const router = useRouter();

  return (
    <Button size="sm" leftIcon={<FiArrowLeft />} onClick={() => router.back()}>
      {children}
    </Button>
  );
};

BackButton.propTypes = {
  children: PropTypes.string
};
