import { useEffect, useState } from 'react';
import axios from 'axios';
import { CarModelDto } from '../types/ApiResults';

const IMAGE_MAP: Record<string, string> = {
  'Tesla Model S': '/images/tesla-model-s.jpg',
  'Tesla Model 3': '/images/tesla-model-3.jpg',
  'Tesla Model Y': '/images/tesla-model-y.jpg',
  'Tesla Model X': '/images/tesla-model-x.jpg',
  'Tesla Cybertruck': '/images/tesla-cybertruck.jpg',
};

const getImageForModel = (name: string): string => IMAGE_MAP[name];

const AboutPage = () => {
    const [carModels, setCarModels] = useState<CarModelDto[]>([]);
    const [error, setError] = useState<string>('');
  
    useEffect(() => {
      const fetchCarModels = async () => {
        try {
          const response = await axios.get<CarModelDto[]>('/api/car-models');
          setCarModels(response.data);
        } catch (err: any) {
          setError('Failed to load car models.');
        }
      };
  
      fetchCarModels();
    }, []);

    return (
      <div className="bg-gray-900 text-white p-8 max-w-5xl mx-auto mt-10 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">About Our Car Rental Service</h1>
        <p className="mb-10 text-lg text-gray-300 text-center">
          Discover a fleet of premium vehicles ready for your next adventure.
        </p>
  
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {carModels.map((model) => (
              <div key={model.id} className="bg-gray-800 rounded-lg overflow-hidden shadow">
                  <img
                      src={getImageForModel(model.name)}
                      alt={model.name}
                      className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                      <h3 className="text-xl font-semibold">{model.name}</h3>
                      <p className="text-gray-300 mt-1">€{model.baseDailyRate} / day</p>
                      <p className="text-gray-300 mt-1">€{model.baseDailyRate / 10} / hour</p>
                  </div>
              </div>
          ))}
        </div>
      </div>
    );
  };
  
  export { AboutPage };
