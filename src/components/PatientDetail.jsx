// Importieren der React Router Hooks für die Navigation und Zugriff auf Standortdaten
import { useLocation, useNavigate } from 'react-router-dom';
// Importieren der CSS-Stile für diese Komponente
import './PatientDetail.css';

// Komponente zur Anzeige detaillierter Patienteninformationen
function PatientDetail() {
    // Hook zum Zugriff auf die aktuellen Routerinformationen und übergebene Daten
    const location = useLocation();
    // Hook für die Navigation zwischen Routen
    const navigate = useNavigate();
    // Extrahieren der Patientendaten aus dem Routerzustand mit optionalem Chaining
    const patient = location.state?.patient;

    // Anzeige einer Fehlermeldung, wenn keine Patientendaten vorhanden sind
    if (!patient) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger text-center animate-fade-in">
                    <h2><i className="bi bi-exclamation-triangle me-2"></i>Patient nicht gefunden</h2>
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>Zurück zur Liste</button>
                </div>
            </div>
        );
    }

    // Hauptanzeige mit Patientendetails
    return (
        <div className="container py-5 d-flex justify-content-center">
            <div className="card shadow-lg border-0 position-relative overflow-hidden animate-fade-in"
                 style={{
                     maxWidth: 420,
                     width: '100%',
                     borderRadius: 22,
                     boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
                 }}>
                <div className="card-body d-flex flex-column align-items-center p-4 py-5">
                    <div className="avatar-container mb-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center"
                             style={{
                                 width: 100,
                                 height: 100,
                                 background: 'linear-gradient(135deg, #6ea8fe 0%, #0d6efd 100%)',
                                 color: '#fff',
                                 border: '4px solid #fff',
                                 boxShadow: '0 4px 15px rgba(13,110,253,0.25)',
                                 fontSize: 40
                             }}>
                            <span>{patient.firstName[0]}{patient.lastName[0]}</span>
                        </div>
                    </div>
                    <h2 className="fw-bold mb-4" style={{color: '#0d6efd'}}>{patient.firstName} {patient.lastName}</h2>
                    <div className="mb-4 w-100 bg-light p-3 rounded-3" style={{borderLeft: '4px solid #0d6efd'}}>
                        <p><i className="bi bi-person-fill me-2 text-primary"></i><strong>Vorname:</strong> {patient.firstName}</p>
                        <p className="mb-0"><i className="bi bi-person-fill me-2 text-primary"></i><strong>Nachname:</strong> {patient.lastName}</p>
                    </div>
                    <button className="btn btn-primary w-100 py-2"
                            style={{
                                borderRadius: 12,
                                background: 'linear-gradient(135deg, #0d6efd 60%, #6ea8fe 100%)',
                                border: 'none',
                                boxShadow: '0 4px 15px rgba(13,110,253,0.15)'
                            }}
                            onClick={() => navigate('/')}>
                        <i className="bi bi-arrow-left me-2"></i>Zurück zur Liste
                    </button>
                </div>
            </div>
        </div>
    );
}

// Exportieren der Komponente für die Verwendung in anderen Dateien
export default PatientDetail;

