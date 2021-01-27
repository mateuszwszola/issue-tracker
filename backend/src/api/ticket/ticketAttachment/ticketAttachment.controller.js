import { aws, S3_BUCKET } from '../../../lib/aws';
import { nanoid } from 'nanoid';

export const signTicketAttachment = async (req, res) => {
  const s3 = new aws.S3();
  const fileType = req.query['file-type'];
  // Generate random key for an image
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
