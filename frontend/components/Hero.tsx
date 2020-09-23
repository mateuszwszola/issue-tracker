import NextLink from 'next/link';
import {
  Flex,
  Box,
  Image,
  Heading,
  Text,
  Button,
  FlexProps
} from '@chakra-ui/core';
import { FiArrowRight } from 'react-icons/fi';
import { projectName } from '../pages/index';

export const Hero: React.FC = (props: FlexProps) => {
  const headingText = 'Manage your project work';
  const heroText = `Welcome to ${projectName}. The software for managing
  project work. Track tasks, bugs, and plan what needs to be done next. It will help you and your team in creating great products
  easier.`;

  return (
    <Flex
      as="section"
      w="full"
      flex={1}
      py={4}
      direction={{ base: 'column', lg: 'row-reverse' }}
      justify={{ base: 'center', lg: 'space-between' }}
      align="center"
      {...props}
    >
      <Box
        flexBasis={{ base: '100%', lg: '50%' }}
        maxW={{ base: 'lg', lg: 'full' }}
        mx={{ base: 'auto', lg: 0 }}
        ml={{ lg: '1rem' }}
      >
        <Image maxW="full" src="/project_team.svg" />
      </Box>
      <Box
        flexBasis={{ base: '100%', lg: '50%' }}
        maxW={{ base: 'lg', lg: 'full' }}
        mt={{ base: 4, lg: 0 }}
        mx={{ base: 'auto', lg: 0 }}
      >
        <Heading as="h1" size="xl">
          {headingText}
        </Heading>

        <Text fontSize={{ md: 'lg' }} color="gray.500" mt={2}>
          {heroText}
        </Text>

        <Box mt={6}>
          <NextLink href="/signup">
            <Button
              as="a"
              rightIcon={<FiArrowRight />}
              cursor="pointer"
              colorScheme="green"
              textTransform="uppercase"
              fontWeight="bold"
              fontSize="sm"
              letterSpacing="wide"
            >
              Let&apos;s get started
            </Button>
          </NextLink>
        </Box>
      </Box>
    </Flex>
  );
};
