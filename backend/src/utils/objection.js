import { Model } from 'objection';

function createBelongsToOneRelation(
  modelClass,
  tableA,
  tableB,
  tableAColumn,
  tableBColumn = 'id'
) {
  return {
    relation: Model.BelongsToOneRelation,
    modelClass,
    join: {
      from: `${tableA}.${tableAColumn}`,
      to: `${tableB}.${tableBColumn}`,
    },
  };
}

export { createBelongsToOneRelation };
