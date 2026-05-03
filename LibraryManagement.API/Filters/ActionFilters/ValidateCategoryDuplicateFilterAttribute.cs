using LibraryManagement.API.DTOs.Requests;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LibraryManagement.API.Filters.ActionFilters;

public class ValidateCategoryDuplicateFilterAttribute(ICategoryService categoryService) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.ActionArguments.TryGetValue("dto", out var dtoArg) || dtoArg is not CategoryCreateUpdateDto dto)
        {
            await next();
            return;
        }

        // For PUT, exclude the current category so renaming to the same name doesn't fail
        int? excludeId = null;
        if (context.ActionArguments.TryGetValue("id", out var idArg) && idArg is int id)
            excludeId = id;

        if (await categoryService.IsDuplicateAsync(dto.Name, excludeId))
        {
            context.Result = new BadRequestObjectResult(new
            {
                message = $"A category named '{dto.Name}' already exists."
            });
            return;
        }

        await next();
    }
}
