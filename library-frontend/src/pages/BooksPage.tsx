import { useEffect, useState } from 'react';
import { Book, BookCreateUpdateDto, Author, Category } from '../types';
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
    <div>
      <h1>Books</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          min={0.01}
          step={0.01}
          onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}
          required
        />
        <select value={form.authorId} onChange={e => setForm({ ...form, authorId: parseInt(e.target.value) })} required>
          <option value={0} disabled>Select author</option>
          {authors.map(a => <option key={a.id} value={a.id}>{a.fullName}</option>)}
        </select>
        <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: parseInt(e.target.value) })} required>
          <option value={0} disabled>Select category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button type="submit">{editingId !== null ? 'Update' : 'Add'}</button>
        {editingId !== null && (
          <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>
        )}
      </form>

      <table>
        <thead>
          <tr><th>ID</th><th>Title</th><th>Price</th><th>Author</th><th>Category</th><th>Available</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.title}</td>
              <td>€{b.price.toFixed(2)}</td>
              <td>{b.authorFullName}</td>
              <td>{b.categoryName}</td>
              <td>{b.isAvailable ? '✓' : '✗'}</td>
              <td>
                <button onClick={() => handleEdit(b)}>Edit</button>
                <button onClick={() => handleDelete(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
