using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.API.Models;

public class Loan
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string BorrowerName { get; set; } = string.Empty;

    public DateTime LoanDate { get; set; } = DateTime.UtcNow;

    public DateTime? ReturnDate { get; set; }

    [Required]
    public int BookId { get; set; }
    public Book? Book { get; set; }
}
