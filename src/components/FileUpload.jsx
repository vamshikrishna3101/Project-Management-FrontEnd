import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getErrorMessage } from '../utils/helpers';

const FileUpload = ({ taskId }) => {
  const [files, setFiles]         = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => { fetchFiles(); }, [taskId]);

  const fetchFiles = async () => {
    try { const res = await api.get(`/api/files/task/${taskId}`); setFiles(Array.isArray(res.data) ? res.data : []); }
    catch (err) { console.error(err); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true); setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/api/files/upload/${taskId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetchFiles();
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setUploading(false); }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Delete this file?')) return;
    try { await api.delete(`/api/files/${fileId}`); setFiles(files.filter(f => f.id !== fileId)); }
    catch (err) { setError(getErrorMessage(err)); }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getIcon = (type) => {
    if (!type) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📕';
    if (type.includes('word') || type.includes('doc')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('zip')) return '🗜️';
    return '📄';
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          📎 Attachments <span style={{ background: 'var(--accent-dim)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 999, fontSize: 12 }}>{files.length}</span>
        </h3>
        <label style={{ background: 'var(--accent)', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          {uploading ? 'Uploading...' : '+ Upload File'}
          <input type="file" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      {error && <div className="alert alert-error">⚠ {error}</div>}
      {files.length === 0 ? <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: 14 }}>No files attached yet</div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {files.map(file => (
            <div key={file.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>{getIcon(file.fileType)}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{file.fileName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatSize(file.fileSize)} • {file.uploadedBy?.name}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => window.open(`http://localhost:8080/api/files/download/${file.id}`, '_blank')} className="btn btn-secondary btn-sm" style={{ fontSize: 12 }}>⬇ Download</button>
                <button onClick={() => handleDelete(file.id)} className="btn btn-danger btn-sm" style={{ fontSize: 12 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
};

export default FileUpload;