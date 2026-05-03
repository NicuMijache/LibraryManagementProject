import { useEffect, useState } from 'react';
import { Author, AuthorCreateUpdateDto } from '../types';
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

  const handleEdit = (author: Author) => {
    setEditingId(author.id);
    setForm({ firstName: author.firstName, lastName: author.lastName });
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
    <div>
      <h1>Authors</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="First name"
          value={form.firstName}
          onChange={e => setForm({ ...form, firstName: e.target.value })}
          required
        />
        <input
          placeholder="Last name"
          value={form.lastName}
          onChange={e => setForm({ ...form, lastName: e.target.value })}
          required
        />
        <button type="submit">{editingId !== null ? 'Update' : 'Add'}</button>
        {editingId !== null && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ firstName: '', lastName: '' }); }}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {authors.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.fullName}</td>
              <td>
                <button onClick={() => handleEdit(a)}>Edit</button>
                <button onClick={() => handleDelete(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
