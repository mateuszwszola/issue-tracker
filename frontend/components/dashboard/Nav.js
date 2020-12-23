import { Button, Tab, TabList, Tabs } from '@chakra-ui/react';
import NextLink from 'next/link';

function Nav() {
  return (
    <Tabs>
      <TabList>
        <Tab>
          <NextLink href="/dashboard" passHref>
            <Button as="a" variant="link" size="sm">
              Overview
            </Button>
          </NextLink>
        </Tab>
        <Tab>
          <NextLink href="/dashboard/projects" passHref>
            <Button as="a" variant="link" size="sm">
              Projects
            </Button>
          </NextLink>
        </Tab>
        <Tab>
          <NextLink href="/dashboard/users" passHref>
            <Button as="a" variant="link" size="sm">
              Users
            </Button>
          </NextLink>
        </Tab>
      </TabList>
    </Tabs>
  );
}

export default Nav;
