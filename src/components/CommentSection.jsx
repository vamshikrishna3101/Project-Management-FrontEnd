import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import commentService from '../services/commentService';
import { formatDate, getErrorMessage } from '../utils/helpers';

const CommentSection = ({ taskId }) => {
  const { user } = useAuth();
  const [comments, setComments]         = useState([]);
  const [content, setContent]           = useState('');
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [editingId, setEditingId]       = useState(null);
  const [editContent, setEditContent]   = useState('');
  const [error, setError]               = useState('');

  useEffect(() => { fetchComments(); }, [taskId]);

  const fetchComments = async () => {
    try {
      const data = await commentService.getCommentsByTask(taskId);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const newComment = await commentService.addComment(taskId, content);
      setComments([newComment, ...comments]);
      setContent('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const updated = await commentService.updateComment(id, editContent);
      setComments(comments.map(c => c.id === id ? updated : c));
      setEditingId(null);
      setEditContent('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await commentService.deleteComment(id);
      setComments(comments.filter(c => c.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{
        fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
        marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        💬 Comments
        <span style={{
          background: 'var(--accent-dim)', color: 'var(--accent)',
          padding: '2px 8px', borderRadius: 999, fontSize: 12,
        }}>
          {comments.length}
        </span>
      </h3>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      {/* Add Comment */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 36, height: 36, background: 'var(--accent)',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 14, fontWeight: 700,
            color: 'white', flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <textarea
              className="form-control"
              placeholder="Write a comment..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={3}
              style={{ marginBottom: 8 }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={submitting || !content.trim()}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : comments.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '32px 20px',
          color: 'var(--text-muted)', fontSize: 14,
        }}>
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {comments.map(comment => (
            <div key={comment.id} style={{
              display: 'flex', gap: 12, padding: 16,
              background: 'var(--bg-secondary)', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
            }}>
              <div style={{
                width: 36, height: 36, background: 'var(--bg-hover)',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 13, fontWeight: 700,
                color: 'var(--accent)', flexShrink: 0,
              }}>
                {comment.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>
                      {comment.user?.name}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  {(comment.user?.id === user?.id || user?.role === 'ADMIN') && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '3px 10px', fontSize: 12 }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '3px 10px', fontSize: 12 }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                {editingId === comment.id ? (
                  <div>
                    <textarea
                      className="form-control"
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      rows={2}
                      style={{ marginBottom: 8 }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(comment.id)} className="btn btn-primary btn-sm">Save</button>
                      <button onClick={() => { setEditingId(null); setEditContent(''); }} className="btn btn-secondary btn-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {comment.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;