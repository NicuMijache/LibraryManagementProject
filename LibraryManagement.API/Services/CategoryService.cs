using LibraryManagement.API.Data;
using LibraryManagement.API.DTOs.Requests;
using LibraryManagement.API.DTOs.Responses;
using LibraryManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Services;

public class CategoryService(LibraryContext context, ILogger<CategoryService> logger) : ICategoryService
{
    public async Task<IEnumerable<CategoryResponseDto>> GetAllAsync(CancellationToken ct = default)
    {
        var categories = await context.Categories
            .AsNoTracking()
            .ToListAsync(ct);

        return categories.Select(MapToResponse);
    }

    public async Task<CategoryResponseDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var category = await context.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, ct);

        return category is null ? null : MapToResponse(category);
    }

    public async Task<CategoryResponseDto> CreateAsync(CategoryCreateUpdateDto dto, CancellationToken ct = default)
    {
        var category = new Category { Name = dto.Name };

        context.Categories.Add(category);
        await context.SaveChangesAsync(ct);

        logger.LogInformation("Category created with ID {CategoryId}", category.Id);
        return MapToResponse(category);
    }

    public async Task UpdateAsync(int id, CategoryCreateUpdateDto dto, CancellationToken ct = default)
    {
        var category = await context.Categories.FindAsync([id], ct)
            ?? throw new KeyNotFoundException($"Category with ID {id} not found.");

        category.Name = dto.Name;

        await context.SaveChangesAsync(ct);
        logger.LogInformation("Category {CategoryId} updated", id);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var category = await context.Categories.FindAsync([id], ct)
            ?? throw new KeyNotFoundException($"Category with ID {id} not found.");

        context.Categories.Remove(category);
        await context.SaveChangesAsync(ct);
        logger.LogInformation("Category {CategoryId} deleted", id);
    }

    public Task<bool> ExistsAsync(int id, CancellationToken ct = default) =>
        context.Categories.AnyAsync(c => c.Id == id, ct);

    public Task<bool> IsDuplicateAsync(string name, int? excludeId = null, CancellationToken ct = default) =>
        context.Categories.AnyAsync(c =>
            c.Id != (excludeId ?? 0) &&
            EF.Functions.Like(c.Name, name), ct);

    public Task<bool> HasBooksAsync(int id, CancellationToken ct = default) =>
        context.Books.AnyAsync(b => b.CategoryId == id, ct);

    private static CategoryResponseDto MapToResponse(Category category) => new()
    {
        Id = category.Id,
        Name = category.Name
    };
}
