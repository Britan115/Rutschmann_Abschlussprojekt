import { useState, useEffect, useCallback } from 'react';
import { criteriaService } from '../services/api';
import type { SummaryResponse, CriterionSummary } from '../services/api';

interface DashboardProps {
  personId: number;
}

export default function Dashboard({ personId }: DashboardProps) {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    try {
      setLoading(true);
      const response = await criteriaService.getSummary(personId);
      setSummary(response);
    } catch {
      setError('Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  }, [personId]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const formatGrade = (grade: number | null): string => {
    if (grade === null) return '—';
    return grade.toFixed(2);
  };

  const getGradeStatus = (grade: number | null): { text: string; className: string } => {
    if (grade === null) return { text: '', className: '' };
    if (grade >= 5.5) return { text: 'Sehr gut', className: 'excellent' };
    if (grade >= 5.0) return { text: 'Gut', className: 'good' };
    if (grade >= 4.5) return { text: 'Befriedigend', className: 'satisfactory' };
    if (grade >= 4.0) return { text: 'Genügend', className: 'sufficient' };
    return { text: 'Ungenügend', className: 'insufficient' };
  };

  const getQualityLabel = (level: number): string => {
    switch (level) {
      case 3: return 'Hervorragend';
      case 2: return 'Gut';
      case 1: return 'Genügend';
      default: return 'Ungenügend';
    }
  };

  if (loading) {
    return <div className="loading-text">Daten werden geladen...</div>;
  }

  if (error) {
    return <div className="status-error">{error}</div>;
  }

  if (!summary) {
    return <div className="loading-text">Keine Daten verfügbar</div>;
  }

  const grade1Status = getGradeStatus(summary.estimatedGradePart1);
  const grade2Status = getGradeStatus(summary.estimatedGradePart2);

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Mutmassliche Noten</h2>
        <button className="secondary" onClick={loadSummary} style={{ padding: '8px 16px' }}>
          Aktualisieren
        </button>
      </div>

      <div className="grade-grid">
        <div className="grade-card">
          <div className="grade-card-header">
            <span className="grade-label">Teil 1 - Durchführung</span>
          </div>
          <div className="grade-value">{formatGrade(summary.estimatedGradePart1)}</div>
          {grade1Status.text && (
            <span className={`grade-status ${grade1Status.className}`}>{grade1Status.text}</span>
          )}
        </div>

        <div className="grade-card">
          <div className="grade-card-header">
            <span className="grade-label">Teil 2 - Dokumentation</span>
          </div>
          <div className="grade-value">{formatGrade(summary.estimatedGradePart2)}</div>
          {grade2Status.text && (
            <span className={`grade-status ${grade2Status.className}`}>{grade2Status.text}</span>
          )}
        </div>
      </div>

      <div className="section-header" style={{ marginTop: '2rem' }}>
        <h2 className="section-title">Gütestufen pro Kriterium</h2>
      </div>

      {summary.criteriaSummaries.map((criterion: CriterionSummary) => {
        const progressPercent = Math.round((criterion.fulfilledCount / criterion.totalCount) * 100);

        return (
          <div key={criterion.criterionId} className="criteria-card">
            <div className="criteria-header">
              <div>
                <div className="criteria-id">{criterion.criterionId}</div>
                <div className="criteria-title">{criterion.criterionTitle}</div>
              </div>
              <div className={`quality-badge level-${criterion.qualityLevel}`}>
                <span className="quality-badge-value">{criterion.qualityLevel}</span>
                <span className="quality-badge-label">Stufe</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-count">
                  {criterion.fulfilledCount} von {criterion.totalCount} Anforderungen erfüllt
                </span>
                <span className="progress-percent">{progressPercent}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill level-${criterion.qualityLevel}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Bewertung: {getQualityLabel(criterion.qualityLevel)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
