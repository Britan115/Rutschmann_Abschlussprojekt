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
        padding: '1.5rem 2rem', 
        backgroundColor: '#ffffff', 
        borderBottom: '2px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '1.75rem', 
          fontWeight: 600, 
          color: '#213547' 
        }}>
          IPA-Kriterien Erfassungsapplikation
        </h1>
      </header>
      <main style={{ padding: '0 2rem 2rem' }}>
        {!currentPerson ? (
          <PersonForm onSuccess={handlePersonSaved} />
        ) : (
          <div>
            <div style={{ 
              marginBottom: '2rem', 
              padding: '1rem 1.5rem', 
              backgroundColor: '#ffffff', 
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <strong style={{ color: '#495057' }}>Erfasste Person:</strong>{' '}
              <span style={{ color: '#007bff', fontWeight: 500 }}>
                {currentPerson.vorname} {currentPerson.name}
              </span>
              {' - '}
              <span style={{ color: '#6c757d' }}>{currentPerson.thema}</span>
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
                  padding: '0.75rem 1.5rem',
                  backgroundColor: viewMode === 'criteria' ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  boxShadow: viewMode === 'criteria' ? '0 4px 8px rgba(0,123,255,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
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
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  boxShadow: viewMode === 'dashboard' ? '0 4px 8px rgba(0,123,255,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
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

