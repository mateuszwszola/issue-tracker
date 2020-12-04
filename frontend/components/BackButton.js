import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiArrowLeft } from 'react-icons/fi';

export const BackButton = ({ children, ...props }) => {
  const router = useRouter();

  return (
    <Button size="sm" leftIcon={<FiArrowLeft />} onClick={() => router.back()} {...props}>
      {children}
    </Button>
  );
};

BackButton.propTypes = {
  children: PropTypes.string
};
