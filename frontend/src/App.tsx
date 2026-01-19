import { useState } from 'react';
import PersonForm from './components/PersonForm';
import CriteriaView from './components/CriteriaView';
import Dashboard from './components/Dashboard';
import type { Person } from './services/api';
import './App.css';

type ViewMode = 'criteria' | 'dashboard';

function App() {
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('criteria');

  const handlePersonSaved = (person: Person) => {
    setCurrentPerson(person);
    setViewMode('criteria');
  };

  const getInitials = (person: Person) => {
    return `${person.vorname.charAt(0)}${person.name.charAt(0)}`;
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="app-header-content">
          <div className="app-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <span className="app-title">IPA Kriterien-Tracker</span>
        </div>
      </header>

      <main className="app-main">
        {!currentPerson ? (
          <PersonForm onSuccess={handlePersonSaved} />
        ) : (
          <div>
            <div className="person-banner">
              <div className="person-avatar">{getInitials(currentPerson)}</div>
              <div>
                <div className="person-name">{currentPerson.vorname} {currentPerson.name}</div>
                <div className="person-theme">{currentPerson.thema}</div>
              </div>
            </div>

            <nav className="nav-tabs">
              <button
                className={`nav-tab ${viewMode === 'criteria' ? 'active' : ''}`}
                onClick={() => setViewMode('criteria')}
              >
                Kriterien erfassen
              </button>
              <button
                className={`nav-tab ${viewMode === 'dashboard' ? 'active' : ''}`}
                onClick={() => setViewMode('dashboard')}
              >
                Notenübersicht
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
