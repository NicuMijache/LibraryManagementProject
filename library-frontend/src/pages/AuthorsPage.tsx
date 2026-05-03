import { useEffect, useState } from 'react';
import type { Author, AuthorCreateUpdateDto } from '../types';
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from '../api/authors';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [form, setForm] = useState<AuthorCreateUpdateDto>({ firstName: '', lastName: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = () => getAuthors().then(setAuthors).catch(() => setError('Failed to load authors.'));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId !== null) {
        await updateAuthor(editingId, form);
      } else {
        await createAuthor(form);
      }
      setForm({ firstName: '', lastName: '' });
      setEditingId(null);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'An error occurred.');
    }
  };

  const handleEdit = (a: Author) => {
    setEditingId(a.id);
    setForm({ firstName: a.firstName, lastName: a.lastName });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this author?')) return;
    try {
      await deleteAuthor(id);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'An error occurred.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Authors</h1>
          <p>Author records</p>
        </div>
        <span className="record-count">{authors.length} records</span>
      </div>

      {error && <div className="error-msg">⚠ {error}</div>}

      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 200px))' }}>
        <div className="stat-card stat-card-violet">
          <span className="stat-icon">✏️</span>
          <div className="stat-label">Total Authors</div>
          <div className="stat-value">{authors.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">{editingId !== null ? `Editing #${editingId}` : 'Add New Author'}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>First Name</label>
              <input placeholder="First name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
            </div>
            <div className="form-field">
              <label>Last Name</label>
              <input placeholder="Last name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">{editingId !== null ? 'Update' : 'Add Author'}</button>
              {editingId !== null && (
                <button type="button" className="btn btn-ghost" onClick={() => { setEditingId(null); setForm({ firstName: '', lastName: '' }); }}>Cancel</button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.length === 0 ? (
              <tr><td colSpan={3}>
                <div className="empty-state">
                  <span className="empty-icon">No authors on record yet.</span>
                  <p>Add your first author using the form above.</p>
                </div>
              </td></tr>
            ) : authors.map(a => (
              <tr key={a.id}>
                <td className="td-id">{a.id}</td>
                <td className="title-cell">{a.fullName}</td>
                <td className="td-actions">
                  <button className="btn btn-edit" onClick={() => handleEdit(a)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(a.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
