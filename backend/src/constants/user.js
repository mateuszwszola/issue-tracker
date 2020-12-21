const validProfileOrders = new Set([
  'id',
  'sub',
  'name',
  'created_at',
  'updated_at',
]);

const validUserOrders = new Set([...validProfileOrders, 'email']);

export { validUserOrders, validProfileOrders };
