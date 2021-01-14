import { Flex, Box, SkeletonText } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Attachments from '@/components/issue/Attachments';
import Comments from '@/components/issue/Comments';
import IssueAboutPreview from '@/components/issue/issuePreview/AboutPreview';
import IssueHeaderPreview from '@/components/issue/issuePreview/HeaderPreview';

function IssuePreview({ isLoading, issue, ...chakraProps }) {
  return (
    <Flex
      {...chakraProps}
      direction={{ base: 'column', md: 'row-reverse' }}
      justify={{ md: 'space-between' }}
    >
      <IssueAboutPreview isLoading={isLoading} issue={issue} />

      <Box mt={{ base: 6, md: 0 }} pr={{ md: 8 }} w="full" maxW={{ md: '640px' }}>
        {isLoading ? (
          <Box py={4}>
            <SkeletonText noOfLines={3} />
          </Box>
        ) : (
          <>
            <IssueHeaderPreview issue={issue} />
            <Attachments mt={8} />
            <Comments mt={12} issueId={issue.id} />
          </>
        )}
      </Box>
    </Flex>
  );
}

IssuePreview.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  issue: PropTypes.object
};

export default IssuePreview;
