using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LibraryManagement.API.Models;

public class Book
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "decimal(10,2)")]
    [Range(0.01, 1000)]
    public decimal Price { get; set; }

    public bool IsAvailable { get; set; } = true;

    [Required]
    public int AuthorId { get; set; }
    public Author? Author { get; set; }

    [Required]
    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    [JsonIgnore]
    public List<Loan> Loans { get; set; } = [];
}
