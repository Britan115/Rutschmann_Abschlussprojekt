import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CriteriaView from './CriteriaView';
import * as api from '../services/api';

// Mock des API-Services
vi.mock('../services/api', () => ({
  criteriaService: {
    getCriteria: vi.fn(),
    saveProgress: vi.fn(),
  },
}));

describe('CriteriaView', () => {
  const mockCriteria = [
    {
      id: 'A04',
      title: 'Zeitplan',
      question: 'Was sind die Anforderungen an den Zeitplan?',
      requirements: [
        { id: 'A04-1', description: 'Anforderung 1', module: 'BF', part: 1 },
        { id: 'A04-2', description: 'Anforderung 2', module: 'BF', part: 1 },
      ],
      qualityLevels: {
        level0: 'Weniger als 2',
        level1: '2-3',
        level2: '4-5',
        level3: 'Alle',
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.criteriaService.getCriteria).mockResolvedValue({
      criteria: mockCriteria,
    });
  });

  it('loads and displays all criteria', async () => {
    // TC-COMP-012: CriteriaView lädt und zeigt alle Kriterien
    render(<CriteriaView personId={1} />);

    await waitFor(() => {
      // Der Text wird als "A04: Zeitplan" gerendert
      // Es kann mehrere Elemente mit "Zeitplan" geben, daher getAllByText
      const zeitplanElements = screen.getAllByText(/zeitplan/i);
      expect(zeitplanElements.length).toBeGreaterThan(0);
      expect(api.criteriaService.getCriteria).toHaveBeenCalled();
    });
  });

  it('displays checkboxes for each requirement', async () => {
    // TC-COMP-013: CriteriaView zeigt Checkboxen für jede Anforderung
    render(<CriteriaView personId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Anforderung 1')).toBeInTheDocument();
      expect(screen.getByText('Anforderung 2')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('displays notes field per criterion', async () => {
    // TC-COMP-014: CriteriaView zeigt Notizfeld pro Kriterium
    render(<CriteriaView personId={1} />);

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText(/notizen/i);
      expect(textarea).toBeInTheDocument();
    });
  });

  it('saves progress when checkbox is changed', async () => {
    // TC-COMP-004: CriteriaView speichert Fortschritt bei Checkbox-Änderung
    const user = userEvent.setup();
    vi.mocked(api.criteriaService.saveProgress).mockResolvedValue();

    render(<CriteriaView personId={1} />);

    await waitFor(() => {
      // Es kann mehrere Elemente mit "Zeitplan" geben
      const zeitplanElements = screen.getAllByText(/zeitplan/i);
      expect(zeitplanElements.length).toBeGreaterThan(0);
    });

    const checkboxes = screen.getAllByRole('checkbox');
    if (checkboxes.length > 0) {
      await user.click(checkboxes[0]);

      // Warte auf Save-Button und klicke
      const saveButton = screen.getByRole('button', { name: /fortschritt speichern/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(api.criteriaService.saveProgress).toHaveBeenCalled();
      });
    }
  });

  it('saves notes', async () => {
    // TC-COMP-005: CriteriaView speichert Notizen
    const user = userEvent.setup();
    vi.mocked(api.criteriaService.saveProgress).mockResolvedValue();

    render(<CriteriaView personId={1} />);

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText(/notizen/i);
      expect(textarea).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/notizen zu diesem kriterium/i);
    await user.type(textarea, 'Test Notiz');

    const saveButton = screen.getByRole('button', { name: /fortschritt speichern/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(api.criteriaService.saveProgress).toHaveBeenCalledWith(
        1,
        'A04',
        expect.objectContaining({
          notes: 'Test Notiz',
        })
      );
    });
  });

  it('shows error message on API error', async () => {
    // TC-COMP-017: CriteriaView zeigt Fehlermeldung bei API-Fehler
    vi.mocked(api.criteriaService.getCriteria).mockRejectedValue(new Error('API Error'));

    render(<CriteriaView personId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/fehler beim laden/i)).toBeInTheDocument();
    });
  });
});
