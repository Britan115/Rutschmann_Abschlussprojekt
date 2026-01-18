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
        [criterionId]: 'Fortschritt erfolgreich gespeichert',
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
        [criterionId]: 'Fehler beim Speichern',
      }));
    } finally {
      setSaving((prev) => ({ ...prev, [criterionId]: false }));
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: '#1a1a1a', fontSize: '1.125rem' }}>Lade Kriterien...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', color: '#dc2626', fontSize: '1.125rem', fontWeight: 600 }}>{error}</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: '#1a1a1a', fontSize: '1.5rem', fontWeight: 700 }}>
        IPA-Kriterien
      </h2>

      {criteria.map((criterion) => {
        const currentProgress = progress[criterion.id] || {
          fulfilledRequirements: [],
          notes: '',
        };
        const fulfilledCount = currentProgress.fulfilledRequirements.length;
        const totalCount = criterion.requirements.length;

        return (
          <div
            key={criterion.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.75rem',
              marginBottom: '1.5rem',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ 
              marginTop: 0, 
              marginBottom: '0.75rem', 
              color: '#1a1a1a', 
              fontSize: '1.25rem',
              fontWeight: 700 
            }}>
              {criterion.id}: {criterion.title}
            </h3>
            <p style={{ 
              color: '#4b5563', 
              marginBottom: '1.5rem', 
              fontSize: '1rem',
              lineHeight: 1.6 
            }}>
              {criterion.question}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ 
                marginBottom: '1rem', 
                color: '#1a1a1a', 
                fontSize: '1.125rem',
                fontWeight: 600 
              }}>
                Anforderungen:
              </h4>
              {criterion.requirements.map((requirement: Requirement) => {
                const isChecked = currentProgress.fulfilledRequirements.includes(
                  requirement.id
                );

                return (
                  <div
                    key={requirement.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginBottom: '1rem',
                      padding: '0.75rem',
                      backgroundColor: isChecked ? '#f0fdf4' : '#f9fafb',
                      borderRadius: '8px',
                      border: isChecked ? '1px solid #86efac' : '1px solid #e5e7eb',
                    }}
                  >
                    <input
                      type="checkbox"
                      id={`${criterion.id}-${requirement.id}`}
                      checked={isChecked}
                      onChange={() => handleRequirementToggle(criterion.id, requirement.id)}
                      style={{ 
                        marginRight: '12px', 
                        marginTop: '3px',
                        flexShrink: 0 
                      }}
                    />
                    <label
                      htmlFor={`${criterion.id}-${requirement.id}`}
                      style={{
                        flex: 1,
                        cursor: 'pointer',
                        color: '#1a1a1a',
                        fontSize: '0.9375rem',
                        lineHeight: 1.6,
                        fontWeight: 400,
                        margin: 0,
                      }}
                    >
                      <strong style={{ color: '#1a1a1a' }}>{requirement.id}:</strong> {requirement.description}
                    </label>
                  </div>
                );
              })}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor={`notes-${criterion.id}`}
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 600, 
                  color: '#1a1a1a', 
                  fontSize: '1rem' 
                }}
              >
                Notizen:
              </label>
              <textarea
                id={`notes-${criterion.id}`}
                value={currentProgress.notes || ''}
                onChange={(e) => handleNotesChange(criterion.id, e.target.value)}
                placeholder="Notizen zu diesem Kriterium eingeben..."
                rows={3}
                style={{
                  width: '100%',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ 
              marginBottom: '1.25rem', 
              fontSize: '1rem', 
              color: '#1a1a1a',
              fontWeight: 600,
              padding: '0.75rem 1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              display: 'inline-block'
            }}>
              Erfüllt: {fulfilledCount} von {totalCount} Anforderungen
            </div>

            <div>
              <button
                onClick={() => handleSave(criterion.id)}
                disabled={saving[criterion.id]}
              >
                {saving[criterion.id] ? 'Wird gespeichert...' : 'Fortschritt speichern'}
              </button>
            </div>

            {saveMessage[criterion.id] && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: saveMessage[criterion.id].includes('Fehler') ? '#fef2f2' : '#f0fdf4',
                  color: saveMessage[criterion.id].includes('Fehler') ? '#dc2626' : '#16a34a',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                }}
              >
                {saveMessage[criterion.id]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
