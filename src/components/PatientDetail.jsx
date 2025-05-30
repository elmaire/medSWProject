import { useLocation, useNavigate } from 'react-router-dom';
import './PatientDetail.css';

function PatientDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const patient = location.state?.patient;

    if (!patient) {
        return (
            <div className="patient-detail">
                <h2>Patient nicht gefunden</h2>
                <button onClick={() => navigate('/')}>Zurück zur Liste</button>
            </div>
        );
    }

    return (
        <div className="patient-detail">
            <div className="patient-detail-card">
                <div className="patient-avatar large">
                    {patient.firstName[0]}{patient.lastName[0]}
                </div>
                <h2>{patient.firstName} {patient.lastName}</h2>
                <div className="patient-info">
                    <p><strong>Vorname:</strong> {patient.firstName}</p>
                    <p><strong>Nachname:</strong> {patient.lastName}</p>
                </div>
                <button onClick={() => navigate('/')}>Zurück zur Liste</button>
            </div>
        </div>
    );
}

export default PatientDetail; 