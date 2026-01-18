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
        return '#16a34a'; // Grün
      case 2:
        return '#2563eb'; // Blau
      case 1:
        return '#ca8a04'; // Dunkleres Gelb/Gold
      case 0:
        return '#dc2626'; // Rot
      default:
        return '#6b7280';
    }
  };

  const formatGrade = (grade: number | null): string => {
    if (grade === null) {
      return 'Nicht verfügbar';
    }
    return grade.toFixed(2);
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: '#1a1a1a', fontSize: '1.125rem' }}>Lade Dashboard...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', color: '#dc2626', fontSize: '1.125rem', fontWeight: 600 }}>{error}</div>;
  }

  if (!summary) {
    return <div style={{ padding: '2rem', color: '#1a1a1a', fontSize: '1.125rem' }}>Keine Daten verfügbar</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: '#1a1a1a', fontSize: '1.5rem', fontWeight: 700 }}>
        Dashboard - Übersicht
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div
          style={{
            borderRadius: '12px',
            padding: '2rem',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3 style={{ 
            marginTop: 0, 
            marginBottom: '1rem', 
            color: '#1a1a1a', 
            fontSize: '1.125rem', 
            fontWeight: 600 
          }}>
            Teil 1
          </h3>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            color: '#2563eb', 
            marginBottom: '0.5rem' 
          }}>
            {formatGrade(summary.estimatedGradePart1)}
          </div>
          <div style={{ fontSize: '1rem', color: '#4b5563', fontWeight: 500 }}>
            Mutmassliche Note
          </div>
        </div>

        <div
          style={{
            borderRadius: '12px',
            padding: '2rem',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3 style={{ 
            marginTop: 0, 
            marginBottom: '1rem', 
            color: '#1a1a1a', 
            fontSize: '1.125rem', 
            fontWeight: 600 
          }}>
            Teil 2
          </h3>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            color: '#16a34a', 
            marginBottom: '0.5rem' 
          }}>
            {formatGrade(summary.estimatedGradePart2)}
          </div>
          <div style={{ fontSize: '1rem', color: '#4b5563', fontWeight: 500 }}>
            Mutmassliche Note
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '1.25rem', color: '#1a1a1a', fontSize: '1.25rem', fontWeight: 700 }}>
        Gütestufen pro Kriterium
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {summary.criteriaSummaries.map((criterion: CriterionSummary) => {
          const qualityColor = getQualityLevelColor(criterion.qualityLevel);
          const progressPercentage = (criterion.fulfilledCount / criterion.totalCount) * 100;

          return (
            <div
              key={criterion.criterionId}
              style={{
                borderRadius: '12px',
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    marginTop: 0, 
                    marginBottom: '0.5rem', 
                    color: '#1a1a1a', 
                    fontSize: '1.125rem', 
                    fontWeight: 600 
                  }}>
                    {criterion.criterionId}: {criterion.criterionTitle}
                  </h4>
                  <div style={{ fontSize: '1rem', color: '#4b5563', fontWeight: 500 }}>
                    {criterion.fulfilledCount} von {criterion.totalCount} Anforderungen erfüllt
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: qualityColor,
                    color: '#ffffff',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    minWidth: '3.5rem',
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {criterion.qualityLevel}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e5e7eb',
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

              <div style={{ fontSize: '0.9375rem', color: '#4b5563', fontWeight: 500 }}>
                {getQualityLevelLabel(criterion.qualityLevel)}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button onClick={loadSummary}>
          Daten aktualisieren
        </button>
      </div>
    </div>
  );
}
