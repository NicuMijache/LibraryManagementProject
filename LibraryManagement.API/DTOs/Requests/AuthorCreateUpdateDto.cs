using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.API.DTOs.Requests;

public class AuthorCreateUpdateDto
{
    [Required]
    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string LastName { get; set; } = string.Empty;
}
