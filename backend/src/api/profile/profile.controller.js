import { isEmpty } from 'lodash';
import { ErrorHandler } from '../../utils/error';
import { createBuilder } from '../../utils/objection';
import { User } from '../user/user.model';
import { Project } from '../project/project.model';

const { ref: projectRef } = Project;

const getUserProfiles = async (req, res) => {
  const { skip, limit, orderBy } = req.query;

  const profiles = await User.query()
    .modify('defaultSelects')
    .offset(skip)
    .limit(limit)
    .orderBy(orderBy);

  return res.status(200).json({ profiles });
};

const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { withGraph } = req.query;

  const query = User.query().findById(userId).modify('defaultSelects');

  if (withGraph) {
    query
      .allowGraph('[managedProjects, engineeredProjects]')
      .withGraphFetched(withGraph)
      .modifyGraph(
        'managedProjects',
        createBuilder([projectRef('id'), projectRef('key'), projectRef('name')])
      )
      .modifyGraph(
        'engineeredProjects',
        createBuilder([projectRef('id'), projectRef('key'), projectRef('name')])
      );
  }

  const profile = await query;

  if (isEmpty(profile)) {
    throw new ErrorHandler(404, `Profile not found`);
  }

  return res.status(200).json({ profile });
};

export { getUserProfiles, getUserProfile };
