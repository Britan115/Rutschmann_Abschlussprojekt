import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonForm from './PersonForm';
import * as api from '../services/api';

// Mock des API-Services
vi.mock('../services/api', () => ({
  personService: {
    createPerson: vi.fn(),
  },
}));

describe('PersonForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all input fields', () => {
    // TC-COMP-008: PersonForm rendert alle Eingabefelder
    render(<PersonForm />);

    expect(screen.getByLabelText(/^name \*$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^vorname \*$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^thema der arbeit \*$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^abgabedatum \*$/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    // TC-COMP-001: PersonForm zeigt Validierungsfehler bei leeren Pflichtfeldern
    const user = userEvent.setup();
    render(<PersonForm />);

    const submitButton = screen.getByRole('button', { name: /person speichern/i });
    await user.click(submitButton);

    // Die Validierung verhindert das Absenden, daher sollte die API nicht aufgerufen werden
    // Warte kurz, um sicherzustellen, dass keine API-Calls gemacht wurden
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(api.personService.createPerson).not.toHaveBeenCalled();

    // Warte auf Validierungsfehler (React State Update ist asynchron)
    // Prüfe, dass mindestens ein Validierungsfehler angezeigt wird
    await waitFor(
      () => {
        const errors = screen.queryAllByText(/ist erforderlich/i);
        expect(errors.length).toBeGreaterThan(0);
      },
      { timeout: 2000 }
    );
  });

  it('saves person after successful input', async () => {
    // TC-COMP-002: PersonForm speichert Person nach erfolgreicher Eingabe
    const user = userEvent.setup();
    const mockPerson = {
      id: 1,
      name: 'Muster',
      vorname: 'Max',
      thema: 'IPA-Kriterien-App',
      abgabedatum: '2024-12-31',
    };

    vi.mocked(api.personService.createPerson).mockResolvedValue(mockPerson);

    render(<PersonForm onSuccess={mockOnSuccess} />);

    const nameInput = screen.getByLabelText(/^name \*$/i);
    const vornameInput = screen.getByLabelText(/^vorname \*$/i);
    const themaInput = screen.getByLabelText(/^thema der arbeit \*$/i);
    const abgabedatumInput = screen.getByLabelText(/^abgabedatum \*$/i);

    await user.type(nameInput, 'Muster');
    await user.type(vornameInput, 'Max');
    await user.type(themaInput, 'IPA-Kriterien-App');
    await user.type(abgabedatumInput, '2024-12-31');

    const submitButton = screen.getByRole('button', { name: /person speichern/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.personService.createPerson).toHaveBeenCalledWith({
        name: 'Muster',
        vorname: 'Max',
        thema: 'IPA-Kriterien-App',
        abgabedatum: '2024-12-31',
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(mockPerson);
    });
  });

  it('shows error message on API error', async () => {
    // TC-COMP-011: PersonForm zeigt Fehlermeldung bei API-Fehler
    const user = userEvent.setup();
    vi.mocked(api.personService.createPerson).mockRejectedValue(new Error('API Error'));

    render(<PersonForm />);

    const nameInput = screen.getByLabelText(/^name \*$/i);
    const vornameInput = screen.getByLabelText(/^vorname \*$/i);
    const themaInput = screen.getByLabelText(/^thema der arbeit \*$/i);
    const abgabedatumInput = screen.getByLabelText(/^abgabedatum \*$/i);

    await user.type(nameInput, 'Muster');
    await user.type(vornameInput, 'Max');
    await user.type(themaInput, 'IPA-Kriterien-App');
    await user.type(abgabedatumInput, '2024-12-31');

    const submitButton = screen.getByRole('button', { name: /person speichern/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/fehler beim speichern/i)).toBeInTheDocument();
    });
  });
});
