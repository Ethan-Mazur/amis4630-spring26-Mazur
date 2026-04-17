using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductsApi.Data;
using ProductsApi.Models;

namespace ProductsApi.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ProductsController(AppDbContext db) => _db = db;

    // GET /api/products — public
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _db.Products.OrderBy(p => p.Id).ToListAsync());

    // GET /api/products/{id} — public
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _db.Products.FindAsync(id);
        return product is not null ? Ok(product) : NotFound();
    }

    // POST /api/products — admin only
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] ProductEntity product)
    {
        product.Id = 0; // ensure EF assigns identity
        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    // PUT /api/products/{id} — admin only
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductEntity updated)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return NotFound();

        product.Title = updated.Title;
        product.Description = updated.Description;
        product.Price = updated.Price;
        product.Category = updated.Category;
        product.SellerName = updated.SellerName;
        product.PostedDate = updated.PostedDate;
        product.ImageUrl = updated.ImageUrl;
        product.Stock = updated.Stock;

        await _db.SaveChangesAsync();
        return Ok(product);
    }

    // DELETE /api/products/{id} — admin only
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return NotFound();
        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

