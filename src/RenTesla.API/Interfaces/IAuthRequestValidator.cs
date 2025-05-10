using RenTesla.API.Data;
using RenTesla.API.Data.Requests;

namespace RenTesla.API.Interfaces;
public interface IAuthRequestValidator
{
    List<Error> Validate(AuthRequest request);
}