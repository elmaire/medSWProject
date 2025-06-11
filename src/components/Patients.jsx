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
    // Zustand für Ladefortschritt
    const [loadedCount, setLoadedCount] = useState(0);
    // Speichert die Gesamtzahl der Patienten auf dem Server
    const [totalCount, setTotalCount] = useState('?');

    // Zustände für die Suchfunktionalität
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('name');
    const [filteredPatients, setFilteredPatients] = useState([]);

    // FHIR-Server URL
    const fhirServerUrl = "http://10.25.6.37:8080/fhir";

    // useEffect-Hook zum Laden der Patientendaten beim ersten Rendering der Komponente
    useEffect(() => {
        // Funktion zum Abrufen der Patientendaten vom FHIR-Server
        const fetchPatients = async () => {
            try {
                setLoading(true);
                setLoadedCount(0);

                // Erste Anfrage, um die Gesamtzahl der Patienten zu ermitteln
                const countResponse = await fetch(`${fhirServerUrl}/Patient?_summary=count`);

                if (!countResponse.ok) {
                    throw new Error(`FHIR-Server antwortete mit Status: ${countResponse.status}`);
                }

                const countData = await countResponse.json();
                const totalPatients = countData.total || '?';
                setTotalCount(totalPatients);

                // Liste für alle Patienten
                let allPatients = [];

                // Wir nutzen eine einfachere Strategie: wir laden alle Seiten nacheinander
                // mit einer festen Anzahl von Patienten pro Seite
                const pageSize = 250;
                let hasMorePages = true;
                let pageIndex = 0;

                while (hasMorePages) {
                    const offset = pageIndex * pageSize;
                    const url = `${fhirServerUrl}/Patient?_count=${pageSize}&_getpagesoffset=${offset}`;

                    const response = await fetch(url);

                    if (!response.ok) {
                        throw new Error(`FHIR-Server antwortete mit Status: ${response.status}`);
                    }

                    const bundle = await response.json();

                    // Patienten aus dem Bundle extrahieren
                    const patientsOnPage = bundle.entry ? bundle.entry.map(entry => {
                        const resource = entry.resource;

                        // Verbesserte Namensverarbeitung
                        let firstName = "";
                        let lastName = "";

                        if (resource.name && resource.name.length > 0) {
                            // Durchlaufe alle verfügbaren Namen und suche nach einem offiziellen Namen
                            const officialName = resource.name.find(n => n.use === 'official') || resource.name[0];

                            // Vorname (kann mehrere given-Namen enthalten)
                            if (officialName.given && officialName.given.length > 0) {
                                firstName = officialName.given.join(' ');
                            }

                            // Nachname (kann ein String oder ein Array sein in manchen FHIR-Implementierungen)
                            if (officialName.family) {
                                if (Array.isArray(officialName.family)) {
                                    lastName = officialName.family.join(' ');
                                } else {
                                    lastName = officialName.family;
                                }
                            }
                        }

                        // Formatiere das Geburtsdatum für bessere Lesbarkeit (YYYY-MM-DD zu DD.MM.YYYY)
                        let formattedBirthDate = "";
                        if (resource.birthDate) {
                            const parts = resource.birthDate.split('-');
                            if (parts.length === 3) {
                                formattedBirthDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
                            } else {
                                formattedBirthDate = resource.birthDate;
                            }
                        }

                        // Formatiere das Geschlecht für bessere Lesbarkeit
                        let formattedGender = "";
                        if (resource.gender) {
                            if (resource.gender === "male") formattedGender = "männlich";
                            else if (resource.gender === "female") formattedGender = "weiblich";
                            else formattedGender = resource.gender;
                        }

                        return {
                            id: resource.id || "",
                            firstName: firstName,
                            lastName: lastName,
                            birthDate: formattedBirthDate,
                            gender: formattedGender
                        };
                    }) : [];

                    // Keine Patienten mehr vorhanden oder weniger als die maximale Anzahl?
                    if (!patientsOnPage.length || patientsOnPage.length < pageSize) {
                        hasMorePages = false;
                    }

                    // Zu den gesamten Patienten hinzufügen
                    allPatients = [...allPatients, ...patientsOnPage];
                    setLoadedCount(allPatients.length);

                    // Aktualisieren der Patientenliste während des Ladens
                    setPatients(allPatients);
                    setFilteredPatients(allPatients);

                    // Inkrementieren des Seitenindex
                    pageIndex++;
                }

                // Laden abgeschlossen
                setLoading(false);

            } catch (err) {
                console.error("Fehler beim Abruf der Patientendaten:", err);
                setError(err.message);
                setLoading(false);

                // Fallback zu Demo-Patienten im Fehlerfall
                const demoPatients = [
                    {firstName: "Maria", lastName: "Buslaeva", birthDate: "01.01.1990", gender: "weiblich"},
                    {firstName: "Florian", lastName: "Maier", birthDate: "15.05.1985", gender: "männlich"},
                    {firstName: "Hannes", lastName: "Dieter", birthDate: "24.12.1978", gender: "männlich"}
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
        // Berechnen des Fortschritts basierend auf geladenen und Gesamtzahl
        const progress = totalCount !== '?'
            ? Math.min(100, (loadedCount / totalCount) * 100)
            : Math.min(95, loadedCount / 10); // Fallback, wenn wir die Gesamtzahl nicht kennen

        return (
            <div className="patients-container">
                <h2>Patienten werden geladen</h2>
                <p>{loadedCount} von {totalCount} Patienten geladen</p>
                <div className="progress-bar-container">
                    <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        );
    }

    // Falls ein Fehler aufgetreten ist, zeige Fehlermeldung an
    if (error) {
        return <div className="patients-container">
            <h2>Fehler beim Laden der Patienten</h2>
            <p>Fehler: {error}</p>
            <p>Zeige Demo-Patienten an.</p>
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
                        <option value="name">Name</option>
                        <option value="birthDate">Geburtsdatum</option>
                        <option value="gender">Geschlecht</option>
                    </select>
                    <input
                        type="text"
                        className="search-input"
                        placeholder={`Suche nach ${searchCriteria === 'name' ? 'Namen' : 
                                        searchCriteria === 'birthDate' ? 'Geburtsdatum' : 'Geschlecht'}`}
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
                                {patient.firstName && patient.firstName[0] || "?"}
                                {patient.lastName && patient.lastName[0] || "?"}
                            </div>
                            {/* Name des Patienten - Fallback, wenn kein Name vorhanden ist */}
                            <h3>{patient.firstName || patient.lastName ?
                                `${patient.firstName || ''} ${patient.lastName || ''}`.trim() :
                                "Unbekannter Patient"}
                            </h3>
                            {/* Zusätzliche Informationen in separaten Elementen */}
                            <div className="patient-details">
                                {patient.birthDate && (
                                    <span className="patient-birth-date">{patient.birthDate}</span>
                                )}
                                {patient.birthDate && patient.gender && (
                                    <span> • </span>
                                )}
                                {patient.gender && (
                                    <span className="patient-gender">{patient.gender}</span>
                                )}
                            </div>
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
