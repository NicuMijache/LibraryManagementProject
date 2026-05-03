using LibraryManagement.API.DTOs.Requests;
using LibraryManagement.API.DTOs.Responses;

namespace LibraryManagement.API.Services;

public interface IAuthorService
{
    Task<IEnumerable<AuthorResponseDto>> GetAllAsync(CancellationToken ct = default);
    Task<AuthorResponseDto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<AuthorResponseDto> CreateAsync(AuthorCreateUpdateDto dto, CancellationToken ct = default);
    Task UpdateAsync(int id, AuthorCreateUpdateDto dto, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
    Task<bool> ExistsAsync(int id, CancellationToken ct = default);
    Task<bool> IsDuplicateAsync(string firstName, string lastName, int? excludeId = null, CancellationToken ct = default);
    Task<bool> HasBooksAsync(int id, CancellationToken ct = default);
}
