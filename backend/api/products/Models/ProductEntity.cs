namespace ProductsApi.Models;

public class ProductEntity
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public string SellerName { get; set; } = string.Empty;
    public DateOnly PostedDate { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int Stock { get; set; }
}
