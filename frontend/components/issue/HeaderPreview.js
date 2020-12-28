import { Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import { NextButtonLink } from '../Link';

function IssueHeaderPreview({ ticket }) {
  const secondaryColor = useColorModeValue('gray.500', 'gray.500');

  return (
    <>
      <Flex wrap="wrap" align="baseline" color={secondaryColor} fontSize="sm">
        <Text mr={3} as="span" fontWeight="semibold">
          {ticket.key}
        </Text>

        {ticket.createdBy && (
          <Text mr={3} as="span" display="flex" alignItems="center">
            Created by
            <NextButtonLink
              href={`/user/${encodeURIComponent(ticket.createdBy.id)}`}
              fontSize="sm"
              mx={1}
            >
              {ticket.createdBy.name}
            </NextButtonLink>
            {formatDistanceToNow(new Date(ticket.created_at))} ago
          </Text>
        )}

        {ticket.updatedBy && (
          <Text as="span" display="flex" alignItems="center">
            Updated by
            <NextButtonLink
              href={`/user/${encodeURIComponent(ticket.updatedBy.id)}`}
              fontSize="sm"
              mx={1}
            >
              {ticket.updatedBy.name}
            </NextButtonLink>
            {formatDistanceToNow(new Date(ticket.updated_at))} ago
          </Text>
        )}
      </Flex>

      <Heading mt={3} as="h2" fontSize="2xl">
        {ticket.name}
      </Heading>

      {ticket.description && <Text mt={2}>{ticket.description}</Text>}
    </>
  );
}

IssueHeaderPreview.propTypes = {
  ticket: PropTypes.object.isRequired
};

export default IssueHeaderPreview;
