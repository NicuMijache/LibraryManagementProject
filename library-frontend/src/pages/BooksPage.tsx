import { useEffect, useState } from 'react';
import type { Book, BookCreateUpdateDto, Author, Category } from '../types';
import { getBooks, createBook, updateBook, deleteBook } from '../api/books';
import { getAuthors } from '../api/authors';
import { getCategories } from '../api/categories';

const emptyForm: BookCreateUpdateDto = { title: '', price: 0, authorId: 0, categoryId: 0 };

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<BookCreateUpdateDto>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = () => {
    getBooks().then(setBooks).catch(() => setError('Failed to load books.'));
    getAuthors().then(setAuthors);
    getCategories().then(setCategories);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId !== null) {
        await updateBook(editingId, form);
      } else {
        await createBook(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'An error occurred.');
    }
  };

  const handleEdit = (book: Book) => {
    setEditingId(book.id);
    setForm({ title: book.title, price: book.price, authorId: book.authorId, categoryId: book.categoryId });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this book?')) return;
    try {
      await deleteBook(id);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'An error occurred.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Books</h1>
          <p>Library catalogue</p>
        </div>
        <span className="record-count">{books.length} records</span>
      </div>

      {error && <div className="error-msg">⚠ {error}</div>}

      <div className="stats-row">
        <div className="stat-card stat-card-blue">
          <span className="stat-icon">📚</span>
          <div className="stat-label">Total Books</div>
          <div className="stat-value">{books.length}</div>
        </div>
        <div className="stat-card stat-card-green">
          <span className="stat-icon">✅</span>
          <div className="stat-label">Available</div>
          <div className="stat-value">{books.filter(b => b.isAvailable).length}</div>
        </div>
        <div className="stat-card stat-card-red">
          <span className="stat-icon">🔄</span>
          <div className="stat-label">On Loan</div>
          <div className="stat-value">{books.filter(b => !b.isAvailable).length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">{editingId !== null ? `Editing #${editingId}` : 'Add New Book'}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field" style={{ flex: 2, minWidth: 200 }}>
              <label>Title</label>
              <input
                placeholder="Book title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="form-field" style={{ maxWidth: 105 }}>
              <label>Price €</label>
              <input
                type="number"
                placeholder="0.00"
                value={form.price || ''}
                min={0.01}
                step={0.01}
                onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="form-field">
              <label>Author</label>
              <select value={form.authorId} onChange={e => setForm({ ...form, authorId: parseInt(e.target.value) })} required>
                <option value={0} disabled>Select author</option>
                {authors.map(a => <option key={a.id} value={a.id}>{a.fullName}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Category</label>
              <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: parseInt(e.target.value) })} required>
                <option value={0} disabled>Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId !== null ? 'Update' : 'Add Book'}
              </button>
              {editingId !== null && (
                <button type="button" className="btn btn-ghost" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                  Cancel
                </button>
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
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr><td colSpan={7}>
                <div className="empty-state">
                  <span className="empty-icon">No books in the catalogue yet.</span>
                  <p>Add your first book using the form above.</p>
                </div>
              </td></tr>
            ) : books.map(b => (
              <tr key={b.id}>
                <td className="td-id">{b.id}</td>
                <td className="title-cell">{b.title}</td>
                <td className="td-muted">{b.authorFullName}</td>
                <td className="td-muted">{b.categoryName}</td>
                <td><span className="price">€{b.price.toFixed(2)}</span></td>
                <td>
                  {b.isAvailable
                    ? <span className="badge badge-available">Available</span>
                    : <span className="badge badge-loaned">On Loan</span>}
                </td>
                <td className="td-actions">
                  <button className="btn btn-edit" onClick={() => handleEdit(b)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(b.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
