import { ReservationForm } from './ReservationForm'
import './home.css'

const Home = () => {
    return (
        <div>
            <h1>Welcome to RenTesla!</h1>            
            <ReservationForm />
        </div>
    )
}

// const DateRangeWithPortal = () => {
//     const [dateRange, setDateRange] = useState([null, null]);
//     const [startDate, endDate] = dateRange;
//     return (
//         <DatePicker
//             selectsRange={true}
//             startDate={startDate}
//             endDate={endDate}
//             onChange={(update) => {
//                 setDateRange(update);
//             }}
//             withPortal
//         />
//     );
// };

export { Home }