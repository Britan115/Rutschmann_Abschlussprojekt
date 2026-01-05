const API_BASE_URL = 'http://localhost:8080/api';

export interface Person {
  id?: number;
  name: string;
  vorname: string;
  thema: string;
  abgabedatum: string;
}

export interface Requirement {
  id: string;
  description: string;
  module: string;
  part: number;
}

export interface Criteria {
  id: string;
  title: string;
  question: string;
  requirements: Requirement[];
  qualityLevels: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
  };
}

export interface CriteriaResponse {
  criteria: Criteria[];
}

export interface CriterionProgressRequest {
  fulfilledRequirements: string[];
  notes: string;
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

export const criteriaService = {
  async getCriteria(): Promise<CriteriaResponse> {
    const response = await fetch(`${API_BASE_URL}/criteria`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Fehler beim Laden der Kriterien');
    }

    return response.json();
  },

  async saveProgress(
    personId: number,
    criterionId: string,
    progress: CriterionProgressRequest
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/person/${personId}/criteria/${criterionId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progress),
      }
    );

    if (!response.ok) {
      throw new Error('Fehler beim Speichern des Fortschritts');
    }
  },
};

