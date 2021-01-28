import { authenticate } from '../../../middlewares/auth';
import * as controllers from './ticketAttachment.controller';
import { createTicketAttachmentSchema } from '../../../utils/ticket';

export default (router) => {
  router.get(
    '/:ticketId/attachment/sign-s3',
    ...authenticate(),
    controllers.signTicketAttachment
  );

  router.get('/:ticketId/attachment', controllers.getTicketAttachments);

  router.post(
    '/:ticketId/attachment',
    ...authenticate(),
    createTicketAttachmentSchema,
    controllers.addTicketAttachment
  );

  router.delete(
    '/:ticketId/attachment/:attachmentId',
    ...authenticate(),
    controllers.deleteTicketAttachment
  );
};
