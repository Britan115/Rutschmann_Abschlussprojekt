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
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '1.5rem', 
          fontWeight: 700, 
          color: '#1a1a1a' 
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
              padding: '1rem 1.5rem', 
              backgroundColor: '#ffffff', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <span style={{ color: '#1a1a1a', fontSize: '1rem', fontWeight: 500 }}>
                <strong style={{ fontWeight: 700 }}>Erfasste Person:</strong> {currentPerson.vorname} {currentPerson.name} - {currentPerson.thema}
              </span>
            </div>

            <nav style={{ 
              marginBottom: '2rem', 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setViewMode('criteria')}
                style={{
                  backgroundColor: viewMode === 'criteria' ? '#2563eb' : '#6b7280',
                }}
              >
                Kriterien bearbeiten
              </button>
              <button
                onClick={() => setViewMode('dashboard')}
                style={{
                  backgroundColor: viewMode === 'dashboard' ? '#2563eb' : '#6b7280',
                }}
              >
                Dashboard anzeigen
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
