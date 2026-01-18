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

      // Initialisiere Progress für jedes Kriterium
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
    return <div>Lade Kriterien...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.25rem', color: '#2c3e50', fontSize: '1.25rem' }}>IPA-Kriterien</h2>

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
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              backgroundColor: '#ffffff',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#2c3e50', fontSize: '1.125rem' }}>
              {criterion.id}: {criterion.title}
            </h3>
            <p style={{ color: '#6c757d', marginBottom: '1.25rem', fontSize: '0.9375rem' }}>{criterion.question}</p>

            <div style={{ marginBottom: '1rem' }}>
              <h4>Anforderungen:</h4>
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
                      marginBottom: '0.75rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      id={`${criterion.id}-${requirement.id}`}
                      checked={isChecked}
                      onChange={() => handleRequirementToggle(criterion.id, requirement.id)}
                      style={{ marginRight: '0.5rem', marginTop: '0.25rem' }}
                    />
                    <label
                      htmlFor={`${criterion.id}-${requirement.id}`}
                      style={{
                        flex: 1,
                        cursor: 'pointer',
                        textDecoration: isChecked ? 'line-through' : 'none',
                        color: isChecked ? '#666' : 'inherit',
                      }}
                    >
                      <strong>{requirement.id}:</strong> {requirement.description}
                    </label>
                  </div>
                );
              })}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor={`notes-${criterion.id}`}
                style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#212529', fontSize: '1rem' }}
              >
                Notizen:
              </label>
              <textarea
                id={`notes-${criterion.id}`}
                value={currentProgress.notes || ''}
                onChange={(e) => handleNotesChange(criterion.id, e.target.value)}
                placeholder="Notizen zu diesem Kriterium..."
                rows={3}
                style={{
                  width: '100%',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
              Erfüllt: {fulfilledCount} von {totalCount} Anforderungen
            </div>

            <button
              onClick={() => handleSave(criterion.id)}
              disabled={saving[criterion.id]}
            >
              {saving[criterion.id] ? 'Wird gespeichert...' : 'Fortschritt speichern'}
            </button>

            {saveMessage[criterion.id] && (
              <div
                style={{
                  marginTop: '0.5rem',
                  color: saveMessage[criterion.id].includes('Fehler') ? 'red' : 'green',
                  fontSize: '0.875rem',
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

