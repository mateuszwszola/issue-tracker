import { Flex, Box, Image, Heading, Text, Button } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';
import { projectName } from '@/pages/index';
import { useAuth0 } from '@auth0/auth0-react';

export const Hero = (props) => {
  const { loginWithRedirect } = useAuth0();

  const headingText = 'Manage your project work';
  const heroText = `Welcome to the ${projectName}, software for managing
  project work. Keep track of the tasks, bugs, and features. Collaborate with your team, and see what needs to be done. It will help with keeping the project up to date.`;

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
        ml={{ base: 'auto', lg: '1rem' }}
      >
        <Image maxW="full" src="/project_team.svg" />
      </Box>
      <Box
        flexBasis={{ base: '100%', lg: '50%' }}
        maxW={{ base: 'lg', lg: 'full' }}
        mt={{ base: 4, lg: 0 }}
        mx={{ base: 'auto', lg: 0 }}
      >
        <Heading as="h1">{headingText}</Heading>

        <Text fontSize={{ md: 'lg' }} color="gray.500" mt={2}>
          {heroText}
        </Text>

        <Box mt={6}>
          <Button
            onClick={() => loginWithRedirect()}
            rightIcon={<FaArrowRight />}
            cursor="pointer"
            colorScheme="green"
            textTransform="uppercase"
            fontWeight="bold"
            fontSize="sm"
            letterSpacing="wide"
          >
            Let&apos;s get started
          </Button>
        </Box>
      </Box>
    </Flex>
  );
};
