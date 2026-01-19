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
    } catch (err) {
      setError('Fehler beim Laden der Zusammenfassung');
    } finally {
      setLoading(false);
    }
  }, [personId]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const getQualityLevelLabel = (level: number): string => {
    switch (level) {
      case 3: return 'Hervorragend - Alle Anforderungen erfüllt';
      case 2: return 'Gut - 4-5 Anforderungen erfüllt';
      case 1: return 'Genügend - 2-3 Anforderungen erfüllt';
      case 0: return 'Ungenügend - Weniger als 2 erfüllt';
      default: return `Gütestufe ${level}`;
    }
  };

  const getQualityLevelClass = (level: number): string => {
    return `level-${level}`;
  };

  const formatGrade = (grade: number | null): string => {
    if (grade === null) return '—';
    return grade.toFixed(2);
  };

  const getGradeStatus = (grade: number | null): string => {
    if (grade === null) return '';
    if (grade >= 5.5) return 'Sehr gut';
    if (grade >= 5.0) return 'Gut';
    if (grade >= 4.5) return 'Befriedigend';
    if (grade >= 4.0) return 'Genügend';
    return 'Ungenügend';
  };

  if (loading) {
    return (
      <div className="loading-text">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-pulse" style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>
          <circle cx="12" cy="12" r="10" />
        </svg>
        Dashboard wird geladen...
      </div>
    );
  }

  if (error) {
    return <div className="status-error">{error}</div>;
  }

  if (!summary) {
    return <div className="empty-state">Keine Daten verfügbar</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h2 className="section-title">Notenübersicht</h2>
      </div>

      <div className="grade-grid">
        <div className="grade-card">
          <div className="grade-label">Teil 1 - Durchführung</div>
          <div className="grade-value">{formatGrade(summary.estimatedGradePart1)}</div>
          <div className="grade-subtitle">{getGradeStatus(summary.estimatedGradePart1)}</div>
        </div>

        <div className="grade-card part-2">
          <div className="grade-label">Teil 2 - Dokumentation</div>
          <div className="grade-value">{formatGrade(summary.estimatedGradePart2)}</div>
          <div className="grade-subtitle">{getGradeStatus(summary.estimatedGradePart2)}</div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Kriterien im Detail</h2>
        <button onClick={loadSummary} className="secondary" style={{ padding: '10px 20px', minHeight: 'auto', fontSize: '0.875rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23,4 23,10 17,10" />
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
          Aktualisieren
        </button>
      </div>

      <div>
        {summary.criteriaSummaries.map((criterion: CriterionSummary, index: number) => {
          const progressPercentage = (criterion.fulfilledCount / criterion.totalCount) * 100;
          const levelClass = getQualityLevelClass(criterion.qualityLevel);

          return (
            <div
              key={criterion.criterionId}
              className="criteria-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="criteria-header">
                <div>
                  <h3 className="criteria-title">
                    {criterion.criterionId}: {criterion.criterionTitle}
                  </h3>
                  <p className="criteria-question">
                    {criterion.fulfilledCount} von {criterion.totalCount} Anforderungen erfüllt
                  </p>
                </div>
                <div className={`quality-badge ${levelClass}`}>
                  {criterion.qualityLevel}
                </div>
              </div>

              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${levelClass}`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="stats-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
                {getQualityLevelLabel(criterion.qualityLevel)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
