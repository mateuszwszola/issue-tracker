import * as controllers from './projectType.controller';

export default (router) => {
  /**
   * @route GET /api/projects/type
   * @desc Get project types
   */
  router.get('/type', controllers.getProjectTypes);
};
