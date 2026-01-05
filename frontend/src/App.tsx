import { useState } from 'react';
import PersonForm from './components/PersonForm';
import CriteriaView from './components/CriteriaView';
import Dashboard from './components/Dashboard';
import { Person } from './services/api';
import './App.css';

type ViewMode = 'form' | 'criteria' | 'dashboard';

function App() {
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('form');

  const handlePersonSaved = (person: Person) => {
    setCurrentPerson(person);
    setViewMode('criteria');
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

            <nav style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setViewMode('criteria')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: viewMode === 'criteria' ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Kriterien bearbeiten
              </button>
              <button
                onClick={() => setViewMode('dashboard')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: viewMode === 'dashboard' ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Dashboard
              </button>
            </nav>

            {viewMode === 'criteria' && <CriteriaView personId={currentPerson.id!} />}
            {viewMode === 'dashboard' && <Dashboard personId={currentPerson.id!} />}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

