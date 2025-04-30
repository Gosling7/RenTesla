import { ReservationForm } from './ReservationForm'
import viteLogo from '/vite.svg'

const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            
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