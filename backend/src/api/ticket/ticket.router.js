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
 * @access Admin, Project Manager, Project Engineer
 */
router.post('/', [
  ...authenticate(),
  (req, res, next) => {
    const { project_id: projectId } = req.body;
    preloadProject({ projectId })(req, res, next);
  },
  checkProjectEngineer(),
  checkProjectManager(),
  checkAdmin(),
  authorize(ROLES.project_engineer, ROLES.project_manager, ROLES.admin),
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
    const { project_id: projectId } = req.ticket;
    preloadProject({ projectId })(req, res, next);
  },
  checkProjectEngineer(),
  checkProjectManager(),
  checkAdmin(),
]);

/**
 * @route PATCH /api/tickets/:ticketId
 * @desc Update ticket
 * @access Admin, Project Manager, Project Engineer
 */
router.patch('/:ticketId', [
  authorize(ROLES.project_engineer, ROLES.project_manager, ROLES.admin),
  updateTicketSchema,
  controllers.updateTicket,
]);

/**
 * @route DELETE /api/tickets/:ticketId
 * @desc  Delete ticket
 * @access Admin, Project Manager, Ticket Owner
 */
router.delete('/:ticketId', [
  authorize(ROLES.project_manager, ROLES.admin),
  controllers.deleteTicket,
]);

export default router;
