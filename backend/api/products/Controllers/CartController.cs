using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductsApi.Data;
using ProductsApi.Models;

namespace ProductsApi.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    // Hardcoded user ID — will be replaced with authenticated user in Milestone 5
    private const string HardcodedUserId = "user-001";

    private readonly AppDbContext _db;

    public CartController(AppDbContext db) => _db = db;

    private async Task<CartEntity> GetOrCreateCartAsync()
    {
        var cart = await _db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == HardcodedUserId);

        if (cart is null)
        {
            cart = new CartEntity { UserId = HardcodedUserId };
            _db.Carts.Add(cart);
            await _db.SaveChangesAsync();
        }

        return cart;
    }

    // GET /api/cart
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var cart = await GetOrCreateCartAsync();
        return Ok(cart.Items.Select(ToDto));
    }

    // POST /api/cart
    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
    {
        if (request.Quantity < 1)
            return BadRequest(new { error = "Quantity must be at least 1." });

        var product = ProductStore.Products.FirstOrDefault(p => p.Id == request.ProductId);
        if (product is null)
            return NotFound(new { error = $"Product {request.ProductId} not found." });

        if (product.Stock == 0)
            return BadRequest(new { error = "This item is out of stock." });

        var cart = await GetOrCreateCartAsync();

        var existing = cart.Items.FirstOrDefault(ci => ci.ProductId == request.ProductId);
        if (existing is not null)
        {
            var newQty = existing.Quantity + request.Quantity;
            if (newQty > product.Stock)
                return BadRequest(new { error = $"Only {product.Stock - existing.Quantity} more available. You already have {existing.Quantity} in your cart." });
            existing.Quantity = newQty;
            await _db.SaveChangesAsync();
            return Ok(ToDto(existing));
        }

        if (request.Quantity > product.Stock)
            return BadRequest(new { error = $"Only {product.Stock} available for this item." });

        var item = new CartItemEntity
        {
            CartId = cart.Id,
            ProductId = product.Id,
            Quantity = request.Quantity,
            Title = product.Title,
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            Stock = product.Stock
        };

        cart.Items.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCart), new { }, ToDto(item));
    }

    // PUT /api/cart/{cartItemId}
    [HttpPut("{cartItemId:int}")]
    public async Task<IActionResult> UpdateQuantity(int cartItemId, [FromBody] UpdateCartItemRequest request)
    {
        if (request.Quantity < 1)
            return BadRequest(new { error = "Quantity must be at least 1." });

        var cart = await GetOrCreateCartAsync();
        var item = cart.Items.FirstOrDefault(ci => ci.Id == cartItemId);
        if (item is null)
            return NotFound(new { error = $"Cart item {cartItemId} not found." });

        if (request.Quantity > item.Stock)
            return BadRequest(new { error = $"Only {item.Stock} available for this item." });

        item.Quantity = request.Quantity;
        await _db.SaveChangesAsync();
        return Ok(ToDto(item));
    }

    // DELETE /api/cart/clear — declared before /{cartItemId} to avoid route conflict
    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var cart = await GetOrCreateCartAsync();
        _db.CartItems.RemoveRange(cart.Items);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Cart cleared." });
    }

    // DELETE /api/cart/{cartItemId}
    [HttpDelete("{cartItemId:int}")]
    public async Task<IActionResult> RemoveItem(int cartItemId)
    {
        var cart = await GetOrCreateCartAsync();
        var item = cart.Items.FirstOrDefault(ci => ci.Id == cartItemId);
        if (item is null)
            return NotFound(new { error = $"Cart item {cartItemId} not found." });

        _db.CartItems.Remove(item);
        await _db.SaveChangesAsync();
        return Ok(new { message = $"Cart item {cartItemId} removed." });
    }

    private static object ToDto(CartItemEntity ci) => new
    {
        ci.Id,
        ci.ProductId,
        ci.Quantity,
        ci.Title,
        ci.Price,
        ci.ImageUrl,
        ci.Stock
    };
}

public record AddToCartRequest(int ProductId, int Quantity);
public record UpdateCartItemRequest(int Quantity);
