import { isEmpty } from 'lodash';
import { ErrorHandler } from '../../../utils/error';
import { createBuilder } from '../../../utils/objection';
import { TicketComment } from './ticketComment.model';

const withAuthorFetched = (query) => {
  return query
    .withGraphFetched('[author]')
    .modifyGraph('author', createBuilder(['id', 'name', 'picture']));
};

const getComments = async (req, res) => {
  const { ticketId } = req.params;
  const { skip, limit } = req.query;

  const query = TicketComment.query()
    .where('ticket_id', ticketId)
    .offset(skip)
    .limit(limit);

  withAuthorFetched(query);

  return res.json({ comments: await query });
};

const getComment = async (req, res) => {
  const { commentId } = req.params;

  const query = TicketComment.query().findById(commentId);

  withAuthorFetched(query);

  return res.json({ comment: await query });
};

const addComment = async (req, res) => {
  const { ticketId } = req.params;
  const { comment } = req.body;
  const { id: authorId } = req.api_user;

  const query = TicketComment.query()
    .insert({
      ticket_id: Number(ticketId),
      user_id: authorId,
      comment,
    })
    .returning('*');

  withAuthorFetched(query);

  return res.status(201).json({ comment: await query });
};

const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { comment: newComment } = req.body;
  const { id: userId, is_admin: isAdmin } = req.api_user;

  const comment = await TicketComment.query().findById(commentId);

  if (isEmpty(comment)) {
    throw new ErrorHandler(404, `Comment with ${commentId} id not found`);
  }

  if (!isAdmin || comment.user_id !== userId) {
    throw new ErrorHandler(403, `You are not authorized to delete a comment`);
  }

  const query = comment.$query().patch({ comment: newComment }).returning('*');

  withAuthorFetched(query);

  return res.status(200).json({ comment: await query });
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const { id: userId, is_admin: isAdmin } = req.api_user;

  const comment = await TicketComment.query().findById(commentId);

  if (isEmpty(comment)) {
    throw new ErrorHandler(404, `Comment with ${commentId} id not found`);
  }

  if (!isAdmin || comment.user_id !== userId) {
    throw new ErrorHandler(403, `You are not authorized to delete a comment`);
  }

  const query = comment.$query().delete().returning('*');

  withAuthorFetched(query);

  return res.status(200).json({ comment: await query });
};

export { getComments, getComment, addComment, updateComment, deleteComment };
