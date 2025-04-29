import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'

import { Home } from './components/Home.tsx'
import { DefaultLayout } from './components/DefaultLayout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes> 
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />}/>
          <Route path="about" element={<App />}/>
        </Route>	
      </Routes>
    </BrowserRouter>    
  </StrictMode>
)
