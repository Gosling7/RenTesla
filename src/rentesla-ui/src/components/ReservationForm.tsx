import { useState } from 'react';

const ReservationForm = () => {
  const [roundTrip, setRoundTrip] = useState(true);
  const [filter, setFilter] = useState<'with' | 'without'>('without');

  const inputClass = 'p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400';
  const labelClass = 'text-sm font-medium mb-1';

  return (
    // <div className="bg-gray-900 backdrop-blur-md rounded-xl p-6 shadow-lg w-full max-w-7xl mx-auto mt-6">
    <div className="bg-gray-900 backdrop-blur-md rounded-xl p-6 shadow-lg w-full max-w-9/10 mx-auto mt-6">
      <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Departure */}
        <div className="flex flex-col ">
          <label className={labelClass}>Departure</label>
          <input
            type="text"
            placeholder="City, airport or station"
            className={inputClass}
          />
        </div>       

        {/* Return Location */}
        <div className="flex flex-col">
          <label className={labelClass}>Return Location</label>
          <input
            type="text"
            placeholder="City, airport or station"
            className={inputClass}
          />
        </div>

        {/* Pick Up Date & Time */}
        <div className="flex flex-col">
          <label className={labelClass}>Pick Up Date & Time</label>
          <input
            type="datetime-local"
            className={inputClass}
          />
        </div>

        {/* Return Date & Time */}
        <div className="flex flex-col">
          <label className={labelClass}>Return Date & Time</label>
          <input
            type="datetime-local"
            className={inputClass}
          />
        </div>

        {/* Search Button */}
        <div className="flex col-span-1 sm:col-span-2 md:col-span-4 justify-center">
          <button
            type="submit"
            className={inputClass}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;



// return (
//   // <div className="bg-gray/90 backdrop-blur-md rounded-xl p-6 shadow-lg w-full max-w-5xl mx-auto mt-6">
//   <div className="bg-gray-900 backdrop-blur-md rounded-xl p-6 shadow-lg w-full max-w-5xl mx-auto mt-6">
//     <form className="flex flex-col md:flex-row md:items-end gap-4">
//       {/* Departure */}
//       <div className="flex flex-col flex-1">
//         <label className="text-sm font-medium mb-1">Departure</label>
//         <input
//           type="text"
//           placeholder="City, airport or station"
//           className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>       

//       {/* Return Location */}
//       <div className="flex flex-col flex-1">
//         <label className="text-sm font-medium mb-1">Return Location</label>
//         <input
//           type="text"
//           placeholder="City, airport or station"
//           className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       {/* Pick Up Date & Time */}
//       <div className="flex flex-col flex-1">
//         <label className="text-sm font-medium mb-1">Pick Up Date & Time</label>
//         <input
//           type="datetime-local"
//           className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       {/* Return Date & Time */}
//       <div className="flex flex-col flex-1">
//         <label className="text-sm font-medium mb-1">Return Date & Time</label>
//         <input
//           type="datetime-local"
//           className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       {/* Search Button */}
//       <div className="flex">
//         <button
//           type="submit"
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
//         >
//           Search
//         </button>
//       </div>
//     </form>
//   </div>
// );



 {/* Round Trip Toggle */}
        {/* <div className="flex flex-col items-start">
          <label className="text-sm font-medium mb-1">Round-trip?</label>
          <button
            type="button"
            onClick={() => setRoundTrip(!roundTrip)}
            className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${
              roundTrip ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                roundTrip ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div> */}

        
        {/* Filter (With/Without Driver) */}
        {/* <div className="flex flex-col items-start">
          <label className="text-sm font-medium mb-1">Filter</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilter('without')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'without'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Without Driver
            </button>
            <button
              type="button"
              onClick={() => setFilter('with')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'with'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              With Driver
            </button>
          </div>
        </div> */}


