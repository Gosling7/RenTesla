import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router'

import { Home } from './components/Home.tsx'
import { CreateReservationPage } from './components/CreateReservationPage.tsx'
import { DefaultLayout } from './components/DefaultLayout.tsx'
import { ReservationsPage } from './components/ReservationsPage.tsx'
import { RegisterPage } from './components/RegisterPage.tsx'
import { LoginPage } from './components/LoginPage.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { UserPage } from './components/UserPage.tsx'
import { AboutPage } from './components/AboutPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>      
        <Routes> 
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Home />}/>
            <Route path="about" element={<AboutPage />}/>
            <Route path="reservations" element={<ReservationsPage />}/>
            <Route path="reservations/create" element={<CreateReservationPage />}/>
            <Route path="register" element={<RegisterPage />}/>
            <Route path="login" element={<LoginPage />}/>
            <Route path="user" element={<UserPage />}/>
          </Route>	
        </Routes>      
      </AuthProvider>
    </BrowserRouter>    
  </StrictMode>
)
