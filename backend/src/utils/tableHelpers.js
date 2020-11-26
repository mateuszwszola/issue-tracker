function createNameTable(knex, tableName, columnName = 'name') {
  return knex.schema.createTable(tableName, (table) => {
    table.increments().primary();
    table.string(columnName).notNullable().unique();
    addTimestamps(table);
  });
}

function addTimestamps(table) {
  return table.timestamps(false, true);
}

function addUrl(table, urlName) {
  return table.string(urlName, 2000);
}

function referenceTable(
  rootTable,
  rootTableColumnName,
  foreignTableName,
  notNullable = true,
  foreignColumnName = 'id'
) {
  const query = rootTable.integer(rootTableColumnName).unsigned();

  if (notNullable) {
    query.notNullable();
  }

  return rootTable
    .foreign(rootTableColumnName)
    .references(foreignColumnName)
    .inTable(foreignTableName);
}

export { createNameTable, addTimestamps, addUrl, referenceTable };
