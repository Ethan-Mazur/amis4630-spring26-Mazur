using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductsApi.Data;
using ProductsApi.Models;

namespace ProductsApi.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrdersController(AppDbContext db) => _db = db;

    // POST /api/orders — create order from current user's cart
    [HttpPost]
    public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var cart = await _db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart is null || cart.Items.Count == 0)
            return BadRequest(new { error = "Your cart is empty." });

        var total = cart.Items.Sum(i => i.Price * i.Quantity);

        var order = new OrderEntity
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            Status = "Pending",
            Total = total,
            ShippingAddress = request.ShippingAddress,
            ConfirmationNumber = GenerateConfirmationNumber(),
            Items = cart.Items.Select(ci => new OrderItemEntity
            {
                ProductId = ci.ProductId,
                Title = ci.Title,
                Price = ci.Price,
                ImageUrl = ci.ImageUrl,
                Quantity = ci.Quantity
            }).ToList()
        };

        _db.Orders.Add(order);
        _db.CartItems.RemoveRange(cart.Items);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMyOrders), new { }, ToOrderDto(order));
    }

    // GET /api/orders/mine — current user's order history (user ID from JWT only)
    [HttpGet("mine")]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var orders = await _db.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.Items)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return Ok(orders.Select(ToOrderDto));
    }

    // GET /api/orders — admin: view all orders
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _db.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return Ok(orders.Select(ToOrderDto));
    }

    // PUT /api/orders/{orderId}/status — admin: update order status
    [HttpPut("{orderId:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int orderId, [FromBody] UpdateOrderStatusRequest request)
    {
        var order = await _db.Orders.FindAsync(orderId);
        if (order is null) return NotFound(new { error = $"Order {orderId} not found." });

        order.Status = request.Status;
        await _db.SaveChangesAsync();
        return Ok(new { orderId = order.Id, status = order.Status });
    }

    private static string GenerateConfirmationNumber() =>
        "BM-" + Guid.NewGuid().ToString("N")[..8].ToUpper();

    private static object ToOrderDto(OrderEntity o) => new
    {
        id = o.Id,
        orderDate = o.OrderDate,
        status = o.Status,
        total = o.Total,
        shippingAddress = o.ShippingAddress,
        confirmationNumber = o.ConfirmationNumber,
        items = o.Items.Select(i => new
        {
            id = i.Id,
            productId = i.ProductId,
            title = i.Title,
            price = i.Price,
            imageUrl = i.ImageUrl,
            quantity = i.Quantity
        })
    };
}

public record PlaceOrderRequest(
    [System.ComponentModel.DataAnnotations.Required]
    string ShippingAddress
);

public record UpdateOrderStatusRequest(
    [System.ComponentModel.DataAnnotations.Required]
    string Status
);
