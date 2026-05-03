using LibraryManagement.API.Common;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LibraryManagement.API.Filters.ActionFilters;

public class ValidateAuthorIdFilterAttribute(IAuthorService authorService) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.ActionArguments.TryGetValue("id", out var idArg) || idArg is not int id)
        {
            context.Result = new BadRequestObjectResult(new { message = "Invalid ID." });
            return;
        }

        var author = await authorService.GetByIdAsync(id);
        if (author is null)
        {
            context.Result = new NotFoundObjectResult(new { message = $"Author with ID {id} not found." });
            return;
        }

        context.HttpContext.Items[HttpContextKeys.Author] = author;
        await next();
    }
}
