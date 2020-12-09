import { Layout } from '@/components/Layout';
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  Button
} from '@chakra-ui/react';
import useSWR from 'swr';
import fetcher from '@/utils/api-client';

function CreateProject() {
  const { data, error: typesError } = useSWR('projects/type', fetcher);

  const projectTypes = data?.types;

  return (
    <Layout>
      <Box mt={{ base: 8, md: 16 }} w="full" mx="auto">
        <Box w="full" maxW="400px" mx="auto">
          <Heading size="lg" textAlign="center">
            Create a new project
          </Heading>
          <Box as="form" mt={8}>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Enter a project name" />
            </FormControl>

            <FormControl mt={3} id="description">
              <FormLabel>Description</FormLabel>
              <Input placeholder="Enter a project description" />
            </FormControl>

            <FormControl mt={3} id="type" isRequired>
              <FormLabel>Type</FormLabel>
              <Select placeholder="Select a project type">
                {typesError ? (
                  <Text as="span">Error...</Text>
                ) : !projectTypes ? (
                  <Text as="span">Loading...</Text>
                ) : (
                  <>
                    {projectTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </>
                )}
              </Select>
            </FormControl>

            <Button mt={8} w="full" type="submit" colorScheme="green">
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}

export default CreateProject;
