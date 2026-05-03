export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  price: number;
  isAvailable: boolean;
  authorId: number;
  authorFullName: string;
  categoryId: number;
  categoryName: string;
}

export interface Loan {
  id: number;
  borrowerName: string;
  loanDate: string;
  returnDate: string | null;
  isReturned: boolean;
  bookId: number;
  bookTitle: string;
}

export interface AuthorCreateUpdateDto {
  firstName: string;
  lastName: string;
}

export interface CategoryCreateUpdateDto {
  name: string;
}

export interface BookCreateUpdateDto {
  title: string;
  price: number;
  authorId: number;
  categoryId: number;
}

export interface LoanCreateDto {
  borrowerName: string;
  bookId: number;
}
