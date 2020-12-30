import PropTypes from 'prop-types';
import { ButtonGroup, Button, Text, Flex } from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function PageControls({ pageIndex, setPageIndex, pageData, PAGE_SIZE }) {
  return (
    <ButtonGroup as={Flex} size="sm" variant="outline" align="center">
      <Button
        leftIcon={<FaArrowLeft />}
        disabled={pageIndex <= 0}
        onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
      >
        Prev
      </Button>
      <Text mx={1}>{pageIndex}</Text>
      <Button
        rightIcon={<FaArrowRight />}
        disabled={!pageData.length || pageData.length < PAGE_SIZE}
        onClick={() => setPageIndex((p) => p + 1)}
      >
        Next
      </Button>
    </ButtonGroup>
  );
}

PageControls.defaultProps = {
  PAGE_SIZE: 10
};

PageControls.propTypes = {
  pageIndex: PropTypes.number.isRequired,
  setPageIndex: PropTypes.func.isRequired,
  pageData: PropTypes.array.isRequired,
  PAGE_SIZE: PropTypes.number
};

export default PageControls;
