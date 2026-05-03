import type { Category, CategoryCreateUpdateDto } from '../types';
import apiClient from './client';

export const getCategories = () => apiClient.get<Category[]>('/categories').then(r => r.data);
export const getCategory = (id: number) => apiClient.get<Category>(`/categories/${id}`).then(r => r.data);
export const createCategory = (dto: CategoryCreateUpdateDto) => apiClient.post<Category>('/categories', dto).then(r => r.data);
export const updateCategory = (id: number, dto: CategoryCreateUpdateDto) => apiClient.put(`/categories/${id}`, dto);
export const deleteCategory = (id: number) => apiClient.delete(`/categories/${id}`);
