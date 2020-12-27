import { ProjectType } from './projectType.model';

const getProjectTypes = async (req, res) => {
  const types = await ProjectType.query().modify('defaultSelects');

  return res.status(200).json({ types });
};

export { getProjectTypes };
