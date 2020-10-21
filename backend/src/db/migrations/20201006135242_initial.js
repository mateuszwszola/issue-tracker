import { orderedTableNames } from '../../constants/tableNames';
import createTable from '../../utils/tableCreation';

function runInSequence(arr, cb) {
  return arr.reduce(async (promise, currentValue) => {
    await promise;
    return cb(currentValue);
  }, Promise.resolve());
}

export async function up(knex) {
  await runInSequence(orderedTableNames.reverse(), (table) => {
    if (Array.isArray(table)) {
      return Promise.all(
        table.map((tableName) => createTable[tableName](knex))
      );
    } else {
      return createTable[table](knex);
    }
  });
}

export async function down(knex) {
  await runInSequence(orderedTableNames, (table) => {
    if (Array.isArray(table)) {
      return Promise.all(
        table.map((tableName) => knex.schema.dropTableIfExists(tableName))
      );
    } else {
      return knex.schema.dropTableIfExists(table);
    }
  });
}
