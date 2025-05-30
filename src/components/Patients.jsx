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
    // Zustand für Ladefortschritt
    const [loadProgress, setLoadProgress] = useState({ current: 0, total: '?' });
    // Zustand für eventuelle Fehlermeldungen
    const [error, setError] = useState(null);

    // Zustände für die Suchfunktionalität
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('name');
    const [filteredPatients, setFilteredPatients] = useState([]);

    // FHIR-Server URL
    const fhirServerUrl = "http://10.25.6.37:8080/fhir";

    // useEffect-Hook zum Laden der Patientendaten beim ersten Rendering der Komponente
    useEffect(() => {
        // Funktion zum Abrufen der Patientendaten vom FHIR-Server mit Paginierung
        const fetchPatients = async () => {
            try {
                // Setze Ladezustand
                setLoading(true);
                setLoadProgress({ current: 0, total: '?' });

                let allPatients = [];
                let nextUrl = `${fhirServerUrl}/Patient?_count=50`; // Starten mit 50 Patienten pro Seite
                let pageCounter = 0;

                // Solange es eine nächste URL gibt, weitere Seiten laden
                while (nextUrl) {
                    pageCounter++;
                    setLoadProgress(prev => ({ ...prev, current: pageCounter }));

                    // Aktuelle Seite abrufen
                    const response = await fetch(nextUrl);

                    if (!response.ok) {
                        throw new Error(`FHIR-Server antwortete mit Status: ${response.status}`);
                    }

                    const bundle = await response.json();

                    // Patienten aus dem Bundle extrahieren
                    if (bundle.entry && bundle.entry.length > 0) {
                        const pagePatients = bundle.entry.map(entry => {
                            const resource = entry.resource;
                            const name = resource.name && resource.name.length > 0 ? resource.name[0] : {};

                            return {
                                id: resource.id || "",
                                firstName: name.given ? name.given[0] || "" : "",
                                lastName: name.family || "",
                                birthDate: resource.birthDate || "",
                                gender: resource.gender || ""
                            };
                        });

                        // Hinzufügen der Patienten dieser Seite zum Gesamtergebnis
                        allPatients = [...allPatients, ...pagePatients];

                        // Aktualisieren des Patientenzustands während des Ladens
                        setPatients([...allPatients]);
                        setFilteredPatients([...allPatients]);
                    }

                    // URL für die nächste Seite finden (falls vorhanden)
                    nextUrl = null;
                    if (bundle.link) {
                        const nextLink = bundle.link.find(link => link.relation === 'next');
                        if (nextLink && nextLink.url) {
                            nextUrl = nextLink.url;

                            // Kurze Pause zwischen den Anfragen, um den Server nicht zu überlasten
                            await new Promise(resolve => setTimeout(resolve, 300));
                        }
                    }
                }

                // Laden abgeschlossen
                setLoadProgress({ current: pageCounter, total: pageCounter });
                setLoading(false);
                setError(null);

                console.log(`Insgesamt ${allPatients.length} Patienten von ${pageCounter} Seiten geladen`);

            } catch (err) {
                console.error("Fehler beim Abruf der Patientendaten:", err);
                setError(err.message);
                setLoading(false);

                // Fallback zu Demo-Patienten im Fehlerfall
                const demoPatients = [
                    {firstName: "Maria", lastName: "Buslaeva", birthDate: "1990-01-01", gender: "female"},
                    {firstName: "Florian", lastName: "Maier", birthDate: "1985-05-15", gender: "male"},
                    {firstName: "Hannes", lastName: "Dieter", birthDate: "1978-12-24", gender: "male"}
                ];
                setPatients(demoPatients);
                setFilteredPatients(demoPatients);
            }
        };

        // Aufruf der Funktion zum Abrufen der Patientendaten
        fetchPatients();
    }, []);

    // useEffect-Hook zur Filterung der Patientenliste beim Ändern des Suchbegriffs oder Kriteriums
    useEffect(() => {
        if (!searchTerm) {
            setFilteredPatients(patients);
            return;
        }

        const lowercasedSearch = searchTerm.toLowerCase();

        // Filtern der Patienten basierend auf dem ausgewählten Suchkriterium
        const filtered = patients.filter(patient => {
            switch (searchCriteria) {
                case 'name':
                    return (
                        (patient.firstName && patient.firstName.toLowerCase().includes(lowercasedSearch)) ||
                        (patient.lastName && patient.lastName.toLowerCase().includes(lowercasedSearch))
                    );
                case 'firstName':
                    return patient.firstName && patient.firstName.toLowerCase().includes(lowercasedSearch);
                case 'lastName':
                    return patient.lastName && patient.lastName.toLowerCase().includes(lowercasedSearch);
                case 'birthDate':
                    return patient.birthDate && patient.birthDate.includes(searchTerm);
                case 'gender':
                    return patient.gender && patient.gender.toLowerCase().includes(lowercasedSearch);
                default:
                    return true;
            }
        });

        setFilteredPatients(filtered);
    }, [searchTerm, searchCriteria, patients]);

    // Funktion zum Aktualisieren des Suchbegriffs beim Ändern des Eingabefelds
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Funktion zum Aktualisieren des Suchkriteriums beim Ändern der Dropdown-Auswahl
    const handleCriteriaChange = (e) => {
        setSearchCriteria(e.target.value);
    };

    // Funktion zur Behandlung von Klicks auf Patientenkarten
    // Navigiert zur Detailseite des ausgewählten Patienten und übergibt die Patientendaten
    const handlePatientClick = (patient) => {
        navigate(`/patient/${patient.firstName}-${patient.lastName}`, { state: { patient } });
    };

    // Falls Daten noch geladen werden, zeige Ladeindikator an
    if (loading) {
        return (
            <div className="patients-container">
                <p>Lade Patientendaten... Seite {loadProgress.current} von {loadProgress.total}</p>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{width: `${(loadProgress.current / (loadProgress.total === '?' ? loadProgress.current + 1 : loadProgress.total)) * 100}%`}}></div>
                </div>
            </div>
        );
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
            {/* Suchleiste mit Dropdown-Menü für Suchkriterien */}
            <div className="search-container">
                <div className="search-box">
                    <select
                        className="search-criteria"
                        value={searchCriteria}
                        onChange={handleCriteriaChange}
                    >
                        <option value="name">Name (Vor- oder Nachname)</option>
                        <option value="firstName">Vorname</option>
                        <option value="lastName">Nachname</option>
                        <option value="birthDate">Geburtsdatum</option>
                        <option value="gender">Geschlecht</option>
                    </select>
                    <input
                        type="text"
                        className="search-input"
                        placeholder={`Suche nach ${searchCriteria === 'name' ? 'Namen' : 
                                        searchCriteria === 'firstName' ? 'Vornamen' : 
                                        searchCriteria === 'lastName' ? 'Nachnamen' : 
                                        searchCriteria === 'birthDate' ? 'Geburtsdatum (YYYY-MM-DD)' : 'Geschlecht'}`}
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                {searchTerm && (
                    <p className="search-results">
                        {filteredPatients.length} {filteredPatients.length === 1 ? 'Patient' : 'Patienten'} gefunden
                    </p>
                )}
                <p className="total-patients">Insgesamt {patients.length} Patienten geladen</p>
            </div>

            {/* Falls keine Patienten gefunden wurden */}
            {filteredPatients.length === 0 ? (
                <p>Keine Patienten gefunden.</p>
            ) : (
                <div className="patients-grid">
                    {/* Mapping durch die gefilterte Patientenliste zur Erstellung von Karten für jeden Patienten */}
                    {filteredPatients.map((patient, index) => (
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
