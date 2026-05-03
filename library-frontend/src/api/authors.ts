import { Author, AuthorCreateUpdateDto } from '../types';
import apiClient from './client';

export const getAuthors = () => apiClient.get<Author[]>('/authors').then(r => r.data);
export const getAuthor = (id: number) => apiClient.get<Author>(`/authors/${id}`).then(r => r.data);
export const createAuthor = (dto: AuthorCreateUpdateDto) => apiClient.post<Author>('/authors', dto).then(r => r.data);
export const updateAuthor = (id: number, dto: AuthorCreateUpdateDto) => apiClient.put(`/authors/${id}`, dto);
export const deleteAuthor = (id: number) => apiClient.delete(`/authors/${id}`);
