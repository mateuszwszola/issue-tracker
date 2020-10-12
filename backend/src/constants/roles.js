const ROLES = {
  admin: 'Admin',
  product_manager: 'Product Manager',
  engineer: 'Engineer',
  guest: 'Guest',
};

const roles = Object.values(ROLES).map((name) => ({ name }));

export { ROLES, roles };
