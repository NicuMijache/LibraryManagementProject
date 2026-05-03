namespace LibraryManagement.API.DTOs.Responses;

public class LoanResponseDto
{
    public int Id { get; set; }
    public string BorrowerName { get; set; } = string.Empty;
    public DateTime LoanDate { get; set; }
    public DateTime? ReturnDate { get; set; }
    public bool IsReturned => ReturnDate.HasValue;
    public int BookId { get; set; }
    public string BookTitle { get; set; } = string.Empty;
}
