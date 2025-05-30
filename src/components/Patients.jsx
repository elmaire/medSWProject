import { useNavigate } from 'react-router-dom';
import './Patients.css';

function Patients() {
    const navigate = useNavigate();
    const patients = [
        {firstName: "Maria", lastName: "Buslaeva"},
        {firstName: "Florian", lastName: "Maier"},
        {firstName: "Hannes", lastName: "Dieter"},
        {firstName: "Patrick", lastName: "Hennes"},
        {firstName: "Tanja", lastName: "Neger"},
        {firstName: "Lukas", lastName: "Pansinger"},
    ];

    const handlePatientClick = (patient) => {
        navigate(`/patient/${patient.firstName}-${patient.lastName}`, { state: { patient } });
    };

    return (
        <div className="patients-container">
            <div className="patients-grid">
                {patients.map((patient, index) => (
                    <div 
                        key={index}
                        className="patient-card"
                        onClick={() => handlePatientClick(patient)}
                    >
                        <div className="patient-avatar">
                            {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <h3>{patient.firstName} {patient.lastName}</h3>
                        <p>Klicken Sie für Details</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Patients;