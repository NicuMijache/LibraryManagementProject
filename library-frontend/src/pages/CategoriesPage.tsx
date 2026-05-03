import { useEffect, useState } from 'react';
import type { Category, CategoryCreateUpdateDto } from '../types';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryCreateUpdateDto>({ name: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = () => getCategories().then(setCategories).catch(() => setError('Failed to load categories.'));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId !== null) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }
      setForm({ name: '' });
      setEditingId(null);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'An error occurred.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'An error occurred.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Book genres &amp; subjects</p>
        </div>
        <span className="record-count">{categories.length} records</span>
      </div>

      {error && <div className="error-msg">⚠ {error}</div>}

      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 200px))' }}>
        <div className="stat-card stat-card-amber">
          <span className="stat-icon">🏷️</span>
          <div className="stat-label">Total Categories</div>
          <div className="stat-value">{categories.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">{editingId !== null ? `Editing #${editingId}` : 'Add New Category'}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>Category Name</label>
              <input placeholder="e.g. Romanian Literature" value={form.name} onChange={e => setForm({ name: e.target.value })} required />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">{editingId !== null ? 'Update' : 'Add Category'}</button>
              {editingId !== null && (
                <button type="button" className="btn btn-ghost" onClick={() => { setEditingId(null); setForm({ name: '' }); }}>Cancel</button>
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
              <th>Name</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={3}>
                <div className="empty-state">
                  <span className="empty-icon">No categories defined yet.</span>
                  <p>Add your first category using the form above.</p>
                </div>
              </td></tr>
            ) : categories.map(c => (
              <tr key={c.id}>
                <td className="td-id">{c.id}</td>
                <td className="title-cell">{c.name}</td>
                <td className="td-actions">
                  <button className="btn btn-edit" onClick={() => { setEditingId(c.id); setForm({ name: c.name }); }}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
