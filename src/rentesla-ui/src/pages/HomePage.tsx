import { ReservationForm } from '../components/ReservationForm'
import '../home.css'

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to RenTesla!</h1>            
      <ReservationForm />
    </div>
  )
}

export { HomePage }