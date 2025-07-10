using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace Csandun.TaskManagerApi.Helpers;

public static class PassworHelper
{
    public static string HashPassword(this string password)
    {
        return Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password,
            salt: "abcde".Select(c => (byte)c).ToArray(), // TODO: use a secure random salt
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 100000,
            numBytesRequested: 256 / 8));
    }
}