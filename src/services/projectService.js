import api from './api';

const projectService = {
  getAllProjects: async () => {
    const response = await api.get('/api/projects');
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/api/projects', projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/api/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    await api.delete(`/api/projects/${id}`);
  },

  searchProjects: async (keyword) => {
    const response = await api.get(`/api/projects/search?keyword=${keyword}`);
    return response.data;
  },

  addMember: async (projectId, userId) => {
    const response = await api.post(`/api/projects/${projectId}/members/${userId}`);
    return response.data;
  },

  removeMember: async (projectId, userId) => {
    const response = await api.delete(`/api/projects/${projectId}/members/${userId}`);
    return response.data;
  },
};

export default projectService;
