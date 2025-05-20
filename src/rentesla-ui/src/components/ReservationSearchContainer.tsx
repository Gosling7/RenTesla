import { LocationSelector } from './LocationSelector';
import { DateTimePicker } from './DateTimePicker';
import { AvailableModelsList } from './AvailableModelsList';
import { useAvailableModels } from '../hooks/useAvailableModels';

export const ReservationSearchContainer = () => {
  const {
    locations,
    pickupId, setPickupId,
    dropoffId, setDropoffId,
    from, setFrom,
    to, setTo,
    availableModels,
    searchModels,
  } = useAvailableModels();

  return (
    <div className="bg-gray-900 backdrop-blur-md rounded-xl p-6 shadow-lg w-full max-w-9/10 mx-auto mt-6">
      <form onSubmit={searchModels} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LocationSelector
          label="Departure"
          locations={locations}
          value={pickupId}
          onChange={setPickupId}
        />
        <LocationSelector
          label="Return"
          locations={locations}
          value={dropoffId}
          onChange={setDropoffId}
        />
        <DateTimePicker label="Pick Up Date & Time" value={from} onChange={setFrom} />
        <DateTimePicker label="Return Date & Time" value={to} onChange={setTo} />
        <div className="col-span-full flex justify-center">
          <button className="btn-primary">Search</button>
        </div>
      </form>

      <AvailableModelsList
        locations={locations}
        models={availableModels}
        pickupId={pickupId}
        dropoffId={dropoffId}
        from={from}
        to={to}
      />
    </div>
  );
}