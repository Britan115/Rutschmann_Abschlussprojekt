const API_BASE_URL = 'http://localhost:8080/api';

export interface Person {
  id?: number;
  name: string;
  vorname: string;
  thema: string;
  abgabedatum: string;
}

export const personService = {
  async createPerson(person: Person): Promise<Person> {
    const response = await fetch(`${API_BASE_URL}/person`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(person),
    });

    if (!response.ok) {
      throw new Error('Fehler beim Speichern der Person');
    }

    return response.json();
  },
};

