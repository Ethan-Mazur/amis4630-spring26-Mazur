var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors();

var products = new List<Product>
{
    new(1,  "Econ 2001 Textbook",             "Principles of Microeconomics (9th ed.), barely used, no writing",             35.00m,  "Textbooks",      "Alex Johnson",   new DateOnly(2026, 1, 10), "https://picsum.photos/seed/1/300/200"),
    new(2,  "OSU Buckeyes Hoodie",            "Large scarlet hoodie, worn twice, excellent condition",                       25.00m,  "Clothing",       "Maria Garcia",   new DateOnly(2026, 1, 15), "https://picsum.photos/seed/2/300/200"),
    new(3,  "Mini Fridge",                    "2.7 cu ft Frigidaire, perfect for dorms, works great",                       60.00m,  "Furniture",      "Chris Lee",      new DateOnly(2026, 1, 20), "https://picsum.photos/seed/3/300/200"),
    new(4,  "TI-84 Plus Calculator",          "Still has original box and manual, includes fresh batteries",                 40.00m,  "Electronics",    "Sam Patel",      new DateOnly(2026, 1, 22), "https://picsum.photos/seed/4/300/200"),
    new(5,  "Accounting 2200 Notes Bundle",   "Complete typed notes from Spring 2025, all chapters covered",                 10.00m,  "Textbooks",      "Jordan Smith",   new DateOnly(2026, 2,  1), "https://picsum.photos/seed/5/300/200"),
    new(6,  "LED Desk Lamp",                  "Adjustable brightness, USB charging port on base, barely used",              15.00m,  "Furniture",      "Taylor Brown",   new DateOnly(2026, 2,  5), "https://picsum.photos/seed/6/300/200"),
    new(7,  "OSU Stadium Blanket",            "Official licensed Buckeyes stadium blanket, great condition",                 20.00m,  "Clothing",       "Morgan Davis",   new DateOnly(2026, 2, 10), "https://picsum.photos/seed/7/300/200"),
    new(8,  "AirPods Pro (Gen 2)",            "Includes case and all ear tips, minor cosmetic wear, works perfectly",       120.00m,  "Electronics",    "Riley Wilson",   new DateOnly(2026, 2, 14), "https://picsum.photos/seed/8/300/200"),
    new(9,  "U-Lock Bike Lock",               "Heavy-duty Kryptonite U-lock with two keys, used one semester",              12.00m,  "Electronics",    "Casey Martinez", new DateOnly(2026, 2, 20), "https://picsum.photos/seed/9/300/200"),
    new(10, "Calculus: Early Transcendentals","Stewart 9th edition, some yellow highlighting in Ch 1-3 only, good shape",  45.00m,  "Textbooks",      "Drew Thomas",    new DateOnly(2026, 3,  1), "https://picsum.photos/seed/10/300/200"),
};

app.MapGet("/api/products", () => Results.Ok(products));

app.MapGet("/api/products/{id:int}", (int id) =>
{
    var product = products.FirstOrDefault(p => p.Id == id);
    return product is not null ? Results.Ok(product) : Results.NotFound();
});

app.Run();

record Product(
    int Id,
    string Title,
    string Description,
    decimal Price,
    string Category,
    string SellerName,
    DateOnly PostedDate,
    string ImageUrl);
