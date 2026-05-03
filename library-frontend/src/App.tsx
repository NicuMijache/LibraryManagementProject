import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import AuthorsPage from './pages/AuthorsPage';
import CategoriesPage from './pages/CategoriesPage';
import BooksPage from './pages/BooksPage';
import LoansPage from './pages/LoansPage';
import './index.css';

const nav = [
  { to: '/books',      icon: '📚', label: 'Books'      },
  { to: '/authors',    icon: '✏️',  label: 'Authors'    },
  { to: '/categories', icon: '🏷️',  label: 'Categories' },
  { to: '/loans',      icon: '🔄',  label: 'Loans'      },
];

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">📖</div>
            <div>
              <h1>Biblioteca</h1>
              <p>Management System</p>
            </div>
          </div>
          <nav className="sidebar-nav">
            {nav.map(({ to, icon, label }) => (
              <NavLink key={to} to={to}>
                <span className="nav-icon">{icon}</span>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-footer">Library v1.0</div>
        </aside>

        <main className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/books" replace />} />
            <Route path="/books"      element={<BooksPage />} />
            <Route path="/authors"    element={<AuthorsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/loans"      element={<LoansPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
