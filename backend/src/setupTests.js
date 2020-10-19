export default async (db) => {
  await db.migrate().rollback();
  await db.migrate().latest();
  await db.seed().run();
};
