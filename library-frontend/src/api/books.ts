import { Book, BookCreateUpdateDto } from '../types';
import apiClient from './client';

export const getBooks = () => apiClient.get<Book[]>('/books').then(r => r.data);
export const getBook = (id: number) => apiClient.get<Book>(`/books/${id}`).then(r => r.data);
export const createBook = (dto: BookCreateUpdateDto) => apiClient.post<Book>('/books', dto).then(r => r.data);
export const updateBook = (id: number, dto: BookCreateUpdateDto) => apiClient.put(`/books/${id}`, dto);
export const deleteBook = (id: number) => apiClient.delete(`/books/${id}`);
