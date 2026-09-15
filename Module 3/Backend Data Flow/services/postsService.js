const repo = require('./../repository/postsRepo');
const AppError = require('./../utils/AppError');

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000; // a post may only be edited within 24h

exports.getAll = async () => repo.findAll();
exports.create = async ({ authorId, title, body }) => repo.insert({ authorId, title, body });

/**
 * Edit a post only when it exists, belongs to the requesting user, and is
 * still within the 24-hour edit window.
 */
exports.editPost = async (postId, userId, changes) => {
  const post = await repo.findById(postId);
  if (!post) throw new AppError('Post not found', 404);
  if (post.authorId !== userId) {
    throw new AppError('You can only edit your own post', 403);
  }
  if (Date.now() - post.createdAt > EDIT_WINDOW_MS) {
    throw new AppError('Post can no longer be edited', 403);
  }
  return repo.update(postId, changes);
};
