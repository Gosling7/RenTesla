namespace RenTesla.API.Data.Requests;

public record ReservationByCodeQueryRequest(
    string ReservationCode,
    string Email);
