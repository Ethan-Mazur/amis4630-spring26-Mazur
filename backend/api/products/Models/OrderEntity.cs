namespace ProductsApi.Models;

public class OrderEntity
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public string Status { get; set; } = "Pending";
    public decimal Total { get; set; }
    public string ShippingAddress { get; set; } = string.Empty;
    public string ConfirmationNumber { get; set; } = string.Empty;
    public List<OrderItemEntity> Items { get; set; } = new();
}

public class OrderItemEntity
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public OrderEntity Order { get; set; } = null!;
    public int ProductId { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int Quantity { get; set; }
}
