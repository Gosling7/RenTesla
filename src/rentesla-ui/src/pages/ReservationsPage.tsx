import { useState } from 'react';
import { ReservationDto } from '../types/ApiResults';
import { ReservationDetailsCard } from '../components/ReservationDetailsCard';
import { ReservationSearchForm } from '../components/ReservationSearchForm';
import { SectionCard } from '../components/SectionCard';
import { Header } from '../components/Header';

export const ReservationsPage = () => {
    const [details, setDetails] = useState<ReservationDto | null>(null);

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <Header 
                title="Find Your Reservation"
                subtitle="Enter your details to view your booking information"
            />

            <SectionCard>
                <ReservationSearchForm onResult={(res) => setDetails(res)} />
            </SectionCard>

            {details && <ReservationDetailsCard details={details} />}
        </div>
    );
};