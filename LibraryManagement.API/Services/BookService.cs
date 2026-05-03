using LibraryManagement.API.Data;
using LibraryManagement.API.DTOs.Requests;
using LibraryManagement.API.DTOs.Responses;
using LibraryManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Services;

public class BookService(LibraryContext context, ILogger<BookService> logger) : IBookService
{
    public async Task<IEnumerable<BookResponseDto>> GetAllAsync(CancellationToken ct = default)
    {
        var books = await context.Books
            .AsNoTracking()
            .Include(b => b.Author)
            .Include(b => b.Category)
            .ToListAsync(ct);

        return books.Select(MapToResponse);
    }

    public async Task<BookResponseDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var book = await context.Books
            .AsNoTracking()
            .Include(b => b.Author)
            .Include(b => b.Category)
            .FirstOrDefaultAsync(b => b.Id == id, ct);

        return book is null ? null : MapToResponse(book);
    }

    public async Task<BookResponseDto> CreateAsync(BookCreateUpdateDto dto, CancellationToken ct = default)
    {
        var book = new Book
        {
            Title = dto.Title,
            Price = dto.Price,
            AuthorId = dto.AuthorId,
            CategoryId = dto.CategoryId
        };

        context.Books.Add(book);
        await context.SaveChangesAsync(ct);

        // Reload with navigation properties for the response
        var created = await context.Books
            .AsNoTracking()
            .Include(b => b.Author)
            .Include(b => b.Category)
            .FirstAsync(b => b.Id == book.Id, ct);

        logger.LogInformation("Book created with ID {BookId}", book.Id);
        return MapToResponse(created);
    }

    public async Task UpdateAsync(int id, BookCreateUpdateDto dto, CancellationToken ct = default)
    {
        var book = await context.Books.FindAsync([id], ct)
            ?? throw new KeyNotFoundException($"Book with ID {id} not found.");

        book.Title = dto.Title;
        book.Price = dto.Price;
        book.AuthorId = dto.AuthorId;
        book.CategoryId = dto.CategoryId;

        await context.SaveChangesAsync(ct);
        logger.LogInformation("Book {BookId} updated", id);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var book = await context.Books.FindAsync([id], ct)
            ?? throw new KeyNotFoundException($"Book with ID {id} not found.");

        context.Books.Remove(book);
        await context.SaveChangesAsync(ct);
        logger.LogInformation("Book {BookId} deleted", id);
    }

    public Task<bool> ExistsAsync(int id, CancellationToken ct = default) =>
        context.Books.AnyAsync(b => b.Id == id, ct);

    public Task<bool> HasActiveLoansAsync(int id, CancellationToken ct = default) =>
        context.Loans.AnyAsync(l => l.BookId == id && l.ReturnDate == null, ct);

    private static BookResponseDto MapToResponse(Book book) => new()
    {
        Id = book.Id,
        Title = book.Title,
        Price = book.Price,
        IsAvailable = book.IsAvailable,
        AuthorId = book.AuthorId,
        AuthorFullName = book.Author is null ? string.Empty : $"{book.Author.FirstName} {book.Author.LastName}",
        CategoryId = book.CategoryId,
        CategoryName = book.Category?.Name ?? string.Empty
    };
}
