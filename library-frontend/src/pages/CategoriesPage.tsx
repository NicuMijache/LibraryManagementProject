import { useEffect, useState } from 'react';
import { Category, CategoryCreateUpdateDto } from '../types';
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

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name });
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
    <div>
      <h1>Categories</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Category name"
          value={form.name}
          onChange={e => setForm({ name: e.target.value })}
          required
        />
        <button type="submit">{editingId !== null ? 'Update' : 'Add'}</button>
        {editingId !== null && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: '' }); }}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
