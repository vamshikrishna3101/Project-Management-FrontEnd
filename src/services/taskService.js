import api from './api';

const taskService = {
  getAllTasks: async () => {
    const response = await api.get('/api/tasks');
    return response.data;
  },

  getMyTasks: async () => {
    const response = await api.get('/api/tasks/my');
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },

  getTasksByProject: async (projectId) => {
    const response = await api.get(`/api/tasks/project/${projectId}`);
    return response.data;
  },

  getTaskStats: async (projectId) => {
    const response = await api.get(`/api/tasks/project/${projectId}/stats`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/api/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    return response.data;
  },

  updateTaskStatus: async (id, status) => {
    const response = await api.patch(`/api/tasks/${id}/status?status=${status}`);
    return response.data;
  },

  deleteTask: async (id) => {
    await api.delete(`/api/tasks/${id}`);
  },
};

export default taskService;
