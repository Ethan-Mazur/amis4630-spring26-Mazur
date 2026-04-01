using Microsoft.AspNetCore.Mvc;
using ProductsApi.Data;

namespace ProductsApi.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() => Ok(ProductStore.Products);

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var product = ProductStore.Products.FirstOrDefault(p => p.Id == id);
        return product is not null ? Ok(product) : NotFound();
    }
}
