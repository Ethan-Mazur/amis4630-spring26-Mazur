namespace ProductsApi.Models;

public class CartEntity
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public List<CartItemEntity> Items { get; set; } = new();
}

public class CartItemEntity
{
    public int Id { get; set; }
    public int CartId { get; set; }
    public CartEntity Cart { get; set; } = null!;

    // Product reference (by ID only — products live in-memory for now)
    public int ProductId { get; set; }
    public int Quantity { get; set; }

    // Denormalized snapshot fields so cart is self-contained
    public string Title { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}
