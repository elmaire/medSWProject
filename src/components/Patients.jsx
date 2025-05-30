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
        <div className="container py-4">
            <h2 className="mb-4 text-center">Patientenübersicht</h2>
            <div className="row g-4 justify-content-center">
                {patients.map((patient, index) => (
                    <div 
                        key={index}
                        className="col-12 col-sm-6 col-md-4 col-lg-3"
                    >
                        <div className="card h-100 shadow patient-card-hover" onClick={() => handlePatientClick(patient)} style={{cursor: 'pointer'}}>
                            <div className="card-body text-center">
                                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{width: 60, height: 60, fontSize: 24}}>
                                    {patient.firstName[0]}{patient.lastName[0]}
                                </div>
                                <h5 className="card-title">{patient.firstName} {patient.lastName}</h5>
                                <p className="card-text text-muted">Klicken Sie für Details</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Exportieren der Komponente für die Verwendung in anderen Dateien
export default Patients;

