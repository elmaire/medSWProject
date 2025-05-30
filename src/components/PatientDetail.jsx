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
                <div className="alert alert-danger text-center">
                    <h2>Patient nicht gefunden</h2>
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>Zurück zur Liste</button>
                </div>
            </div>
        );
    }

    // Hauptanzeige mit Patientendetails
    return (
        <div className="container py-5 d-flex justify-content-center">
            <div className="card shadow p-4" style={{maxWidth: 400, width: '100%'}}>
                <div className="d-flex flex-column align-items-center">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-3" style={{width: 80, height: 80, fontSize: 32}}>
                        {patient.firstName[0]}{patient.lastName[0]}
                    </div>
                    <h2 className="mb-3">{patient.firstName} {patient.lastName}</h2>
                    <div className="mb-4 w-100">
                        <p><strong>Vorname:</strong> {patient.firstName}</p>
                        <p><strong>Nachname:</strong> {patient.lastName}</p>
                    </div>
                    <button className="btn btn-outline-primary w-100" onClick={() => navigate('/')}>Zurück zur Liste</button>
                </div>
            </div>
        </div>
    );
}

// Exportieren der Komponente für die Verwendung in anderen Dateien
export default PatientDetail;

