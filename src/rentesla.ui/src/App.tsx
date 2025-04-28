import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import DatePicker from 'react-datepicker'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import { RegisterForm } from './components/RegisterForm';
import { Home } from './components/Home';

import "react-datepicker/dist/react-datepicker.css";
import './App.css'

interface CarModelDTO {
    id: string;
    name: string;
    baseDailyRate: number;
};

function App() {
  const [count, setCount] = useState(0)

    //fetchCars();

  return (
    <>      
        <Router>
            <nav>
                <Link to="/register">Register</Link> |{' '}
                <Link to="/">Home</Link> |{' '}
            </nav>
            <Routes>
                <Route path="register" element={<RegisterForm />} />
                <Route path="" element={<Home />} />
            </Routes>
        </Router>
    </>
  )

    async function fetchCars() {
        const response = await fetch('/api/cars/models');
        if (response.ok) {
            const data = await response.json();
            console.log(data);
        }
    }
}

const DateRangeWithPortal = () => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    return (
        <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
                setDateRange(update);
            }}
            withPortal
        />
    );
};

const DateRange = () => {
    const [startDate, setStartDate] = useState(new Date());
    return (
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
    );
};

function CarList() {
    const [cars, setCars] = useState<CarModelDTO[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchCars() {
            try {
                const res = await fetch('/api/cars/models', { credentials: 'include' })
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`)
                }

                const data: CarModelDTO[] = await res.json()
                setCars(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchCars()
    }, [])

    if (loading) { 
        return <p>Loading cars…</p>
    } 
    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>
    } 

    return (
        <div>
            <h2>Available Car Models</h2>
            <ul>
                {cars.map(car => (
                    <li key={car.id}>
                        <strong>{car.name}</strong> - ${car.baseDailyRate.toFixed(2)} / day
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default App
