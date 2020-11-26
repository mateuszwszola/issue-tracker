import { Project } from '../project.model';
import tableNames from '../../../constants/tableNames';

const getProjectEngineers = async (req, res) => {
  const { projectId } = req.params;
  const { page, pageSize, orderBy } = req.query;

  const engineers = await Project.relatedQuery('engineers')
    .modify('defaultSelects')
    .for(projectId)
    .page(page, pageSize)
    .orderBy(orderBy);

  return res.status(200).json({ engineers });
};

const addProjectEngineer = async (req, res) => {
  const { projectId, userId } = req.params;

  const numRelated = await Project.relatedQuery('engineers')
    .for(projectId)
    .relate(userId);

  return res.status(200).json({ message: numRelated });
};

const deleteProjectEngineer = async (req, res) => {
  const { projectId, userId } = req.params;

  const numUnrelated = await Project.relatedQuery('engineers')
    .for(projectId)
    .unrelate()
    .where(`${tableNames.user}.id`, userId);

  return res.status(200).json({ message: numUnrelated });
};

export { getProjectEngineers, addProjectEngineer, deleteProjectEngineer };
