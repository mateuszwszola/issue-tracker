exports.up = async (knex) => {
  await knex.schema.createTable('User', (table) => {
    table.increments().notNullable();
    table.string('name').notNullable();
  });
};

exports.down = async (knex) => {};
