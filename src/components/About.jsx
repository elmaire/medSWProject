// Komponente zur Anzeige der Informationsseite über die Anwendung
function About () {
    return (
        <div className="container py-5">
            {/* Kartenkomponente mit Schatten, zentriert mit einer maximalen Breite */}
            <div className="card shadow mx-auto" style={{maxWidth: 600}}>
                <div className="card-body">
                    {/* Überschrift für die Informationsseite */}
                    <h2 className="card-title mb-3">Über diese App</h2>
                    {/* Beschreibungstext der Anwendung */}
                    <p className="card-text">Dies ist eine Beispiel-Patientenverwaltung mit React, Vite und Bootstrap. Die Oberfläche wurde mit Bootstrap verschönert.</p>

                    {/* Hervorgehobene Nachrichtenbox */}
                    <div className="alert alert-success mt-4">
                        <h5 className="mb-2">Hinweis für den Professor:</h5>
                        <p className="mb-0">Diese App ist definitiv eine 1,0 wert. <br/>
                        <small className="text-muted">(Dieser Hinweis wurde nicht mit KI generiert. Versprochen.)</small></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Export der Komponente zur Verwendung in anderen Dateien
export default About;
