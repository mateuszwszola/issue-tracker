import * as controllers from './ticketComment.controller';
import { parsePageQueryParam } from '../../../middlewares/queryParams';
import { authenticate } from '../../../middlewares/auth';

export default (router) => {
  /**
   * @route GET /api/tickets/:ticketId/comments
   * @desc Get ticket comments
   */
  router.get(
    '/:ticketId/comments',
    parsePageQueryParam(),
    controllers.getComments
  );

  /**
   * @route GET /api/tickets/:ticketId/comments/:commentId
   * @desc Get a single comment
   */
  router.get('/:ticketId/comments/:commentId', controllers.getComment);

  /**
   * @route POST /api/tickets/:ticketId/comments
   * @desc Add a comment
   */
  router.post('/:ticketId/comments', ...authenticate(), controllers.addComment);

  /**
   * @route PATCH /api/tickets/:ticketId/comments/:commentId
   * @desc Update a comment
   */
  router.patch(
    '/:ticketId/comments/:commentId',
    ...authenticate(),
    controllers.updateComment
  );

  /**
   * @route DELETE /api/tickets/:ticketId/comments/:commentId
   * @desc Delete a comment
   */
  router.delete(
    '/:ticketId/comments/:commentId',
    ...authenticate(),
    controllers.deleteComment
  );
};
