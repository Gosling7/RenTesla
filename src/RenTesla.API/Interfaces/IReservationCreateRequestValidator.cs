using RenTesla.API.Data;
using RenTesla.API.Data.Requests;

namespace RenTesla.API.Interfaces;
public interface IReservationCreateRequestValidator
{
    List<Error> Validate(ReservationCreateRequest request);
}