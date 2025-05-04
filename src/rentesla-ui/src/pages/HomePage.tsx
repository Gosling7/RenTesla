import { ReservationForm } from '../components/ReservationForm'
import '../home.css'

const HomePage = () => {
  return (
    <div className="text-white pt-6">
      <h1>Welcome to RenTesla!</h1>            
      <ReservationForm />
    </div>
  )
}

export { HomePage }