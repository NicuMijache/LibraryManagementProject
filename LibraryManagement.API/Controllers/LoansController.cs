using LibraryManagement.API.DTOs.Requests;
using LibraryManagement.API.DTOs.Responses;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoansController(ILoanService loanService, ILogger<LoansController> logger) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<LoanResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var loans = await loanService.GetAllAsync(ct);
        return Ok(loans);
    }

    [HttpPost]
    [ProducesResponseType(typeof(LoanResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] LoanCreateDto dto, CancellationToken ct)
    {
        try
        {
            var loan = await loanService.CreateAsync(dto, ct);
            return Ok(loan);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning("Loan creation failed: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}/return")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Return(int id, CancellationToken ct)
    {
        try
        {
            var message = await loanService.ReturnBookAsync(id, ct);
            return Ok(new { message });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning("Return failed for loan {LoanId}: {Message}", id, ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }
}
