import { Project } from '../project.model';
import tableNames from '../../../constants/tableNames';

const getProjectEngineers = async (req, res) => {
  const { projectId } = req.params;

  const result = await Project.relatedQuery('engineer').for(projectId);

  return res.status(200).json({ engineers: result });
};

/*
  Add existing user to a project as a project engineer
*/
const addProjectEngineer = async (req, res) => {
  const { projectId, userId } = req.params;

  const numRelated = await Project.relatedQuery('engineer')
    .for(projectId)
    .relate(userId);

  return res.status(200).json({ message: numRelated });
};

/*
  Remove existing project engineer (user) from a project
*/
const deleteProjectEnginner = async (req, res) => {
  const { projectId, userId } = req.params;

  const numUnrelated = await Project.relatedQuery('engineer')
    .for(projectId)
    .unrelate()
    .where(`${tableNames.user}.id`, userId);

  return res.status(200).json({ message: numUnrelated });
};

export { getProjectEngineers, addProjectEngineer, deleteProjectEnginner };
