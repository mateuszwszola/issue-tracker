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
const router = Router();

/**
 * @route GET /api/v1/tickets?projectId=
 * @desc Get tickets
 * @access Public
 */
router.get('/', [
  parsePageQueryParam(),
  validateOrderByParam(validTicketOrders),
  (req, res, next) => {
    const { projectId } = req.query;
    preloadProject({ projectId, required: false })(req, res, next);
  },
  controllers.getTickets,
]);

/**
 * @route POST /api/v1/tickets
 * @desc Create project ticket
 * @access Admin, Project Manager, Project Engineer
 */
router.post('/', [
  ...authenticate(),
  (req, res, next) => {
    const { project_id: projectId } = req.body;
    preloadProject({ projectId, required: true })(req, res, next);
  },
  checkProjectEngineer(),
  checkProjectManager(),
  checkAdmin(),
  authorize(ROLES.project_engineer, ROLES.project_manager, ROLES.admin),
  createTicketSchema,
  controllers.createTicket,
]);

/**
 * @route /api/v1/tickets/:ticketId
 */
router.use('/:ticketId', (req, res, next) => {
  const { ticketId } = req.params;
  preloadTicket({ ticketId, required: true })(req, res, next);
});

/**
 * @route GET /api/v1/tickets/:ticketId
 * @desc Get ticket
 * @access Public
 */
router.get('/:ticketId', controllers.getTicket);

/**
 * @route PATCH / DELETE /api/v1/tickets/:ticketId
 */
router.use('/:ticketId', [
  ...authenticate(),
  (req, res, next) => {
    const { project_id: projectId } = req.ticket;
    preloadProject({ projectId, required: true })(req, res, next);
  },
  checkProjectEngineer(),
  checkProjectManager(),
  checkAdmin(),
]);

/**
 * @route PATCH /api/v1/tickets/:ticketId
 * @desc Update ticket
 * @access Admin, Project Manager, Project Engineer
 */
router.patch('/:ticketId', [
  authorize(ROLES.project_engineer, ROLES.project_manager, ROLES.admin),
  updateTicketSchema,
  controllers.updateTicket,
]);

/**
 * @route DELETE /api/v1/tickets/:ticketId
 * @desc  Delete ticket
 * @access Admin, Project Manager, Ticket Owner
 */
router.delete('/:ticketId', [
  authorize(ROLES.project_manager, ROLES.admin),
  controllers.deleteTicket,
]);

export default router;
