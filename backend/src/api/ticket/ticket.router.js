import { Router } from 'express';
import {
  authenticate,
  authorize,
  checkAdmin,
  checkProjectEngineer,
  checkProjectManager,
} from '../../middlewares/auth';
import {
  parsePageQueryParam,
  validateOrderByParam,
} from '../../middlewares/queryParams';
import { preloadTicket } from '../../middlewares/ticket';
import { preloadProject } from '../../middlewares/project';
import * as controllers from './ticket.controller';
import { validTicketOrders } from '../../constants/ticket';
import { createTicketSchema, updateTicketSchema } from '../../utils/ticket';
import { ROLES } from '../../constants/roles';
import registerCommentRoutes from './ticketComment/ticketComment.routes';
import registerAttachmentRoutes from './ticketAttachment/ticketAttachment.routes';

const router = Router();
/**
 * @route GET /api/tickets/type
 * @desc Get ticket types
 */
router.get('/type', controllers.getTicketTypes);

/**
 * @route GET /api/tickets/status
 * @desc Get ticket statuses
 */
router.get('/status', controllers.getTicketStatuses);

/**
 * @route GET /api/tickets/priority
 * @desc Get ticket priorities
 */
router.get('/priority', controllers.getTicketPriorities);

/**
 * @route GET /api/tickets
 * @desc Get tickets
 * @access Public
 */
router.get(
  '/',
  parsePageQueryParam(),
  validateOrderByParam(validTicketOrders),
  controllers.getTickets
);

/**
 * @route POST /api/tickets
 * @desc Create project ticket
 * @access Private
 */
router.post('/', [
  ...authenticate(),
  (req, res, next) => {
    const { project_id } = req.body;
    preloadProject({ projectId: project_id })(req, res, next);
  },
  checkProjectEngineer(),
  checkProjectManager(),
  checkAdmin(),
  createTicketSchema,
  controllers.createTicket,
]);

/**
 * @route /api/tickets/:ticketId
 */
router.use('/:ticketId', (req, res, next) => {
  const { ticketId } = req.params;
  preloadTicket({ ticketId })(req, res, next);
});

registerCommentRoutes(router);

registerAttachmentRoutes(router);

/**
 * @route GET /api/tickets/:ticketId
 * @desc Get ticket
 * @access Public
 */
router.get('/:ticketId', controllers.getTicket);

/**
 * @route PATCH / DELETE /api/tickets/:ticketId
 */
router.use('/:ticketId', [
  ...authenticate(),
  (req, res, next) => {
    const { project_id: projectId, created_by: createdBy } = req.ticket;
    if (req.api_user.id === createdBy) {
      req.api_user.role = ROLES.owner;
    }
    preloadProject({ projectId })(req, res, next);
  },
  checkProjectEngineer(),
  checkProjectManager(),
  checkAdmin(),
]);

/**
 * @route PATCH /api/tickets/:ticketId
 * @desc Update ticket
 */
router.patch('/:ticketId', [
  authorize(
    ROLES.project_engineer,
    ROLES.project_manager,
    ROLES.admin,
    ROLES.owner
  ),
  updateTicketSchema,
  controllers.updateTicket,
]);

/**
 * @route DELETE /api/tickets/:ticketId
 * @desc  Delete ticket
 */
router.delete('/:ticketId', [
  authorize(
    ROLES.project_engineer,
    ROLES.project_manager,
    ROLES.admin,
    ROLES.owner
  ),
  controllers.deleteTicket,
]);

export default router;
