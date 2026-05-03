using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.API.DTOs.Requests;

public class LoanCreateDto
{
    [Required]
    [MaxLength(100)]
    public string BorrowerName { get; set; } = string.Empty;

    [Required]
    public int BookId { get; set; }
}
