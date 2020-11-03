import { Project } from '../project.model';
import tableNames from '../../../constants/tableNames';
import { ErrorHandler } from '../../../utils/error';

const getProjectEngineers = async (req, res) => {
  const { projectId } = req.params;
  const { cursor, limit, select } = req.query;
  let { orderBy } = req.query;

  orderBy = orderBy ? orderBy.toLowerCase() : 'id';

  const query = Project.relatedQuery('engineers')
    .for(projectId)
    .offset(cursor)
    .limit(limit)
    .orderBy(orderBy);

  if (select) {
    query.select(select);
  }

  const result = await query;

  if (!result) {
    throw new ErrorHandler(404, 'Project not found');
  }

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
