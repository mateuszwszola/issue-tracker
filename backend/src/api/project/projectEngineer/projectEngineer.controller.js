import { Project } from '../project.model';
import tableNames from '../../../constants/tableNames';
import { ErrorHandler } from '../../../utils/error';
import { validUserOrders } from '../../../constants/user';

const getProjectEngineers = async (req, res) => {
  const { projectId } = req.params;
  const { cursor, limit, select } = req.query;
  let { orderBy } = req.query;

  orderBy = orderBy ? String(orderBy).toLowerCase() : 'id';

  if (!validUserOrders.has(orderBy)) {
    throw new ErrorHandler(400, 'Invalid orderBy param');
  }

  const query = Project.relatedQuery('engineers')
    .modify('defaultSelects')
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

/**
  @desc Add existing user to a project as a project engineer
*/
const addProjectEngineer = async (req, res) => {
  const { projectId, userId } = req.params;

  const numRelated = await Project.relatedQuery('engineers')
    .for(projectId)
    .relate(userId);

  return res.status(200).json({ message: numRelated });
};

/**
  @desc Remove existing project engineer (user) from a project
*/
const deleteProjectEngineer = async (req, res) => {
  const { projectId, userId } = req.params;

  const numUnrelated = await Project.relatedQuery('engineers')
    .for(projectId)
    .unrelate()
    .where(`${tableNames.user}.id`, userId);

  return res.status(200).json({ message: numUnrelated });
};

export { getProjectEngineers, addProjectEngineer, deleteProjectEngineer };
