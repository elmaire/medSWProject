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
    // Zustand für Ladezustand beim Löschen
    const [deleting, setDeleting] = useState(false);
    // Zustand für Bestätigungsdialog
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

                // Erweitertes Patientenobjekt erstellen und mit den Grunddaten zusammenführen
                const enhancedPatient = {
                    ...basicPatient,
                    // Überprüfen von allen möglichen FHIR-Feldern und Hinzufügen zum Patientenobjekt
                    birthDate: fhirPatient.birthDate,
                    gender: fhirPatient.gender,
                    address: fhirPatient.address && fhirPatient.address.length > 0 ? fhirPatient.address[0] : null,
                    telecom: fhirPatient.telecom || [],
                    maritalStatus: fhirPatient.maritalStatus?.text || fhirPatient.maritalStatus?.coding?.[0]?.display,
                    // Hier können noch andere FHIR-Felder hinzugefügt werden
                };

                setPatient(enhancedPatient);
                setLoading(false);
            } catch (err) {
                console.error("Fehler beim Abruf der detaillierten Patientendaten:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        // Aufruf der Funktion zum Laden der Patientendaten
        fetchPatientDetails();
    }, [basicPatient]);

    // Funktion zum Löschen eines Patienten
    const deletePatient = async () => {
        if (!patient || !patient.id) return;

        try {
            setDeleting(true);
            // FHIR DELETE-Anfrage zum Löschen des Patienten
            const response = await fetch(`${fhirServerUrl}/Patient/${patient.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/fhir+json'
                }
            });

            if (!response.ok) {
                // Spezifische Fehlerbehandlung für verschiedene Statuscodes
                if (response.status === 409) {
                    throw new Error(`Der Patient kann nicht gelöscht werden, da noch Verweise darauf existieren (z.B. Termine, Befunde).
                    Bitte entfernen Sie zuerst alle verknüpften Daten.`);
                } else {
                    throw new Error(`FHIR-Server antwortete mit Status: ${response.status}`);
                }
            }

            // Navigation zurück zur Patientenliste nach Löschen
            navigate('/');
        } catch (err) {
            console.error("Fehler beim Löschen des Patienten:", err);
            setError(`${err.message}`);
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

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
        return null;
    }

    // Formatierungsfunktion für Adresse
    const formatAddress = (address) => {

        // Zusammensetzen der Adressteile zu einer lesbaren Form
        const parts = [];
        if (address.line && address.line.length > 0) parts.push(address.line.join(", "));
        if (address.postalCode) parts.push(address.postalCode);
        if (address.city) parts.push(address.city);
        if (address.country) parts.push(address.country);

        return parts.join(", ");
    };

    // Formatierungsfunktion für Kontaktinformationen
    const formatContact = (telecom) => {
        if (!telecom || telecom.length === 0) return "Keine Kontaktinformationen verfügbar";

        // Mapping der Kontaktdaten mit passenden Icons basierend auf dem Typ
        return telecom.map(contact => {
            const system = contact.system === 'phone' ? '📞' :
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
                    {patient.firstName && patient.firstName[0] || "?"}
                    {patient.lastName && patient.lastName[0] || "?"}
                </div>

                {/* Vollständiger Name des Patienten als Überschrift */}
                <h2>{patient.firstName} {patient.lastName}</h2>

                {/* Fehleranzeige, falls vorhanden */}
                {error && <p className="error-message">Fehler: {error}</p>}

                {/* Abschnitt für detaillierte Patienteninformationen */}
                <div className="patient-info">
                    <h3>Persönliche Informationen</h3>
                    <p><strong>Vorname:</strong> {patient.firstName}</p>
                    <p><strong>Nachname:</strong> {patient.lastName}</p>
                    {patient.birthDate && <p><strong>Geburtsdatum:</strong> {patient.birthDate}</p>}
                    {patient.gender && <p><strong>Geschlecht:</strong> {patient.gender}</p>}
                    {patient.maritalStatus && <p><strong>Familienstand:</strong> {patient.maritalStatus}</p>}

                    {/* Bedingte Anzeige der Adressinformationen, falls vorhanden */}
                    {patient.address && (
                        <>
                            <h3>Adresse</h3>
                            <p>{formatAddress(patient.address)}</p>
                        </>
                    )}

                    {/* Bedingte Anzeige der Kontaktinformationen, falls vorhanden */}
                    {patient.telecom && patient.telecom.length > 0 && (
                        <>
                            <h3>Kontaktinformationen</h3>
                            <p>{formatContact(patient.telecom)}</p>
                        </>
                    )}
                </div>

                {/* Bestätigungsdialog für das Löschen */}
                {showDeleteConfirm && (
                    <div className="delete-confirmation">
                        <div>
                            <h3>Patient löschen</h3>
                            <p>Möchten Sie diesen Patienten wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
                            <div className="button-group">
                                {/* Bestätigungsbutton zum Löschen */}
                                <button
                                    onClick={deletePatient}
                                    className="delete-confirm-btn"
                                    disabled={deleting}
                                >
                                    {deleting ? 'Wird gelöscht...' : 'Ja, löschen'}
                                </button>
                                {/* Abbrechen-Button zum Schließen des Dialogs */}
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="cancel-btn"
                                    disabled={deleting}
                                >
                                    Abbrechen
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Button-Gruppe für Aktionen */}
                <div className="button-group">
                    {/* Button zur Rückkehr zur Hauptseite */}
                    <button onClick={() => navigate('/')} className="back-btn">Zurück zur Liste</button>

                    {/* Button zum Löschen des Patienten */}
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="delete-btn"
                        disabled={deleting || !patient.id}
                    >
                        {deleting ? 'Wird gelöscht...' : 'Patient löschen'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Exportieren der Komponente für die Verwendung in anderen Dateien
export default PatientDetail;
