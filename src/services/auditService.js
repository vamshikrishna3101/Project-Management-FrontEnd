import api from './api';

const auditService = {
  getAllLogs: async () => {
    const response = await api.get('/api/audit');
    return response.data;
  },

  getLogsForEntity: async (type, id) => {
    const response = await api.get(`/api/audit/entity/${type}/${id}`);
    return response.data;
  },

  getLogsByUser: async (userId) => {
    const response = await api.get(`/api/audit/user/${userId}`);
    return response.data;
  },
};

export default auditService;