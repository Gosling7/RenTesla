import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'

import { Home } from './components/Home.tsx'
import { CreateReservationPage } from './components/CreateReservationPage.tsx'
import { DefaultLayout } from './components/DefaultLayout.tsx'
import { ReservationsPage } from './components/ReservationsPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes> 
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />}/>
          <Route path="about" element={<App />}/>
          <Route path="reservations" element={<ReservationsPage />}/>
          <Route path="reservations/create" element={<CreateReservationPage />}/>
        </Route>	
      </Routes>
    </BrowserRouter>    
  </StrictMode>
)
