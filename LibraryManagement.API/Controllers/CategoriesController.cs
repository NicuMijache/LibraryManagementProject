using LibraryManagement.API.Common;
using LibraryManagement.API.DTOs.Requests;
using LibraryManagement.API.DTOs.Responses;
using LibraryManagement.API.Filters.ActionFilters;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(ICategoryService categoryService, ILogger<CategoriesController> logger) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CategoryResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var categories = await categoryService.GetAllAsync(ct);
        return Ok(categories);
    }

    [HttpGet("{id:int}")]
    [TypeFilter(typeof(ValidateCategoryIdFilterAttribute))]
    [ProducesResponseType(typeof(CategoryResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetById(int id)
    {
        var category = HttpContext.Items[HttpContextKeys.Category] as CategoryResponseDto;
        return Ok(category);
    }

    [HttpPost]
    [TypeFilter(typeof(ValidateCategoryDuplicateFilterAttribute))]
    [ProducesResponseType(typeof(CategoryResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CategoryCreateUpdateDto dto, CancellationToken ct)
    {
        var created = await categoryService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    [TypeFilter(typeof(ValidateCategoryIdFilterAttribute))]
    [TypeFilter(typeof(ValidateCategoryDuplicateFilterAttribute))]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] CategoryCreateUpdateDto dto, CancellationToken ct)
    {
        await categoryService.UpdateAsync(id, dto, ct);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [TypeFilter(typeof(ValidateCategoryIdFilterAttribute))]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        if (await categoryService.HasBooksAsync(id, ct))
        {
            logger.LogWarning("Attempted to delete category {CategoryId} which has existing books", id);
            return Conflict(new { message = "Cannot delete a category that has existing books." });
        }

        await categoryService.DeleteAsync(id, ct);
        return NoContent();
    }
}
