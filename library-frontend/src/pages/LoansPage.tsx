import { useEffect, useState } from 'react';
import { Loan, LoanCreateDto, Book } from '../types';
import { getLoans, createLoan, returnBook } from '../api/loans';
import { getBooks } from '../api/books';

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<LoanCreateDto>({ borrowerName: '', bookId: 0 });
  const [error, setError] = useState('');

  const load = () => {
    getLoans().then(setLoans).catch(() => setError('Failed to load loans.'));
    getBooks().then(books => setAvailableBooks(books.filter(b => b.isAvailable)));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createLoan(form);
      setForm({ borrowerName: '', bookId: 0 });
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'An error occurred.');
    }
  };

  const handleReturn = async (loanId: number) => {
    try {
      await returnBook(loanId);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'An error occurred.');
    }
  };

  return (
    <div>
      <h1>Loans</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Borrower name"
          value={form.borrowerName}
          onChange={e => setForm({ ...form, borrowerName: e.target.value })}
          required
        />
        <select value={form.bookId} onChange={e => setForm({ ...form, bookId: parseInt(e.target.value) })} required>
          <option value={0} disabled>Select book</option>
          {availableBooks.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
        </select>
        <button type="submit">Borrow</button>
      </form>

      <table>
        <thead>
          <tr><th>ID</th><th>Borrower</th><th>Book</th><th>Loan Date</th><th>Return Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {loans.map(l => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.borrowerName}</td>
              <td>{l.bookTitle}</td>
              <td>{new Date(l.loanDate).toLocaleDateString()}</td>
              <td>{l.returnDate ? new Date(l.returnDate).toLocaleDateString() : '—'}</td>
              <td>
                {!l.isReturned && (
                  <button onClick={() => handleReturn(l.id)}>Return</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
