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
      case 3:
        return 'Gütestufe 3 (Alle Anforderungen erfüllt)';
      case 2:
        return 'Gütestufe 2 (4-5 Anforderungen erfüllt)';
      case 1:
        return 'Gütestufe 1 (2-3 Anforderungen erfüllt)';
      case 0:
        return 'Gütestufe 0 (Weniger als 2 Anforderungen erfüllt)';
      default:
        return `Gütestufe ${level}`;
    }
  };

  const getQualityLevelColor = (level: number): string => {
    switch (level) {
      case 3:
        return '#28a745';
      case 2:
        return '#17a2b8';
      case 1:
        return '#ffc107';
      case 0:
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const formatGrade = (grade: number | null): string => {
    if (grade === null) {
      return 'Nicht verfügbar';
    }
    return grade.toFixed(2);
  };

  if (loading) {
    return <div>Lade Dashboard...</div>;
  }

  if (error) {
    return <div style={{ color: '#dc3545' }}>{error}</div>;
  }

  if (!summary) {
    return <div>Keine Daten verfügbar</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.25rem', color: '#2c3e50', fontSize: '1.25rem' }}>Dashboard - Übersicht</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            padding: '1.5rem',
            backgroundColor: '#ffffff',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '0.75rem', color: '#495057', fontSize: '1rem', fontWeight: 600 }}>Teil 1</h3>
          <div style={{ fontSize: '2rem', fontWeight: 600, color: '#2c3e50', marginBottom: '0.5rem' }}>
            {formatGrade(summary.estimatedGradePart1)}
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#6c757d' }}>
            Mutmassliche Note
          </div>
        </div>

        <div
          style={{
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            padding: '1.5rem',
            backgroundColor: '#ffffff',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '0.75rem', color: '#495057', fontSize: '1rem', fontWeight: 600 }}>Teil 2</h3>
          <div style={{ fontSize: '2rem', fontWeight: 600, color: '#2c3e50', marginBottom: '0.5rem' }}>
            {formatGrade(summary.estimatedGradePart2)}
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#6c757d' }}>
            Mutmassliche Note
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem', color: '#2c3e50', fontSize: '1.125rem' }}>Gütestufen pro Kriterium</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {summary.criteriaSummaries.map((criterion: CriterionSummary) => {
          const qualityColor = getQualityLevelColor(criterion.qualityLevel);
          const progressPercentage = (criterion.fulfilledCount / criterion.totalCount) * 100;

          return (
            <div
              key={criterion.criterionId}
              style={{
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                padding: '1.5rem',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#2c3e50', fontSize: '1rem', fontWeight: 600 }}>
                    {criterion.criterionId}: {criterion.criterionTitle}
                  </h4>
                  <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                    {criterion.fulfilledCount} von {criterion.totalCount} Anforderungen erfüllt
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: qualityColor,
                    color: 'white',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '3px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    minWidth: '2.5rem',
                    textAlign: 'center',
                  }}
                >
                  {criterion.qualityLevel}
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${progressPercentage}%`,
                      height: '100%',
                      backgroundColor: qualityColor,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>

              <div style={{ fontSize: '0.8125rem', color: '#6c757d' }}>
                {getQualityLevelLabel(criterion.qualityLevel)}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button onClick={loadSummary}>
          Aktualisieren
        </button>
      </div>
    </div>
  );
}
