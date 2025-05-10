using RenTesla.API.Data;
using RenTesla.API.Data.Requests;

namespace RenTesla.API.Interfaces;
public interface IReservationByCodeQueryRequestValidator
{
    List<Error> Validate(ReservationByCodeQueryRequest request);
}