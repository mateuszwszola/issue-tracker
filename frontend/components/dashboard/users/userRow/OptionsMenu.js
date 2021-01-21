import { IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { FaEllipsisV } from 'react-icons/fa';

function UserOptionsMenu() {
  return (
    <>
      <Menu fixed>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<FaEllipsisV />}
          bgColor="transparent"
        />
        <MenuList>
          <MenuItem>+ Add role</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}

export default UserOptionsMenu;
