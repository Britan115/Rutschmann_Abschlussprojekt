import { useState } from 'react';
import PersonForm from './components/PersonForm';
import CriteriaView from './components/CriteriaView';
import Dashboard from './components/Dashboard';
import type { Person } from './services/api';
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
      <header style={{ 
        padding: '1.25rem 2rem', 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #dee2e6',
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '1.5rem', 
          fontWeight: 600, 
          color: '#2c3e50' 
        }}>
          IPA-Kriterien Erfassungsapplikation
        </h1>
      </header>
      <main style={{ padding: '0 2rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {!currentPerson ? (
          <PersonForm onSuccess={handlePersonSaved} />
        ) : (
          <div>
            <div style={{ 
              marginBottom: '1.5rem', 
              padding: '1rem 1.25rem', 
              backgroundColor: '#ffffff', 
              borderRadius: '4px',
              border: '1px solid #dee2e6'
            }}>
              <span style={{ color: '#495057', fontSize: '0.9375rem' }}>
                <strong>Erfasste Person:</strong> {currentPerson.vorname} {currentPerson.name} - {currentPerson.thema}
              </span>
            </div>

            <nav style={{ 
              marginBottom: '1.5rem', 
              display: 'flex', 
              gap: '0.75rem', 
              justifyContent: 'center',
              borderBottom: '1px solid #dee2e6',
              paddingBottom: '1rem'
            }}>
              <button
                onClick={() => setViewMode('criteria')}
                style={{
                  backgroundColor: viewMode === 'criteria' ? '#495057' : '#6c757d',
                }}
              >
                Kriterien bearbeiten
              </button>
              <button
                onClick={() => setViewMode('dashboard')}
                style={{
                  backgroundColor: viewMode === 'dashboard' ? '#495057' : '#6c757d',
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

