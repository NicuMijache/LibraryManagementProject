using LibraryManagement.API.Common;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LibraryManagement.API.Filters.ActionFilters;

public class ValidateBookIdFilterAttribute(IBookService bookService) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.ActionArguments.TryGetValue("id", out var idArg) || idArg is not int id)
        {
            context.Result = new BadRequestObjectResult(new { message = "Invalid ID." });
            return;
        }

        var book = await bookService.GetByIdAsync(id);
        if (book is null)
        {
            context.Result = new NotFoundObjectResult(new { message = $"Book with ID {id} not found." });
            return;
        }

        context.HttpContext.Items[HttpContextKeys.Book] = book;
        await next();
    }
}
