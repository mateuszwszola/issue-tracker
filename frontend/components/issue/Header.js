import { Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import { NextButtonLink } from '@/components/Link';

function Header({ issue }) {
  const secondaryColor = useColorModeValue('gray.500', 'gray.500');

  return (
    <>
      <Flex wrap="wrap" align="baseline" color={secondaryColor} fontSize="sm">
        <Text mr={3} as="span" fontWeight="semibold">
          {issue.key}
        </Text>

        {issue.createdBy && (
          <Text mr={3} as="span" display="flex" alignItems="center">
            Created by
            <NextButtonLink
              href={`/user/${encodeURIComponent(issue.createdBy.id)}`}
              fontSize="sm"
              mx={1}
            >
              {issue.createdBy.name}
            </NextButtonLink>
            {formatDistanceToNow(new Date(issue.created_at))} ago
          </Text>
        )}

        {issue.updatedBy && (
          <Text as="span" display="flex" alignItems="center">
            Updated by
            <NextButtonLink
              href={`/user/${encodeURIComponent(issue.updatedBy.id)}`}
              fontSize="sm"
              mx={1}
            >
              {issue.updatedBy.name}
            </NextButtonLink>
            {formatDistanceToNow(new Date(issue.updated_at))} ago
          </Text>
        )}
      </Flex>

      <Heading mt={3} as="h2" fontSize="2xl">
        {issue.name}
      </Heading>

      {issue.description && <Text mt={2}>{issue.description}</Text>}
    </>
  );
}

Header.propTypes = {
  issue: PropTypes.object
};

export default Header;
