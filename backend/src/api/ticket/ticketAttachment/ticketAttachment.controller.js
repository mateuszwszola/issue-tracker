import { aws, S3_BUCKET } from '../../../lib/aws';
import { nanoid } from 'nanoid';
import { Ticket } from '../ticket.model';
import { ErrorHandler } from '../../../utils/error';
import { Attachment } from './ticketAttachment.model';

export const signTicketAttachment = async (req, res) => {
  const s3 = new aws.S3();
  const fileType = req.query['file-type'];
  // Generate random key for an attachment
  const fileKey = nanoid();

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileKey,
    Expires: 120,
    ContentType: fileType,
    ACL: 'public-read',
  };

  const data = await new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          signedRequest: data,
          url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileKey}`,
        });
      }
    });
  });

  return res.status(200).json({ data });
};

export const getTicketAttachments = async (req, res) => {
  const { ticketId } = req.params;

  const attachments = await Ticket.relatedQuery('attachments').for(ticketId);

  return res.status(200).json({ attachments });
};

export const addTicketAttachment = async (req, res) => {
  const { api_user, ticket } = req;
  const { is_admin, id: userId } = api_user;

  if (!is_admin && userId !== ticket.created_by) {
    throw new ErrorHandler(403, 'Unauthorized to add an attachment');
  }

  const { attachment_url } = req.body;

  const data = {
    ticket_id: Number(ticket.id),
    attachment_url,
  };

  const attachment = await Attachment.query().insert(data).returning('*');

  return res.status(200).json({ attachment });
};

export const deleteTicketAttachment = async (req, res) => {
  const { attachmentId } = req.params;
  const { api_user, ticket } = req;
  const { is_admin, id: userId } = api_user;

  if (!is_admin && userId !== ticket.created_by) {
    throw new ErrorHandler(403, 'Unauthorized to delete an attachment');
  }

  const attachment = await Attachment.query()
    .findById(attachmentId)
    .delete()
    .returning('*');

  return res.status(200).json({ attachment });
};
