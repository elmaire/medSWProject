// Importieren des React Router Hooks für die Navigation
import { useNavigate } from 'react-router-dom';
// Importieren der CSS-Stile für diese Komponente
import './Patients.css';
// Importieren von React-Hooks für den Lebenszyklus der Komponente und Zustandsverwaltung
import { useState, useEffect } from 'react';

// Komponente zur Anzeige der Liste aller Patienten
function Patients() {
    // Hook für die Navigation zwischen Routen
    const navigate = useNavigate();
    // Zustand für die Patientenliste
    const [patients, setPatients] = useState([]);
    // Zustand für Ladezustand
    const [loading, setLoading] = useState(true);
    // Zustand für eventuelle Fehlermeldungen
    const [error, setError] = useState(null);

    // FHIR-Server URL
    const fhirServerUrl = "http://10.25.6.37:8080/fhir";

    // useEffect-Hook zum Laden der Patientendaten beim ersten Rendering der Komponente
    useEffect(() => {
        // Funktion zum Abrufen der Patientendaten vom FHIR-Server
        const fetchPatients = async () => {
            try {
                // Setze Ladezustand
                setLoading(true);

                // Abruf der Patienten vom FHIR-Server
                const response = await fetch(`${fhirServerUrl}/Patient`);

                // Überprüfung auf erfolgreichen Abruf
                if (!response.ok) {
                    throw new Error(`FHIR-Server antwortete mit Status: ${response.status}`);
                }

                // Umwandlung der Antwort in JSON
                const data = await response.json();

                // Extraktion der relevanten Patientendaten aus der FHIR-Ressource
                const patientData = data.entry ? data.entry.map(entry => {
                    const resource = entry.resource;
                    // Extrahieren des Vor- und Nachnamens aus dem FHIR-Format
                    // FHIR speichert Namen in einem Array von HumanName-Objekten
                    const name = resource.name && resource.name.length > 0 ? resource.name[0] : {};

                    return {
                        id: resource.id || "",
                        firstName: name.given ? name.given[0] || "" : "",
                        lastName: name.family || "",
                        // Weitere Patientendaten könnten hier extrahiert werden
                    };
                }) : [];

                // Aktualisieren des Patientenzustands mit den abgerufenen Daten
                setPatients(patientData);
                // Zurücksetzen des Ladezustands und Fehlers
                setLoading(false);
                setError(null);
            } catch (err) {
                console.error("Fehler beim Abruf der Patientendaten:", err);
                setError(err.message);
                setLoading(false);

                // Fallback zu Demo-Patienten im Fehlerfall
                setPatients([
                    {firstName: "Maria", lastName: "Buslaeva"},
                    {firstName: "Florian", lastName: "Maier"},
                    {firstName: "Hannes", lastName: "Dieter"}
                ]);
            }
        };

        // Aufruf der Funktion zum Abrufen der Patientendaten
        fetchPatients();
    }, []); // Leeres Abhängigkeitsarray bedeutet, dass dieser Effekt nur einmal nach dem ersten Rendering ausgeführt wird

    // Funktion zur Behandlung von Klicks auf Patientenkarten
    // Navigiert zur Detailseite des ausgewählten Patienten und übergibt die Patientendaten
    const handlePatientClick = (patient) => {
        navigate(`/patient/${patient.firstName}-${patient.lastName}`, { state: { patient } });
    };

    // Falls Daten noch geladen werden, zeige Ladeindikator an
    if (loading) {
        return <div className="patients-container"><p>Lade Patientendaten...</p></div>;
    }

    // Falls ein Fehler aufgetreten ist, zeige Fehlermeldung an
    if (error) {
        return <div className="patients-container">
            <p>Fehler beim Laden der Patientendaten: {error}</p>
            <p>Zeige Demo-Patienten an.</p>
            {/* Fortsetzung mit der Anzeige der Patienten-Grid */}
        </div>;
    }

    return (
        <div className="patients-container">
            {/* Falls keine Patienten gefunden wurden */}
            {patients.length === 0 ? (
                <p>Keine Patienten gefunden.</p>
            ) : (
                <div className="patients-grid">
                    {/* Mapping durch die Patientenliste zur Erstellung von Karten für jeden Patienten */}
                    {patients.map((patient, index) => (
                        <div
                            key={patient.id || index} // Verwende die ID als Schlüssel, falls verfügbar, sonst den Index
                            className="patient-card"
                            onClick={() => handlePatientClick(patient)} // Klick-Handler für Navigation zur Detailseite
                        >
                            {/* Avatar mit Initialen des Patienten */}
                            <div className="patient-avatar">
                                {patient.firstName[0] || "?"}{patient.lastName[0] || "?"}
                            </div>
                            {/* Name des Patienten */}
                            <h3>{patient.firstName} {patient.lastName}</h3>
                            {/* Hinweistext für den Benutzer */}
                            <p>Klicken Sie für Details</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Exportieren der Komponente für die Verwendung in anderen Dateien
export default Patients;

