// Bootstrap CSS für das Styling der Anwendung
import 'bootstrap/dist/css/bootstrap.min.css';
// React StrictMode für zusätzliche Entwicklungschecks
import { StrictMode } from 'react'
// createRoot API für das Rendern der React-Anwendung
import { createRoot } from 'react-dom/client'
// Globale CSS-Stile
import './index.css'
// Hauptkomponente der Anwendung, die als Layout dient
import App from './App.jsx'
// Import der React Router Komponenten für das Routing
import {BrowserRouter, Route, Routes} from "react-router-dom";
// Import der verschiedenen Seitenkomponenten
import About from "./components/About.jsx";
import PatientDetail from "./components/PatientDetail.jsx";
import Patients from "./components/Patients.jsx";

// Rendern der Anwendung in das DOM
createRoot(document.getElementById('root')).render(
  <StrictMode>
      {/* BrowserRouter ermöglicht die Navigation mit URLs */}
      <BrowserRouter>
          {/* Routes definiert alle verfügbaren Routen der Anwendung */}
          <Routes>
              {/* Hauptroute mit App als Layout-Komponente */}
              <Route path="/" element={<App />}>
                  {/* Index-Route zeigt die Patientenliste an */}
                  <Route index element={<Patients />} />
                  {/* About-Route für die Informationsseite */}
                  <Route path="/about" element={<About />} />
                  {/* Dynamische Route für Patientendetails mit ID-Parameter */}
                  <Route path="/patient/:id" element={<PatientDetail />} />
              </Route>
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
