import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router'

import { HomePage } from './pages/HomePage.tsx'
import { CreateReservationPage } from './pages/CreateReservationPage.tsx'
import { DefaultLayout } from './components/DefaultLayout.tsx'
import { ReservationsPage } from './pages/ReservationsPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { UserPage } from './pages/UserPage.tsx'
import { AboutPage } from './pages/AboutPage.tsx'
import { StaffPage } from './pages/StaffPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>      
        <Routes> 
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<HomePage />}/>
            <Route path="about" element={<AboutPage />}/>
            <Route path="reservations" element={<ReservationsPage />}/>
            <Route path="reservations/create" element={<CreateReservationPage />}/>
            <Route path="register" element={<RegisterPage />}/>
            <Route path="login" element={<LoginPage />}/>
            <Route path="user" element={<UserPage />}/>
            <Route path="staff" element={<StaffPage />}/>
          </Route>	
        </Routes>      
      </AuthProvider>
    </BrowserRouter>    
  </StrictMode>
)
