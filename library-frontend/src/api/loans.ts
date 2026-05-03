import { Loan, LoanCreateDto } from '../types';
import apiClient from './client';

export const getLoans = () => apiClient.get<Loan[]>('/loans').then(r => r.data);
export const createLoan = (dto: LoanCreateDto) => apiClient.post<Loan>('/loans', dto).then(r => r.data);
export const returnBook = (loanId: number) => apiClient.put(`/loans/${loanId}/return`).then(r => r.data);
