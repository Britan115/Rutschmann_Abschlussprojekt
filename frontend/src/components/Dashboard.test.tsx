import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import * as api from '../services/api';

// Mock des API-Services
vi.mock('../services/api', () => ({
  criteriaService: {
    getSummary: vi.fn(),
  },
}));

describe('Dashboard', () => {
  const mockSummary = {
    criteriaSummaries: [
      {
        criterionId: 'A04',
        criterionTitle: 'Zeitplan',
        fulfilledCount: 6,
        totalCount: 6,
        qualityLevel: 3,
      },
      {
        criterionId: 'H06',
        criterionTitle: 'Automatisierung',
        fulfilledCount: 4,
        totalCount: 6,
        qualityLevel: 2,
      },
    ],
    estimatedGradePart1: 5.2,
    estimatedGradePart2: 4.8,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads summary for person', async () => {
    // TC-COMP-018: Dashboard lädt Summary für Person
    vi.mocked(api.criteriaService.getSummary).mockResolvedValue(mockSummary);

    render(<Dashboard personId={1} />);

    await waitFor(() => {
      expect(api.criteriaService.getSummary).toHaveBeenCalledWith(1);
    });
  });

  it('displays quality level per criterion', async () => {
    // TC-COMP-019: Dashboard zeigt Gütestufe pro Kriterium (0-3)
    vi.mocked(api.criteriaService.getSummary).mockResolvedValue(mockSummary);

    render(<Dashboard personId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/zeitplan/i)).toBeInTheDocument();
      // Gütestufen werden als Zahlen in Badges angezeigt
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('displays estimated grade for part 1', async () => {
    // TC-COMP-020: Dashboard zeigt mutmassliche Note für Teil 1
    vi.mocked(api.criteriaService.getSummary).mockResolvedValue(mockSummary);

    render(<Dashboard personId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/teil 1/i)).toBeInTheDocument();
      expect(screen.getByText(/5\.20/i)).toBeInTheDocument();
    });
  });

  it('displays estimated grade for part 2', async () => {
    // TC-COMP-021: Dashboard zeigt mutmassliche Note für Teil 2
    vi.mocked(api.criteriaService.getSummary).mockResolvedValue(mockSummary);

    render(<Dashboard personId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/teil 2/i)).toBeInTheDocument();
      expect(screen.getByText(/4\.80/i)).toBeInTheDocument();
    });
  });

  it('displays dash when no data available', async () => {
    // TC-COMP-022: Dashboard zeigt "—" wenn keine Daten vorhanden
    const emptySummary = {
      criteriaSummaries: [],
      estimatedGradePart1: null,
      estimatedGradePart2: null,
    };
    vi.mocked(api.criteriaService.getSummary).mockResolvedValue(emptySummary);

    render(<Dashboard personId={1} />);

    await waitFor(() => {
      // "—" wird für fehlende Noten angezeigt
      const dashes = screen.getAllByText('—');
      expect(dashes.length).toBeGreaterThan(0);
    });
  });

  it('shows error message on API error', async () => {
    // TC-COMP-023: Dashboard zeigt Fehlermeldung bei API-Fehler
    vi.mocked(api.criteriaService.getSummary).mockRejectedValue(new Error('API Error'));

    render(<Dashboard personId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/fehler/i)).toBeInTheDocument();
    });
  });
});
