import { Project } from '../project.model';

const getProjectTickets = async (req, res) => {
  const { cursor = 0, limit = 100, select, orderBy = 'id' } = req.query;
  const { projectId } = req.params;

  const query = Project.relatedQuery('tickets')
    .for(projectId)
    .offset(parseInt(cursor))
    .limit(parseInt(limit))
    .where('archived_at', null)
    .orderBy(orderBy);

  if (select) {
    query.select(select);
  }

  return res.status(200).json({ tickets: await query });
};

const addProjectTicket = async (req, res) => {
  const { projectId } = req.params;

  const ticket = await Project.relatedQuery('tickets')
    .for(projectId)
    .insert(req.body);

  return res.status(200).json({ ticket });
};

export { getProjectTickets, addProjectTicket };
