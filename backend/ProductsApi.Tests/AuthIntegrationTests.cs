using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ProductsApi.Data;

namespace ProductsApi.Tests;

/// <summary>
/// Integration tests using WebApplicationFactory with a shared in-memory SQLite connection.
/// </summary>
public class AuthIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public AuthIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_WithValidData_Returns200AndToken()
    {
        var payload = new
        {
            email = $"test_{Guid.NewGuid():N}@osu.edu",
            password = "TestPass1",
            displayName = "Test User"
        };

        var response = await _client.PostAsJsonAsync("/api/auth/register", payload);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(body);
        Assert.True(body!.ContainsKey("token"));
    }

    [Fact]
    public async Task Register_WithWeakPassword_Returns400()
    {
        var payload = new { email = "weak@osu.edu", password = "short", displayName = "Weak" };

        var response = await _client.PostAsJsonAsync("/api/auth/register", payload);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithWrongPassword_Returns401()
    {
        var email = $"user_{Guid.NewGuid():N}@osu.edu";
        await _client.PostAsJsonAsync("/api/auth/register",
            new { email, password = "ValidPass1", displayName = "U" });

        var response = await _client.PostAsJsonAsync("/api/auth/login",
            new { email, password = "WrongPass9" });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CartEndpoint_WithoutToken_Returns401()
    {
        var response = await _client.GetAsync("/api/cart");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CartEndpoint_WithToken_Returns200()
    {
        var email = $"cart_{Guid.NewGuid():N}@osu.edu";
        var regResp = await _client.PostAsJsonAsync("/api/auth/register",
            new { email, password = "CartPass1", displayName = "Cart User" });
        var regBody = await regResp.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        var token = regBody!["token"].ToString();

        var request = new HttpRequestMessage(HttpMethod.Get, "/api/cart");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}

/// <summary>
/// Factory that wires a single shared in-memory SQLite connection so all
/// requests (and migrations) share the same database instance.
/// </summary>
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    // Keep the connection open for the lifetime of the factory so the
    // in-memory SQLite database survives across requests.
    private readonly SqliteConnection _sharedConnection =
        new("Data Source=:memory:");

    public CustomWebApplicationFactory()
    {
        _sharedConnection.Open();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Override JWT settings so tests don't require user-secrets
        builder.UseSetting("Jwt:Key", "TestOnlyJwtKey_MustBeAtLeast32CharactersLong!");
        builder.UseSetting("Jwt:Issuer", "BuckeyeMarketplace");
        builder.UseSetting("Jwt:Audience", "BuckeyeMarketplace");

        builder.ConfigureServices(services =>
        {
            // Replace the real SQLite DbContext with one that uses our shared connection
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (descriptor != null)
                services.Remove(descriptor);

            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlite(_sharedConnection));

            // Remove the background DB initializer — tests manage their own schema
            var hostedDescriptor = services.SingleOrDefault(
                d => d.ImplementationType == typeof(ProductsApi.DbInitializerService));
            if (hostedDescriptor != null)
                services.Remove(hostedDescriptor);

            // Run migrations synchronously so the schema exists before any test runs
            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.Migrate();
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing)
            _sharedConnection.Dispose();
    }
}

