using LibraryManagement.API.DTOs.Requests;
using LibraryManagement.API.DTOs.Responses;

namespace LibraryManagement.API.Services;

public interface IBookService
{
    Task<IEnumerable<BookResponseDto>> GetAllAsync(CancellationToken ct = default);
    Task<BookResponseDto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<BookResponseDto> CreateAsync(BookCreateUpdateDto dto, CancellationToken ct = default);
    Task UpdateAsync(int id, BookCreateUpdateDto dto, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
    Task<bool> ExistsAsync(int id, CancellationToken ct = default);
    Task<bool> HasActiveLoansAsync(int id, CancellationToken ct = default);
}
