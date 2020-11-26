import { Model } from 'objection';

const createBelongsToOneRelation = (
  modelClass,
  tableA,
  tableB,
  tableAColumn,
  tableBColumn = 'id'
) => ({
  relation: Model.BelongsToOneRelation,
  modelClass,
  join: {
    from: `${tableA}.${tableAColumn}`,
    to: `${tableB}.${tableBColumn}`,
  },
});

/**
 * @desc Creates modify graph builder which accepts properties to select from a query
 */
const createBuilder = (select) => (builder) => {
  if (!Array.isArray(select)) {
    select = [select];
  }

  builder.select(...select);
};

export { createBelongsToOneRelation, createBuilder };
