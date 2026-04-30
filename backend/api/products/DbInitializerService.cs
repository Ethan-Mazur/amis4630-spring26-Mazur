using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProductsApi.Data;
using ProductsApi.Models;

namespace ProductsApi;

/// <summary>
/// Runs DB initialization in the background so the app starts instantly
/// and passes Azure's container warmup probe before the DB connection completes.
/// </summary>
public class DbInitializerService : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<DbInitializerService> _logger;

    public DbInitializerService(IServiceProvider services, ILogger<DbInitializerService> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Small delay so the HTTP pipeline is fully configured before we hit the DB
        await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);

        try
        {
            using var scope = _services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            _logger.LogInformation("Initializing database…");

            if (db.Database.IsSqlite())
                await db.Database.MigrateAsync(stoppingToken);
            else
                await db.Database.EnsureCreatedAsync(stoppingToken);

            _logger.LogInformation("Database schema ready.");

            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            foreach (var role in new[] { "Admin", "User" })
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            const string adminEmail = "admin@buckeyemarketplace.com";
            const string adminPassword = "Admin123!";
            if (await userManager.FindByEmailAsync(adminEmail) is null)
            {
                var admin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    DisplayName = "Admin",
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(admin, adminPassword);
                if (result.Succeeded)
                    await userManager.AddToRoleAsync(admin, "Admin");
            }

            _logger.LogInformation("Database initialization complete.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database initialization failed. The app is running but DB may be unavailable.");
        }
    }
}
