// Import der Bootstrap-Icons für die Benutzeroberfläche
import 'bootstrap-icons/font/bootstrap-icons.css';
// Import der React Router Hooks und Komponenten für Navigation und Rendering
import {useNavigate, Outlet} from "react-router-dom";
// Import der CSS-Stile für diese Komponente
import './App.css';

// Hauptkomponente der Anwendung, die als Layout für alle Seiten dient
function App() {
    // Hook zur programmatischen Navigation zwischen Routen
    let navigate = useNavigate();
    return (
        <>
            {/* Modernisierte Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top border-bottom" style={{zIndex: 1050}}>
                <div className="container">
                    {/* Logo und Applikationsname mit Klick-Navigation zur Startseite */}
                    <span className="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary" style={{cursor: 'pointer', fontSize: 22}} onClick={() => navigate('/')}>
                        <i className="bi bi-hospital-fill" style={{fontSize: 28, color: '#0d6efd'}}></i> Patientenverwaltung
                    </span>
                    {/* Toggle-Button für mobile Navigation */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    {/* Navigationslinks */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto gap-2">
                            <li className="nav-item">
                                <span className="nav-link fw-semibold text-primary" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>Start</span>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link fw-semibold text-primary" style={{cursor: 'pointer'}} onClick={() => navigate('/about')}>Über</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* Hauptinhalt - hier wird die aktive Route über Outlet gerendert */}
            <div className="main-bg min-vh-100 pb-5">
                <div className="container pt-4">
                    <Outlet />
                </div>
            </div>
        </>
    )
}
export default App;
