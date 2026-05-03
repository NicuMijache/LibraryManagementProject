using LibraryManagement.API.DTOs.Requests;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LibraryManagement.API.Filters.ActionFilters;

public class ValidateAuthorDuplicateFilterAttribute(IAuthorService authorService) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.ActionArguments.TryGetValue("dto", out var dtoArg) || dtoArg is not AuthorCreateUpdateDto dto)
        {
            await next();
            return;
        }

        // For PUT, exclude the current author from the duplicate check
        int? excludeId = null;
        if (context.ActionArguments.TryGetValue("id", out var idArg) && idArg is int id)
            excludeId = id;

        if (await authorService.IsDuplicateAsync(dto.FirstName, dto.LastName, excludeId))
        {
            context.Result = new BadRequestObjectResult(new
            {
                message = $"An author named '{dto.FirstName} {dto.LastName}' already exists."
            });
            return;
        }

        await next();
    }
}
