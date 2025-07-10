using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace Csandun.TaskManagerApi.Helpers;

public static class PassworHelper
{
    public static string HashPassword(this string password)
    {
        return Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password,
            "abcde".Select(c => (byte)c).ToArray(), // TODO: use a secure random salt
            KeyDerivationPrf.HMACSHA256,
            100000,
            256 / 8));
    }
}