using LibraryManagement.API.Common;
using LibraryManagement.API.DTOs.Requests;
using LibraryManagement.API.DTOs.Responses;
using LibraryManagement.API.Filters.ActionFilters;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthorsController(IAuthorService authorService, ILogger<AuthorsController> logger) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AuthorResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var authors = await authorService.GetAllAsync(ct);
        return Ok(authors);
    }

    [HttpGet("{id:int}")]
    [TypeFilter(typeof(ValidateAuthorIdFilterAttribute))]
    [ProducesResponseType(typeof(AuthorResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetById(int id)
    {
        var author = HttpContext.Items[HttpContextKeys.Author] as AuthorResponseDto;
        return Ok(author);
    }

    [HttpPost]
    [TypeFilter(typeof(ValidateAuthorDuplicateFilterAttribute))]
    [ProducesResponseType(typeof(AuthorResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] AuthorCreateUpdateDto dto, CancellationToken ct)
    {
        var created = await authorService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    [TypeFilter(typeof(ValidateAuthorIdFilterAttribute))]
    [TypeFilter(typeof(ValidateAuthorDuplicateFilterAttribute))]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] AuthorCreateUpdateDto dto, CancellationToken ct)
    {
        await authorService.UpdateAsync(id, dto, ct);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [TypeFilter(typeof(ValidateAuthorIdFilterAttribute))]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        if (await authorService.HasBooksAsync(id, ct))
        {
            logger.LogWarning("Attempted to delete author {AuthorId} who has existing books", id);
            return Conflict(new { message = "Cannot delete an author that has existing books." });
        }

        await authorService.DeleteAsync(id, ct);
        return NoContent();
    }
}
