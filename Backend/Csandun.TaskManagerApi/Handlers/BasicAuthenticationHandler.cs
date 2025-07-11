using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using Csandun.TaskManagerApi.Helpers;
using Csandun.TaskManagerApi.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Csandun.TaskManagerApi.Handlers;

public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly IUserRepository _userRepository;
    
    
    public BasicAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock, 
        IUserRepository userRepository) : 
        base(options, logger, encoder, clock)
    {
        _userRepository = userRepository;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var authorizationHeader = Request.Headers["Authorization"].ToString();
        if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("basic", StringComparison.OrdinalIgnoreCase))
        {
            return AuthenticateResult.NoResult();
        }

        try
        {
            var token = authorizationHeader["Basic ".Length..].Trim();
            var credentialsAsEncodedString = Encoding.UTF8.GetString(Convert.FromBase64String(token));
            var credentials = credentialsAsEncodedString.Split(':', 2);
            
            if (credentials.Length != 2)
            {
                return AuthenticateResult.Fail("Invalid credentials format");
            }

            var username = credentials[0];
            var password = credentials[1];
            
            var user = await _userRepository.GetByUsernameAsync(username, CancellationToken.None);
            if (user != null && string.Equals(user.PasswordHash, password.HashPassword()))
            {
                var claims = new[] 
                { 
                    new Claim(ClaimTypes.Name, username), 
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                };
                var identity = new ClaimsIdentity(claims, Scheme.Name);
                var claimsPrincipal = new ClaimsPrincipal(identity);
                return AuthenticateResult.Success(new AuthenticationTicket(claimsPrincipal, Scheme.Name));
            }
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error during basic authentication");
            return AuthenticateResult.Fail("Authentication error");
        }
        
        return AuthenticateResult.Fail("Invalid username or password");
    }
}