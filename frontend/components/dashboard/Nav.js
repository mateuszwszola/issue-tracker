import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { MdChevronRight } from 'react-icons/md';
import { useRouter } from 'next/router';

function DashboardNav({ isAdmin }) {
  const { pathname } = useRouter();

  return (
    <Breadcrumb spacing="8px" separator={<MdChevronRight color="gray.500" />}>
      <BreadcrumbItem isCurrentPage={pathname === '/dashboard'}>
        <BreadcrumbLink as={NextLink} href="/dashboard" passHref>
          <a>Dashboard</a>
        </BreadcrumbLink>
      </BreadcrumbItem>

      {isAdmin && (
        <BreadcrumbItem isCurrentPage={pathname === '/dashboard/users'}>
          <BreadcrumbLink as={NextLink} href="/dashboard/users" passHref>
            <a>Users</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
}

DashboardNav.defaultProps = {
  isAdmin: false
};

DashboardNav.propTypes = {
  isAdmin: PropTypes.bool
};

export default DashboardNav;
