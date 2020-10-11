function createNameTable(knex, tableName, columnName = 'name') {
  return knex.schema.createTable(tableName, (table) => {
    table.increments().notNullable();
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
  foreignColumnName = 'id'
) {
  rootTable.integer(rootTableColumnName).unsigned().notNullable();
  rootTable
    .foreign(rootTableColumnName)
    .references(foreignColumnName)
    .inTable(foreignTableName)
    .onDelete('cascade');
}

export { createNameTable, addTimestamps, addUrl, referenceTable };
