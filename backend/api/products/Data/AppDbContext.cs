using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProductsApi.Models;

namespace ProductsApi.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<CartEntity> Carts => Set<CartEntity>();
    public DbSet<CartItemEntity> CartItems => Set<CartItemEntity>();
    public DbSet<ProductEntity> Products => Set<ProductEntity>();
    public DbSet<OrderEntity> Orders => Set<OrderEntity>();
    public DbSet<OrderItemEntity> OrderItems => Set<OrderItemEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); // required for Identity tables

        modelBuilder.Entity<CartEntity>()
            .HasMany(c => c.Items)
            .WithOne(ci => ci.Cart)
            .HasForeignKey(ci => ci.CartId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CartItemEntity>()
            .Property(ci => ci.Price)
            .HasColumnType("TEXT");

        modelBuilder.Entity<ProductEntity>()
            .Property(p => p.Price)
            .HasColumnType("TEXT");

        modelBuilder.Entity<OrderEntity>()
            .Property(o => o.Total)
            .HasColumnType("TEXT");

        modelBuilder.Entity<OrderItemEntity>()
            .Property(oi => oi.Price)
            .HasColumnType("TEXT");

        modelBuilder.Entity<OrderEntity>()
            .HasMany(o => o.Items)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // Seed initial products
        modelBuilder.Entity<ProductEntity>().HasData(
            new ProductEntity { Id = 1,  Title = "Econ 2001 Textbook",              Description = "Principles of Microeconomics (9th ed.), barely used, no writing",            Price = 35.00m,  Category = "Textbooks",   SellerName = "Alex Johnson",   PostedDate = new DateOnly(2026, 1, 10), ImageUrl = "https://picsum.photos/seed/1/300/200",  Stock = 10 },
            new ProductEntity { Id = 2,  Title = "OSU Buckeyes Hoodie",             Description = "Large scarlet hoodie, worn twice, excellent condition",                      Price = 25.00m,  Category = "Clothing",    SellerName = "Maria Garcia",   PostedDate = new DateOnly(2026, 1, 15), ImageUrl = "https://picsum.photos/seed/2/300/200",  Stock = 10 },
            new ProductEntity { Id = 3,  Title = "Mini Fridge",                     Description = "2.7 cu ft Frigidaire, perfect for dorms, works great",                      Price = 60.00m,  Category = "Furniture",   SellerName = "Chris Lee",      PostedDate = new DateOnly(2026, 1, 20), ImageUrl = "https://picsum.photos/seed/3/300/200",  Stock = 0  },
            new ProductEntity { Id = 4,  Title = "TI-84 Plus Calculator",           Description = "Still has original box and manual, includes fresh batteries",                Price = 40.00m,  Category = "Electronics", SellerName = "Sam Patel",      PostedDate = new DateOnly(2026, 1, 22), ImageUrl = "https://picsum.photos/seed/4/300/200",  Stock = 10 },
            new ProductEntity { Id = 5,  Title = "Accounting 2200 Notes Bundle",    Description = "Complete typed notes from Spring 2025, all chapters covered",                Price = 10.00m,  Category = "Textbooks",   SellerName = "Jordan Smith",   PostedDate = new DateOnly(2026, 2,  1), ImageUrl = "https://picsum.photos/seed/5/300/200",  Stock = 10 },
            new ProductEntity { Id = 6,  Title = "LED Desk Lamp",                   Description = "Adjustable brightness, USB charging port on base, barely used",             Price = 15.00m,  Category = "Furniture",   SellerName = "Taylor Brown",   PostedDate = new DateOnly(2026, 2,  5), ImageUrl = "https://picsum.photos/seed/6/300/200",  Stock = 10 },
            new ProductEntity { Id = 7,  Title = "OSU Stadium Blanket",             Description = "Official licensed Buckeyes stadium blanket, great condition",                Price = 20.00m,  Category = "Clothing",    SellerName = "Morgan Davis",   PostedDate = new DateOnly(2026, 2, 10), ImageUrl = "https://picsum.photos/seed/7/300/200",  Stock = 10 },
            new ProductEntity { Id = 8,  Title = "AirPods Pro (Gen 2)",             Description = "Includes case and all ear tips, minor cosmetic wear, works perfectly",      Price = 120.00m, Category = "Electronics", SellerName = "Riley Wilson",   PostedDate = new DateOnly(2026, 2, 14), ImageUrl = "https://picsum.photos/seed/8/300/200",  Stock = 5  },
            new ProductEntity { Id = 9,  Title = "U-Lock Bike Lock",                Description = "Heavy-duty Kryptonite U-lock with two keys, used one semester",             Price = 12.00m,  Category = "Electronics", SellerName = "Casey Martinez", PostedDate = new DateOnly(2026, 2, 20), ImageUrl = "https://picsum.photos/seed/9/300/200",  Stock = 10 },
            new ProductEntity { Id = 10, Title = "Calculus: Early Transcendentals", Description = "Stewart 9th edition, some yellow highlighting in Ch 1-3 only, good shape",  Price = 45.00m,  Category = "Textbooks",   SellerName = "Drew Thomas",    PostedDate = new DateOnly(2026, 3,  1), ImageUrl = "https://picsum.photos/seed/10/300/200", Stock = 10 }
        );
    }
}
