using Microsoft.AspNetCore.Identity;

namespace ProductsApi.Models;

public class ApplicationUser : IdentityUser
{
    public string DisplayName { get; set; } = string.Empty;
}
