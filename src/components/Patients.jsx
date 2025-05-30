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
            <h2 className="mb-4 text-center fw-bold text-primary" style={{letterSpacing: 1}}>Patientenübersicht</h2>
            <div className="row g-4 justify-content-center">
                {patients.map((patient, index) => (
                    <div 
                        key={index}
                        className="col-12 col-sm-6 col-md-4 col-lg-3"
                    >
                        <div className="card patient-card border-0 h-100 shadow-sm position-relative overflow-hidden" onClick={() => handlePatientClick(patient)} style={{cursor: 'pointer', borderRadius: 22, transition: 'transform 0.18s, box-shadow 0.18s'}}>
                            <div className="card-body text-center d-flex flex-column align-items-center justify-content-center p-4">
                                <div className="avatar-container">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                                         style={{
                                             width: 80,
                                             height: 80,
                                             background: 'linear-gradient(135deg, #6ea8fe 0%, #0d6efd 100%)',
                                             color: '#fff',
                                             border: '4px solid #fff',
                                             boxShadow: '0 4px 15px rgba(13,110,253,0.25)',
                                             position: 'relative',
                                             overflow: 'visible'
                                         }}>
                                        <span style={{fontSize: 28}}>{patient.firstName[0]}{patient.lastName[0]}</span>
                                    </div>
                                </div>
                                <h5 className="card-title fw-bold mb-1" style={{color: '#0d6efd'}}>{patient.firstName} {patient.lastName}</h5>
                                <p className="card-text text-secondary mb-0" style={{fontSize: 15}}>Klicken für Details</p>
                            </div>
                            <div className="card-glow"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Exportieren der Komponente für die Verwendung in anderen Dateien
export default Patients;

