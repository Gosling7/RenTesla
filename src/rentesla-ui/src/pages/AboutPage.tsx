import { useEffect, useState } from 'react';
import axios from 'axios';
import { CarModelDto } from '../types/ApiResults';
import { Header } from '../components/Header';
import { CarModelCard } from '../components/CarModelCard';

export const AboutPage = () => {
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
        <div className="max-w-6xl mx-auto px-8 py-20">
            <Header 
                title="About Our Car Rental"
                subtitle="Discover our premium fleet and exceptional service."
            />

            {error && (
                <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg max-w-2xl mx-auto mb-8 text-center">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {carModels.map((model) => (
                    <CarModelCard model={model}/>
                ))}
            </div>

            <div className="mt-20 text-center">
                <h2 className="text-3xl font-bold dark:text-white mb-6">
                    Why Choose Us?
                </h2>

                <AdditionalAboutInfo />
            </div>
        </div>
    );
};

const AdditionalAboutInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
            {
                title: "Premium Vehicles",
                desc: "Only the finest cars in perfect condition",
                icon: "🚗"
            },
            {
                title: "Flexible Rental",
                desc: "Hourly, daily, or long-term options",
                icon: "⏱️"
            },
            {
                title: "24/7 Support",
                desc: "Always available to assist you",
                icon: "📞"
            }
        ].map((item, index) => (
            <div
                key={index}
                className="p-6 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800"
            >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                    {item.desc}
                </p>
            </div>
        ))}
    </div>
);