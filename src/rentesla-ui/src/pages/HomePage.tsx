import { ReservationSearchContainer } from '../components/ReservationSearchContainer'
import '../Home.css'

export const HomePage = () => {
    return (
        <div className="text-white pt-6">
            <h1>Welcome to RenTesla!</h1>            
            <ReservationSearchContainer />
        </div>
    )
}