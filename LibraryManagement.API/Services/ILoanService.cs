using LibraryManagement.API.DTOs.Requests;
using LibraryManagement.API.DTOs.Responses;

namespace LibraryManagement.API.Services;

public interface ILoanService
{
    Task<IEnumerable<LoanResponseDto>> GetAllAsync(CancellationToken ct = default);
    Task<LoanResponseDto> CreateAsync(LoanCreateDto dto, CancellationToken ct = default);
    Task<string> ReturnBookAsync(int loanId, CancellationToken ct = default);
}
