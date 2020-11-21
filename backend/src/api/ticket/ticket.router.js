import { Router } from 'express';
import { isProjectEngineer } from '../../middlewares/auth';
import {
  parsePaginationQueryParams,
  validateOrderByParam,
} from '../../middlewares/queryParams';
import * as controllers from './ticket.controller';
import registerTicketEngineerRoutes from './ticketEngineer/ticketEngineer.routes';
import { preloadTicket } from '../../middlewares/ticket';
import { validTicketOrders } from '../../constants/ticket';
import { preloadProject } from '../../middlewares/project';
import { createTicketSchema, updateTicketSchema } from '../../utils/ticket';
const router = Router();

/**
 * @route /api/v1/tickets/:ticketId/engineers?projectId=   TODO: Actually, I can use  a ticket key to get a projectId instead of passing it here as a query string
 * @desc Manage ticket engineers
 */
registerTicketEngineerRoutes(router);

/**
 * @route /api/v1/tickets?projectId=
 * @desc Get and create tickets
 */
router
  .route('/')
  .get(
    parsePaginationQueryParams(),
    validateOrderByParam(validTicketOrders),
    preloadProject(false),
    controllers.getTickets
  )
  .post(isProjectEngineer(), createTicketSchema, controllers.addTicket);

/**
 * @route /api/v1/tickets/:ticketId?projectId= // TODO: The same goes here with a projectId
 * @desc Get, Update and Delete ticket
 */
router
  .route('/:ticketId')
  .get(controllers.getTicket)
  .patch(
    isProjectEngineer(),
    preloadTicket(),
    updateTicketSchema,
    controllers.updateTicket
  )
  .delete(isProjectEngineer(), preloadTicket(), controllers.deleteTicket);

export default router;