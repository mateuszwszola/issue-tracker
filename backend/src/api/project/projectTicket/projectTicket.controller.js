import { Project } from '../project.model';

const getProjectTickets = async (req, res) => {
  const { cursor = 0, limit = 100, select } = req.query;
};

const addProjectTicket = async (req, res) => {
  const { projectId } = req.params;

  const ticket = await Project.relatedQuery('tickets')
    .for(projectId)
    .insert(req.body);

  return res.status(200).json({ ticket });
};

export { getProjectTickets, addProjectTicket };
