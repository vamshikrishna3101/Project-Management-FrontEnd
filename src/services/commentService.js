import api from './api';

const commentService = {
  addComment: async (taskId, content) => {
    const response = await api.post('/api/comments', { taskId, content });
    return response.data;
  },

  getCommentsByTask: async (taskId) => {
    const response = await api.get(`/api/comments/task/${taskId}`);
    return response.data;
  },

  updateComment: async (id, content) => {
    const response = await api.put(`/api/comments/${id}`, { content });
    return response.data;
  },

  deleteComment: async (id) => {
    await api.delete(`/api/comments/${id}`);
  },
};

export default commentService;