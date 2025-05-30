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
            <div className="patient-detail">
                <h2>Patient nicht gefunden</h2>
                {/* Button zur Rückkehr zur Hauptseite */}
                <button onClick={() => navigate('/')}>Zurück zur Liste</button>
            </div>
        );
    }

    // Hauptanzeige mit Patientendetails
    return (
        <div className="patient-detail">
            <div className="patient-detail-card">
                {/* Avatar des Patienten mit Initialen */}
                <div className="patient-avatar large">
                    {patient.firstName[0]}{patient.lastName[0]}
                </div>
                {/* Vollständiger Name des Patienten als Überschrift */}
                <h2>{patient.firstName} {patient.lastName}</h2>
                {/* Abschnitt für detaillierte Patienteninformationen */}
                <div className="patient-info">
                    <p><strong>Vorname:</strong> {patient.firstName}</p>
                    <p><strong>Nachname:</strong> {patient.lastName}</p>
                </div>
                {/* Button zur Rückkehr zur Hauptseite */}
                <button onClick={() => navigate('/')}>Zurück zur Liste</button>
            </div>
        </div>
    );
}

// Exportieren der Komponente für die Verwendung in anderen Dateien
export default PatientDetail;

