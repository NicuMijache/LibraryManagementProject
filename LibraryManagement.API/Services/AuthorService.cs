using LibraryManagement.API.Data;
using LibraryManagement.API.DTOs.Requests;
using LibraryManagement.API.DTOs.Responses;
using LibraryManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Services;

public class AuthorService(LibraryContext context, ILogger<AuthorService> logger) : IAuthorService
{
    public async Task<IEnumerable<AuthorResponseDto>> GetAllAsync(CancellationToken ct = default)
    {
        var authors = await context.Authors
            .AsNoTracking()
            .ToListAsync(ct);

        return authors.Select(MapToResponse);
    }

    public async Task<AuthorResponseDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var author = await context.Authors
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id, ct);

        return author is null ? null : MapToResponse(author);
    }

    public async Task<AuthorResponseDto> CreateAsync(AuthorCreateUpdateDto dto, CancellationToken ct = default)
    {
        var author = new Author
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName
        };

        context.Authors.Add(author);
        await context.SaveChangesAsync(ct);

        logger.LogInformation("Author created with ID {AuthorId}", author.Id);
        return MapToResponse(author);
    }

    public async Task UpdateAsync(int id, AuthorCreateUpdateDto dto, CancellationToken ct = default)
    {
        var author = await context.Authors.FindAsync([id], ct)
            ?? throw new KeyNotFoundException($"Author with ID {id} not found.");

        author.FirstName = dto.FirstName;
        author.LastName = dto.LastName;

        await context.SaveChangesAsync(ct);
        logger.LogInformation("Author {AuthorId} updated", id);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var author = await context.Authors.FindAsync([id], ct)
            ?? throw new KeyNotFoundException($"Author with ID {id} not found.");

        context.Authors.Remove(author);
        await context.SaveChangesAsync(ct);
        logger.LogInformation("Author {AuthorId} deleted", id);
    }

    public Task<bool> ExistsAsync(int id, CancellationToken ct = default) =>
        context.Authors.AnyAsync(a => a.Id == id, ct);

    public Task<bool> IsDuplicateAsync(string firstName, string lastName, int? excludeId = null, CancellationToken ct = default) =>
        context.Authors.AnyAsync(a =>
            a.Id != (excludeId ?? 0) &&
            EF.Functions.Like(a.FirstName, firstName) &&
            EF.Functions.Like(a.LastName, lastName), ct);

    public Task<bool> HasBooksAsync(int id, CancellationToken ct = default) =>
        context.Books.AnyAsync(b => b.AuthorId == id, ct);

    private static AuthorResponseDto MapToResponse(Author author) => new()
    {
        Id = author.Id,
        FirstName = author.FirstName,
        LastName = author.LastName
    };
}
