using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.API.DTOs.Requests;

public class CategoryCreateUpdateDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}
