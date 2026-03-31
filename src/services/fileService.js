import api from './api';

const fileService = {
  uploadFile: async (taskId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/api/files/upload/${taskId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getFilesByTask: async (taskId) => {
    const response = await api.get(`/api/files/task/${taskId}`);
    return response.data;
  },

  downloadFile: (fileId) => {
    window.open(`http://localhost:8080/api/files/download/${fileId}`, '_blank');
  },

  deleteFile: async (fileId) => {
    await api.delete(`/api/files/${fileId}`);
  },
};

export default fileService;