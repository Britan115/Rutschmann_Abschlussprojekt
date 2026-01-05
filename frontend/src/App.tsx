import PersonForm from './components/PersonForm';
import { Person } from './services/api';
import './App.css';

function App() {
  const handlePersonSaved = (person: Person) => {
    alert(`Person "${person.vorname} ${person.name}" wurde erfolgreich gespeichert!`);
  };

  return (
    <div className="App">
      <header style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>IPA-Kriterien Erfassungsapplikation</h1>
      </header>
      <main style={{ padding: '2rem' }}>
        <PersonForm onSuccess={handlePersonSaved} />
      </main>
    </div>
  );
}

export default App;

