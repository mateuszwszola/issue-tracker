import { Project } from '../project.model';
import tableNames from '../../../constants/tableNames';
import { ErrorHandler } from '../../../utils/error';

const getProjectEngineers = async (req, res) => {
  const { projectId } = req.params;
  const { skip, limit, orderBy } = req.query;

  const engineers = await Project.relatedQuery('engineers')
    .modify('defaultSelects')
    .for(projectId)
    .offset(skip)
    .limit(limit)
    .orderBy(orderBy);

  return res.status(200).json({ engineers });
};

const getProjectEngineer = async (req, res) => {
  const { projectId, userId } = req.params;

  const engineer = await Project.relatedQuery('engineers')
    .modify('defaultSelects')
    .for(projectId)
    .findById(userId);

  if (!engineer) {
    throw new ErrorHandler(404, 'Engineer not found');
  }

  return res.status(200).json({ engineer });
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

export {
  getProjectEngineers,
  getProjectEngineer,
  addProjectEngineer,
  deleteProjectEngineer,
};
