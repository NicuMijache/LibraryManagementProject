using LibraryManagement.API.DTOs.Requests;
using LibraryManagement.API.DTOs.Responses;

namespace LibraryManagement.API.Services;

public interface ICategoryService
{
    Task<IEnumerable<CategoryResponseDto>> GetAllAsync(CancellationToken ct = default);
    Task<CategoryResponseDto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<CategoryResponseDto> CreateAsync(CategoryCreateUpdateDto dto, CancellationToken ct = default);
    Task UpdateAsync(int id, CategoryCreateUpdateDto dto, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
    Task<bool> ExistsAsync(int id, CancellationToken ct = default);
    Task<bool> IsDuplicateAsync(string name, int? excludeId = null, CancellationToken ct = default);
    Task<bool> HasBooksAsync(int id, CancellationToken ct = default);
}
