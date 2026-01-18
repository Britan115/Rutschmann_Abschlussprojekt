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
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!summary) {
    return <div>Keine Daten verfügbar</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#213547' }}>Dashboard - Übersicht</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            border: '2px solid #007bff',
            borderRadius: '12px',
            padding: '2rem',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 8px rgba(0,123,255,0.1)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#007bff', fontSize: '1.25rem' }}>Teil 1</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#007bff', marginBottom: '0.5rem' }}>
            {formatGrade(summary.estimatedGradePart1)}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: 500 }}>
            Mutmassliche Note
          </div>
        </div>

        <div
          style={{
            border: '2px solid #28a745',
            borderRadius: '12px',
            padding: '2rem',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 8px rgba(40,167,69,0.1)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#28a745', fontSize: '1.25rem' }}>Teil 2</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#28a745', marginBottom: '0.5rem' }}>
            {formatGrade(summary.estimatedGradePart2)}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: 500 }}>
            Mutmassliche Note
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Gütestufen pro Kriterium</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {summary.criteriaSummaries.map((criterion: CriterionSummary) => {
          const qualityColor = getQualityLevelColor(criterion.qualityLevel);
          const progressPercentage = (criterion.fulfilledCount / criterion.totalCount) * 100;

          return (
            <div
              key={criterion.criterionId}
              style={{
                border: `2px solid ${qualityColor}`,
                borderRadius: '10px',
                padding: '1.75rem',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                transition: 'box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
                    {criterion.criterionId}: {criterion.criterionTitle}
                  </h4>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {criterion.fulfilledCount} von {criterion.totalCount} Anforderungen erfüllt
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: qualityColor,
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                  }}
                >
                  {criterion.qualityLevel}
                </div>
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '4px',
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

              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                {getQualityLevelLabel(criterion.qualityLevel)}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          onClick={loadSummary}
          style={{
            padding: '0.875rem 2rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(0,123,255,0.2)',
            transition: 'all 0.2s ease',
          }}
        >
          Aktualisieren
        </button>
      </div>
    </div>
  );
}

