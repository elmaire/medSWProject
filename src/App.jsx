// Importieren der Stildatei und notwendiger Komponenten
import './App.css'
import Patients from './components/Patients.jsx';
import {useNavigate} from "react-router-dom"; // Import des React Router Hooks für die Navigation

// Hauptkomponente der Anwendung
function App() {
    // Hook für die Navigation zwischen Routen
    let navigate = useNavigate();

    return (
        <>
        {/* Überschrift für die Patientenliste */}
        <h1>Patientenliste</h1>
            {/* Einbinden der Patientenkomponente */}
            <Patients />
            {/* Button zum Navigieren zur About-Seite mit roter Textfarbe */}
            <button style={{color: "red"}} onClick={() => {navigate("/about")}}>Go to about page</button>
        </>
    )
}
export default App; // Exportieren der Komponente für die Verwendung in anderen Dateien

