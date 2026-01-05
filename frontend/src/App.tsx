import { useState } from 'react';
import PersonForm from './components/PersonForm';
import CriteriaView from './components/CriteriaView';
import { Person } from './services/api';
import './App.css';

function App() {
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);

  const handlePersonSaved = (person: Person) => {
    setCurrentPerson(person);
    alert(`Person "${person.vorname} ${person.name}" wurde erfolgreich gespeichert!`);
  };

  return (
    <div className="App">
      <header style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>IPA-Kriterien Erfassungsapplikation</h1>
      </header>
      <main style={{ padding: '2rem' }}>
        {!currentPerson ? (
          <PersonForm onSuccess={handlePersonSaved} />
        ) : (
          <div>
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
              <strong>Erfasste Person:</strong> {currentPerson.vorname} {currentPerson.name} - {currentPerson.thema}
            </div>
            <CriteriaView personId={currentPerson.id!} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

