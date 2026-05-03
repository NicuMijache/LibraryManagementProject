import { useEffect, useState } from 'react';
import type { Loan, LoanCreateDto, Book } from '../types';
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
    setError('');
    try {
      await returnBook(loanId);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'An error occurred.');
    }
  };

  const active = loans.filter(l => !l.isReturned).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Loans</h1>
          <p>Borrowing records</p>
        </div>
        <span className="record-count">{active} active · {loans.length} total</span>
      </div>

      {error && <div className="error-msg">⚠ {error}</div>}

      <div className="stats-row">
        <div className="stat-card stat-card-amber">
          <span className="stat-icon">🔄</span>
          <div className="stat-label">Active Loans</div>
          <div className="stat-value">{active}</div>
        </div>
        <div className="stat-card stat-card-violet">
          <span className="stat-icon">📋</span>
          <div className="stat-label">Total Loans</div>
          <div className="stat-value">{loans.length}</div>
        </div>
        <div className="stat-card stat-card-green">
          <span className="stat-icon">✔️</span>
          <div className="stat-label">Returned</div>
          <div className="stat-value">{loans.filter(l => l.isReturned).length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">New Loan</div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>Borrower Name</label>
              <input placeholder="Full name" value={form.borrowerName} onChange={e => setForm({ ...form, borrowerName: e.target.value })} required />
            </div>
            <div className="form-field" style={{ flex: 2 }}>
              <label>Book</label>
              <select value={form.bookId} onChange={e => setForm({ ...form, bookId: parseInt(e.target.value) })} required>
                <option value={0} disabled>Select available book</option>
                {availableBooks.map(b => (
                  <option key={b.id} value={b.id}>{b.title} — {b.authorFullName}</option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Borrow</button>
            </div>
          </div>
        </form>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Borrower</th>
              <th>Book</th>
              <th>Loaned</th>
              <th>Returned</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 ? (
              <tr><td colSpan={7}>
                <div className="empty-state">
                  <span className="empty-icon">No loans recorded yet.</span>
                  <p>Issue the first loan using the form above.</p>
                </div>
              </td></tr>
            ) : loans.map(l => (
              <tr key={l.id}>
                <td className="td-id">{l.id}</td>
                <td style={{ fontWeight: 500 }}>{l.borrowerName}</td>
                <td className="title-cell">{l.bookTitle}</td>
                <td className="td-muted" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {new Date(l.loanDate).toLocaleDateString('ro-RO')}
                </td>
                <td className="td-muted" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {l.returnDate ? new Date(l.returnDate).toLocaleDateString('ro-RO') : '—'}
                </td>
                <td>
                  {l.isReturned
                    ? <span className="badge badge-returned">Returned</span>
                    : <span className="badge badge-active">Active</span>}
                </td>
                <td className="td-actions">
                  {!l.isReturned && (
                    <button className="btn btn-return" onClick={() => handleReturn(l.id)}>Return</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
