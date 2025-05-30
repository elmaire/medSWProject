import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import About from "./components/About.jsx";
import PatientDetail from "./components/PatientDetail.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<App />} />
              <Route path="/about" element={<About />} />
              <Route path="/patient/:id" element={<PatientDetail />} />
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
