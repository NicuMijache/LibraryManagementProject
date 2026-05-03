using LibraryManagement.API.Data;
using LibraryManagement.API.DTOs.Requests;
using LibraryManagement.API.DTOs.Responses;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Services;

public class LoanService(LibraryContext context, ILogger<LoanService> logger) : ILoanService
{
    public async Task<IEnumerable<LoanResponseDto>> GetAllAsync(CancellationToken ct = default)
    {
        var loans = await context.Loans
            .AsNoTracking()
            .Include(l => l.Book)
            .ToListAsync(ct);

        return loans.Select(MapToResponse);
    }

    public async Task<LoanResponseDto> CreateAsync(LoanCreateDto dto, CancellationToken ct = default)
    {
        var book = await context.Books.FindAsync([dto.BookId], ct)
            ?? throw new InvalidOperationException("Cartea cu acest ID nu există în bibliotecă.");

        if (!book.IsAvailable)
            throw new InvalidOperationException("Ne pare rău, această carte este deja împrumutată de altcineva.");

        var loan = new Models.Loan
        {
            BorrowerName = dto.BorrowerName,
            BookId = dto.BookId,
            LoanDate = DateTime.UtcNow
        };

        book.IsAvailable = false;
        context.Loans.Add(loan);
        await context.SaveChangesAsync(ct);

        logger.LogInformation("Loan {LoanId} created for book {BookId}", loan.Id, dto.BookId);

        var created = await context.Loans
            .AsNoTracking()
            .Include(l => l.Book)
            .FirstAsync(l => l.Id == loan.Id, ct);

        return MapToResponse(created);
    }

    public async Task<string> ReturnBookAsync(int loanId, CancellationToken ct = default)
    {
        var loan = await context.Loans
            .Include(l => l.Book)
            .FirstOrDefaultAsync(l => l.Id == loanId, ct)
            ?? throw new InvalidOperationException("Fișa de împrumut nu a fost găsită.");

        if (loan.ReturnDate.HasValue)
            throw new InvalidOperationException("Această carte a fost deja returnată.");

        loan.ReturnDate = DateTime.UtcNow;
        loan.Book!.IsAvailable = true;

        await context.SaveChangesAsync(ct);
        logger.LogInformation("Loan {LoanId} returned", loanId);

        return $"Cartea \"{loan.Book.Title}\" a fost returnată cu succes.";
    }

    private static LoanResponseDto MapToResponse(Models.Loan loan) => new()
    {
        Id = loan.Id,
        BorrowerName = loan.BorrowerName,
        LoanDate = loan.LoanDate,
        ReturnDate = loan.ReturnDate,
        BookId = loan.BookId,
        BookTitle = loan.Book?.Title ?? string.Empty
    };
}
