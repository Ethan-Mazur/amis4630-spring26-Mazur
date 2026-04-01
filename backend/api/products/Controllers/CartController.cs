using Microsoft.AspNetCore.Mvc;
using ProductsApi.Data;

namespace ProductsApi.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    // Hardcoded user ID — will be replaced with authenticated user in Milestone 5
    private const string HardcodedUserId = "user-001";

    private static readonly List<CartItem> _cart = new();
    private static int _nextId = 1;

    // GET /api/cart
    [HttpGet]
    public IActionResult GetCart()
    {
        var userCart = _cart.Where(ci => ci.UserId == HardcodedUserId).ToList();
        return Ok(userCart);
    }

    // POST /api/cart
    [HttpPost]
    public IActionResult AddToCart([FromBody] AddToCartRequest request)
    {
        if (request.Quantity < 1)
            return BadRequest(new { error = "Quantity must be at least 1." });

        var product = ProductStore.Products.FirstOrDefault(p => p.Id == request.ProductId);
        if (product is null)
            return NotFound(new { error = $"Product {request.ProductId} not found." });

        var existing = _cart.FirstOrDefault(ci => ci.UserId == HardcodedUserId && ci.ProductId == request.ProductId);
        if (existing is not null)
        {
            var updated = existing with { Quantity = existing.Quantity + request.Quantity };
            _cart[_cart.IndexOf(existing)] = updated;
            return Ok(updated);
        }

        var item = new CartItem(
            Id: _nextId++,
            UserId: HardcodedUserId,
            ProductId: product.Id,
            Quantity: request.Quantity,
            Title: product.Title,
            Price: product.Price,
            ImageUrl: product.ImageUrl
        );

        _cart.Add(item);
        return CreatedAtAction(nameof(GetCart), new { }, item);
    }

    // PUT /api/cart/{cartItemId}
    [HttpPut("{cartItemId:int}")]
    public IActionResult UpdateQuantity(int cartItemId, [FromBody] UpdateCartItemRequest request)
    {
        if (request.Quantity < 1)
            return BadRequest(new { error = "Quantity must be at least 1." });

        var item = _cart.FirstOrDefault(ci => ci.Id == cartItemId && ci.UserId == HardcodedUserId);
        if (item is null)
            return NotFound(new { error = $"Cart item {cartItemId} not found." });

        var updated = item with { Quantity = request.Quantity };
        _cart[_cart.IndexOf(item)] = updated;
        return Ok(updated);
    }

    // DELETE /api/cart/clear  — must be declared before the /{cartItemId} route
    [HttpDelete("clear")]
    public IActionResult ClearCart()
    {
        _cart.RemoveAll(ci => ci.UserId == HardcodedUserId);
        return Ok(new { message = "Cart cleared." });
    }

    // DELETE /api/cart/{cartItemId}
    [HttpDelete("{cartItemId:int}")]
    public IActionResult RemoveItem(int cartItemId)
    {
        var item = _cart.FirstOrDefault(ci => ci.Id == cartItemId && ci.UserId == HardcodedUserId);
        if (item is null)
            return NotFound(new { error = $"Cart item {cartItemId} not found." });

        _cart.Remove(item);
        return Ok(new { message = $"Cart item {cartItemId} removed." });
    }
}

public record CartItem(
    int Id,
    string UserId,
    int ProductId,
    int Quantity,
    string Title,
    decimal Price,
    string ImageUrl);

public record AddToCartRequest(int ProductId, int Quantity);
public record UpdateCartItemRequest(int Quantity);
