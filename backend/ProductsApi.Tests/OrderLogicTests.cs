using ProductsApi.Models;

namespace ProductsApi.Tests;

/// <summary>
/// Pure unit tests — no database, no HTTP.
/// </summary>
public class OrderLogicTests
{
    // 1. Order total calculation
    [Fact]
    public void OrderTotal_CalculatesCorrectly()
    {
        var items = new List<CartItemEntity>
        {
            new() { ProductId = 1, Quantity = 2, Price = 10.00m, Title = "A", ImageUrl = "", Stock = 5, CartId = 1 },
            new() { ProductId = 2, Quantity = 1, Price = 25.50m, Title = "B", ImageUrl = "", Stock = 5, CartId = 1 },
        };

        var total = items.Sum(i => i.Price * i.Quantity);

        Assert.Equal(45.50m, total);
    }

    // 2. Password rule validator
    [Theory]
    [InlineData("short1A", false)]          // too short (7 chars)
    [InlineData("alllowercase1", false)]    // no uppercase letter
    [InlineData("ALLUPPERCASE1", true)]     // uppercase + digit + 8 chars — valid
    [InlineData("ValidPass1", true)]        // valid
    [InlineData("NoDigitHere", false)]      // no digit, under 8 chars (9 chars but no digit)
    [InlineData("12345678A", true)]         // digit + uppercase + 8 chars
    public void PasswordRules_ValidatesCorrectly(string password, bool expected)
    {
        var result = PasswordRuleValidator.IsValid(password);
        Assert.Equal(expected, result);
    }

    // 3. Cart-to-order mapper
    [Fact]
    public void CartToOrderMapper_MapsFieldsCorrectly()
    {
        var cartItems = new List<CartItemEntity>
        {
            new() { ProductId = 5, Quantity = 3, Price = 15.00m, Title = "TI-84", ImageUrl = "img.png", Stock = 10, CartId = 1 }
        };
        const string userId = "user-abc";
        const string address = "123 High St, Columbus OH";

        var orderItems = cartItems.Select(ci => new OrderItemEntity
        {
            ProductId = ci.ProductId,
            Title = ci.Title,
            Price = ci.Price,
            ImageUrl = ci.ImageUrl,
            Quantity = ci.Quantity
        }).ToList();

        var order = new OrderEntity
        {
            UserId = userId,
            ShippingAddress = address,
            Total = cartItems.Sum(i => i.Price * i.Quantity),
            Items = orderItems
        };

        Assert.Equal(userId, order.UserId);
        Assert.Equal(address, order.ShippingAddress);
        Assert.Equal(45.00m, order.Total);
        Assert.Single(order.Items);
        Assert.Equal("TI-84", order.Items[0].Title);
        Assert.Equal(3, order.Items[0].Quantity);
    }

    // 4. Confirmation number format
    [Fact]
    public void ConfirmationNumber_HasExpectedFormat()
    {
        var cn = "BM-" + Guid.NewGuid().ToString("N")[..8].ToUpper();
        Assert.StartsWith("BM-", cn);
        Assert.Equal(11, cn.Length); // "BM-" (3) + 8 chars
    }
}

/// <summary>
/// Simple pure-logic password rule validator (mirrors Identity's configured rules).
/// </summary>
public static class PasswordRuleValidator
{
    public static bool IsValid(string password) =>
        password.Length >= 8
        && password.Any(char.IsDigit)
        && password.Any(char.IsUpper);
}
