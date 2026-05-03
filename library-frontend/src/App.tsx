import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import AuthorsPage from './pages/AuthorsPage';
import CategoriesPage from './pages/CategoriesPage';
import BooksPage from './pages/BooksPage';
import LoansPage from './pages/LoansPage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <NavLink to="/authors">Authors</NavLink>
        <NavLink to="/categories">Categories</NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/loans">Loans</NavLink>
      </nav>
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<BooksPage />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/loans" element={<LoansPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
