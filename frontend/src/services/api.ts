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

export interface CriterionSummary {
  criterionId: string;
  criterionTitle: string;
  fulfilledCount: number;
  totalCount: number;
  qualityLevel: number;
}

export interface SummaryResponse {
  criteriaSummaries: CriterionSummary[];
  estimatedGradePart1: number | null;
  estimatedGradePart2: number | null;
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

  async getSummary(personId: number): Promise<SummaryResponse> {
    const response = await fetch(`${API_BASE_URL}/person/${personId}/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Fehler beim Laden der Zusammenfassung');
    }

    return response.json();
  },
};

