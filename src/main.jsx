import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import About from "./components/About.jsx";
import PatientDetail from "./components/PatientDetail.jsx";
import Patients from "./components/Patients.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<App />}>
                  <Route index element={<Patients />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/patient/:id" element={<PatientDetail />} />
              </Route>
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
