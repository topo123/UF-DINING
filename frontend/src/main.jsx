import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import RestaurantPage from './RestaurantPage.jsx'
import Restaurants from './Restaurants.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
      </Routes>
    </Router>
  </StrictMode>,
)
