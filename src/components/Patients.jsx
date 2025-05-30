// Importieren des React Router Hooks für die Navigation
import { useNavigate } from 'react-router-dom';
// Importieren der CSS-Stile für diese Komponente
import './Patients.css';

// Komponente zur Anzeige der Liste aller Patienten
function Patients() {
    // Hook für die Navigation zwischen Routen
    const navigate = useNavigate();
    // Beispieldaten für Patienten als Array von Objekten
    const patients = [
        {firstName: "Maria", lastName: "Buslaeva"},
        {firstName: "Florian", lastName: "Maier"},
        {firstName: "Hannes", lastName: "Dieter"},
        {firstName: "Patrick", lastName: "Hennes"},
        {firstName: "Tanja", lastName: "Neger"},
        {firstName: "Lukas", lastName: "Pansinger"},
    ];

    // Funktion zur Behandlung von Klicks auf Patientenkarten
    // Navigiert zur Detailseite des ausgewählten Patienten und übergibt die Patientendaten
    const handlePatientClick = (patient) => {
        navigate(`/patient/${patient.firstName}-${patient.lastName}`, { state: { patient } });
    };

    return (
        <div className="patients-container">
            <div className="patients-grid">
                {/* Mapping durch die Patientenliste zur Erstellung von Karten für jeden Patienten */}
                {patients.map((patient, index) => (
                    <div 
                        key={index} // Eindeutiger Schlüssel für jedes Element in der Liste
                        className="patient-card"
                        onClick={() => handlePatientClick(patient)} // Klick-Handler für Navigation zur Detailseite
                    >
                        {/* Avatar mit Initialen des Patienten */}
                        <div className="patient-avatar">
                            {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        {/* Name des Patienten */}
                        <h3>{patient.firstName} {patient.lastName}</h3>
                        {/* Hinweistext für den Benutzer */}
                        <p>Klicken Sie für Details</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Exportieren der Komponente für die Verwendung in anderen Dateien
export default Patients;

