using LibraryManagement.API.Common;
using LibraryManagement.API.DTOs.Requests;
using LibraryManagement.API.DTOs.Responses;
using LibraryManagement.API.Filters.ActionFilters;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController(IBookService bookService, IAuthorService authorService, ICategoryService categoryService, ILogger<BooksController> logger) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<BookResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var books = await bookService.GetAllAsync(ct);
        return Ok(books);
    }

    [HttpGet("{id:int}")]
    [TypeFilter(typeof(ValidateBookIdFilterAttribute))]
    [ProducesResponseType(typeof(BookResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetById(int id)
    {
        var book = HttpContext.Items[HttpContextKeys.Book] as BookResponseDto;
        return Ok(book);
    }

    [HttpPost]
    [ProducesResponseType(typeof(BookResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] BookCreateUpdateDto dto, CancellationToken ct)
    {
        if (!await authorService.ExistsAsync(dto.AuthorId, ct))
            return BadRequest(new { message = $"Author with ID {dto.AuthorId} does not exist." });

        if (!await categoryService.ExistsAsync(dto.CategoryId, ct))
            return BadRequest(new { message = $"Category with ID {dto.CategoryId} does not exist." });

        var created = await bookService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    [TypeFilter(typeof(ValidateBookIdFilterAttribute))]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] BookCreateUpdateDto dto, CancellationToken ct)
    {
        if (!await authorService.ExistsAsync(dto.AuthorId, ct))
            return BadRequest(new { message = $"Author with ID {dto.AuthorId} does not exist." });

        if (!await categoryService.ExistsAsync(dto.CategoryId, ct))
            return BadRequest(new { message = $"Category with ID {dto.CategoryId} does not exist." });

        await bookService.UpdateAsync(id, dto, ct);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [TypeFilter(typeof(ValidateBookIdFilterAttribute))]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        if (await bookService.HasActiveLoansAsync(id, ct))
        {
            logger.LogWarning("Attempted to delete book {BookId} which has active loans", id);
            return Conflict(new { message = "Cannot delete a book that has active loans." });
        }

        await bookService.DeleteAsync(id, ct);
        return NoContent();
    }
}
