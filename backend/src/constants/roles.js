export const ROLES = {
  admin: 'Admin',
  product_manager: 'Product Manager',
  engineer: 'Engineer',
  guest: 'Guest',
};

export default Object.values(ROLES).map((name) => ({ name }));
