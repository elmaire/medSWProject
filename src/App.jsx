import './App.css'
import Patients from './components/Patients.jsx';
import {useNavigate} from "react-router-dom";

function App() {
    let navigate = useNavigate();

    return (
        <>
        <h1>Patientenliste</h1>
            <Patients />
            <button style={{color: "red"}} onClick={() => {navigate("/about")}}>Go to about page</button>
        </>
    )
}
export default App;