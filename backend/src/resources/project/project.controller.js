import db from '../../db';
import tableNames from '../../constants/tableNames';

const getProjects = async (req, res) => {
  const results = await db.select('*').from(tableNames.project).limit(100);

  res.status(200).json({ projects: results });
};

export { getProjects };
