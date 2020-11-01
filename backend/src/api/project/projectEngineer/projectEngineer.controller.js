import { Project } from '../project.model';
import tableNames from '../../../constants/tableNames';

const getProjectEngineers = async (req, res) => {
  const { cursor = 0, limit = 100, select, orderBy = 'id' } = req.query;
  const { projectId } = req.params;

  const query = Project.relatedQuery('engineers')
    .for(projectId)
    .offset(parseInt(cursor))
    .limit(parseInt(limit))
    .orderBy(orderBy);

  if (select) {
    query.select(select);
  }

  const result = await query;

  return res.status(200).json({ engineers: result });
};

/*
  Add existing user to a project as a project engineer
*/
const addProjectEngineer = async (req, res) => {
  const { projectId, userId } = req.params;

  const numRelated = await Project.relatedQuery('engineers')
    .for(projectId)
    .relate(userId);

  return res.status(200).json({ message: numRelated });
};

/*
  Remove existing project engineer (user) from a project
*/
const deleteProjectEnginner = async (req, res) => {
  const { projectId, userId } = req.params;

  const numUnrelated = await Project.relatedQuery('engineers')
    .for(projectId)
    .unrelate()
    .where(`${tableNames.user}.id`, userId);

  return res.status(200).json({ message: numUnrelated });
};

export { getProjectEngineers, addProjectEngineer, deleteProjectEnginner };
