import { useState, useEffect } from 'react';
import { criteriaService } from '../services/api';
import type {
  Criteria,
  Requirement,
  CriterionProgressRequest,
} from '../services/api';

interface CriteriaViewProps {
  personId: number;
}

export default function CriteriaView({ personId }: CriteriaViewProps) {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, CriterionProgressRequest>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saveMessage, setSaveMessage] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCriteria();
  }, []);

  const loadCriteria = async () => {
    try {
      setLoading(true);
      const response = await criteriaService.getCriteria();
      setCriteria(response.criteria);

      const initialProgress: Record<string, CriterionProgressRequest> = {};
      response.criteria.forEach((criterion) => {
        initialProgress[criterion.id] = {
          fulfilledRequirements: [],
          notes: '',
        };
      });
      setProgress(initialProgress);
    } catch (err) {
      setError('Fehler beim Laden der Kriterien');
    } finally {
      setLoading(false);
    }
  };

  const handleRequirementToggle = (criterionId: string, requirementId: string) => {
    setProgress((prev) => {
      const current = prev[criterionId] || { fulfilledRequirements: [], notes: '' };
      const fulfilled = current.fulfilledRequirements || [];
      const isChecked = fulfilled.includes(requirementId);

      return {
        ...prev,
        [criterionId]: {
          ...current,
          fulfilledRequirements: isChecked
            ? fulfilled.filter((id) => id !== requirementId)
            : [...fulfilled, requirementId],
        },
      };
    });
  };

  const handleNotesChange = (criterionId: string, notes: string) => {
    setProgress((prev) => ({
      ...prev,
      [criterionId]: {
        ...(prev[criterionId] || { fulfilledRequirements: [] }),
        notes,
      },
    }));
  };

  const handleSave = async (criterionId: string) => {
    try {
      setSaving((prev) => ({ ...prev, [criterionId]: true }));
      setSaveMessage((prev) => ({ ...prev, [criterionId]: '' }));

      const currentProgress = progress[criterionId] || {
        fulfilledRequirements: [],
        notes: '',
      };

      await criteriaService.saveProgress(personId, criterionId, currentProgress);

      setSaveMessage((prev) => ({
        ...prev,
        [criterionId]: 'success',
      }));

      setTimeout(() => {
        setSaveMessage((prev) => {
          const newMessages = { ...prev };
          delete newMessages[criterionId];
          return newMessages;
        });
      }, 3000);
    } catch (err) {
      setSaveMessage((prev) => ({
        ...prev,
        [criterionId]: 'error',
      }));
    } finally {
      setSaving((prev) => ({ ...prev, [criterionId]: false }));
    }
  };

  const getQualityLevel = (fulfilledCount: number): number => {
    if (fulfilledCount >= 6) return 3;
    if (fulfilledCount >= 4) return 2;
    if (fulfilledCount >= 2) return 1;
    return 0;
  };

  if (loading) {
    return (
      <div className="loading-text">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-pulse" style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>
          <circle cx="12" cy="12" r="10" />
        </svg>
        Kriterien werden geladen...
      </div>
    );
  }

  if (error) {
    return <div className="status-error">{error}</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h2 className="section-title">Bewertungskriterien</h2>
      </div>

      {criteria.map((criterion, index) => {
        const currentProgress = progress[criterion.id] || {
          fulfilledRequirements: [],
          notes: '',
        };
        const fulfilledCount = currentProgress.fulfilledRequirements.length;
        const totalCount = criterion.requirements.length;
        const qualityLevel = getQualityLevel(fulfilledCount);
        const progressPercentage = (fulfilledCount / totalCount) * 100;

        return (
          <div
            key={criterion.id}
            className="criteria-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="criteria-header">
              <div>
                <h3 className="criteria-title">
                  {criterion.id}: {criterion.title}
                </h3>
                <p className="criteria-question">{criterion.question}</p>
              </div>
              <div className={`quality-badge level-${qualityLevel}`}>
                {qualityLevel}
              </div>
            </div>

            <div className="progress-container" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="stats-badge" style={{ background: 'transparent', padding: 0 }}>
                  {fulfilledCount} von {totalCount} erfüllt
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill level-${qualityLevel}`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ 
                fontSize: '0.9375rem', 
                fontWeight: 600, 
                color: 'var(--text-primary)', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22,4 12,14.01 9,11.01" />
                </svg>
                Anforderungen
              </h4>
              {criterion.requirements.map((requirement: Requirement) => {
                const isChecked = currentProgress.fulfilledRequirements.includes(requirement.id);

                return (
                  <div
                    key={requirement.id}
                    className={`requirement-item ${isChecked ? 'checked' : ''}`}
                    onClick={() => handleRequirementToggle(criterion.id, requirement.id)}
                  >
                    <input
                      type="checkbox"
                      className="requirement-checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="requirement-text">
                      <strong>{requirement.id}:</strong> {requirement.description}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="notes-section">
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '0.75rem',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Notizen
              </label>
              <textarea
                className="notes-textarea"
                value={currentProgress.notes || ''}
                onChange={(e) => handleNotesChange(criterion.id, e.target.value)}
                placeholder="Fügen Sie hier Ihre Notizen hinzu, z.B. was noch fehlt oder Verbesserungsvorschläge..."
                rows={3}
              />
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-color)'
            }}>
              <button
                onClick={() => handleSave(criterion.id)}
                disabled={saving[criterion.id]}
                style={{ minHeight: '46px', padding: '12px 24px' }}
              >
                {saving[criterion.id] ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-pulse">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    Speichern...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                      <polyline points="17,21 17,13 7,13 7,21" />
                      <polyline points="7,3 7,8 15,8" />
                    </svg>
                    Speichern
                  </>
                )}
              </button>

              {saveMessage[criterion.id] && (
                <div className={saveMessage[criterion.id] === 'error' ? 'status-error' : 'status-success'} style={{ padding: '0.75rem 1rem' }}>
                  {saveMessage[criterion.id] === 'error' ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                      Fehler beim Speichern
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                      Gespeichert
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
