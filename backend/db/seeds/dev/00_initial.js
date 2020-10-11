import tableNames from '../../../src/constants/tableNames';
import rolesData, { ROLES } from '../../../src/constants/roles';

export async function seed(knex) {
  await Promise.all(
    Object.values(tableNames).map((tableName) => knex(tableName).del())
  );

  const rolesResult = await knex(tableNames.role)
    .returning(['name', 'id'])
    .insert(rolesData);

  const adminRoleId = rolesResult.find((entry) => entry.name === ROLES.admin)
    .id;

  await knex(tableNames.user).returning('*').insert({
    name: 'John Doe',
    email: 'johndoe@email.com',
    role_id: adminRoleId,
  });
}
