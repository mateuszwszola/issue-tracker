import { authenticate } from '../../../middlewares/auth';
import * as controllers from './ticketAttachment.controller';

export default (router) => {
  router.get(
    '/attachment/sign-s3',
    ...authenticate(),
    controllers.signTicketAttachment
  );
};
