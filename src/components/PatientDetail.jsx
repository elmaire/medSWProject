// Importieren der React Router Hooks für die Navigation und Zugriff auf Standortdaten
import { useLocation, useNavigate } from 'react-router-dom';
// Importieren der CSS-Stile für diese Komponente
import './PatientDetail.css';
// Importieren von React-Hooks für den Lebenszyklus der Komponente und Zustandsverwaltung
import { useState, useEffect } from 'react';

// Komponente zur Anzeige detaillierter Patienteninformationen
function PatientDetail() {
    // Hook zum Zugriff auf die aktuellen Routerinformationen und übergebene Daten
    const location = useLocation();
    // Hook für die Navigation zwischen Routen
    const navigate = useNavigate();
    // Extrahieren der grundlegenden Patientendaten aus dem Routerzustand mit optionalem Chaining
    const basicPatient = location.state?.patient;

    // Zustand für die erweiterten Patientendaten
    const [patient, setPatient] = useState(basicPatient);
    // Zustand für Ladezustand
    const [loading, setLoading] = useState(false);
    // Zustand für eventuelle Fehlermeldungen
    const [error, setError] = useState(null);

    // FHIR-Server URL
    const fhirServerUrl = "http://10.25.6.37:8080/fhir";

    // useEffect-Hook zum Laden der detaillierten Patientendaten
    useEffect(() => {
        // Prüfen, ob grundlegende Patientendaten vorhanden sind
        if (!basicPatient || !basicPatient.id) {
            return;
        }

        // Funktion zum Abrufen detaillierter Patientendaten vom FHIR-Server
        const fetchPatientDetails = async () => {
            try {
                setLoading(true);

                // Abruf der detaillierten Patientendaten mit der ID
                const response = await fetch(`${fhirServerUrl}/Patient/${basicPatient.id}`);

                if (!response.ok) {
                    throw new Error(`FHIR-Server antwortete mit Status: ${response.status}`);
                }

                const fhirPatient = await response.json();

                // Erweiterte Patientendaten aus FHIR-Ressource extrahieren
                const name = fhirPatient.name && fhirPatient.name.length > 0 ? fhirPatient.name[0] : {};

                // Erweitertes Patientenobjekt erstellen und mit den Grunddaten zusammenführen
                const enhancedPatient = {
                    ...basicPatient,
                    // Überprüfen von allen möglichen FHIR-Feldern und Hinzufügen zum Patientenobjekt
                    birthDate: fhirPatient.birthDate,
                    gender: fhirPatient.gender,
                    address: fhirPatient.address && fhirPatient.address.length > 0 ? fhirPatient.address[0] : null,
                    telecom: fhirPatient.telecom || [],
                    maritalStatus: fhirPatient.maritalStatus?.text || fhirPatient.maritalStatus?.coding?.[0]?.display,
                    // Weitere Felder können hier hinzugefügt werden
                };

                setPatient(enhancedPatient);
                setLoading(false);
            } catch (err) {
                console.error("Fehler beim Abruf der detaillierten Patientendaten:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPatientDetails();
    }, [basicPatient]);

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

    // Anzeige des Ladezustands
    if (loading) {
        return (
            <div className="patient-detail">
                <h2>Lade Patientendetails...</h2>
            </div>
        );
    }

    // Formatierungsfunktion für Adresse
    const formatAddress = (address) => {
        if (!address) return "Keine Adressinformationen verfügbar";

        const parts = [];
        if (address.line && address.line.length > 0) parts.push(address.line.join(", "));
        if (address.postalCode) parts.push(address.postalCode);
        if (address.city) parts.push(address.city);
        if (address.country) parts.push(address.country);

        return parts.join(", ") || "Keine vollständige Adresse verfügbar";
    };

    // Formatierungsfunktion für Kontaktinformationen
    const formatContact = (telecom) => {
        if (!telecom || telecom.length === 0) return "Keine Kontaktinformationen verfügbar";

        return telecom.map(contact => {
            const system = contact.system === 'phone' ? '☎️' :
                           contact.system === 'email' ? '✉️' :
                           contact.system === 'url' ? '🌐' : '';
            return `${system} ${contact.value} (${contact.use || 'unbekannt'})`;
        }).join(", ");
    };

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

                {/* Fehleranzeige, falls vorhanden */}
                {error && <p className="error-message">Fehler beim Laden weiterer Details: {error}</p>}

                {/* Abschnitt für detaillierte Patienteninformationen */}
                <div className="patient-info">
                    <h3>Persönliche Informationen</h3>
                    <p><strong>Vorname:</strong> {patient.firstName}</p>
                    <p><strong>Nachname:</strong> {patient.lastName}</p>
                    {patient.birthDate && <p><strong>Geburtsdatum:</strong> {patient.birthDate}</p>}
                    {patient.gender && <p><strong>Geschlecht:</strong> {patient.gender}</p>}
                    {patient.maritalStatus && <p><strong>Familienstand:</strong> {patient.maritalStatus}</p>}

                    {patient.address && (
                        <>
                            <h3>Adresse</h3>
                            <p>{formatAddress(patient.address)}</p>
                        </>
                    )}

                    {patient.telecom && patient.telecom.length > 0 && (
                        <>
                            <h3>Kontaktinformationen</h3>
                            <p>{formatContact(patient.telecom)}</p>
                        </>
                    )}
                </div>

                {/* Button zur Rückkehr zur Hauptseite */}
                <button onClick={() => navigate('/')}>Zurück zur Liste</button>
            </div>
        </div>
    );
}

// Exportieren der Komponente für die Verwendung in anderen Dateien
export default PatientDetail;
