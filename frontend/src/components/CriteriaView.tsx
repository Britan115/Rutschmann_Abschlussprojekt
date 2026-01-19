import { useState, useEffect } from 'react';
import { criteriaService } from '../services/api';
import type { Criteria, Requirement, CriterionProgressRequest } from '../services/api';

interface CriteriaViewProps {
  personId: number;
}

export default function CriteriaView({ personId }: CriteriaViewProps) {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, CriterionProgressRequest>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<Record<string, 'success' | 'error' | null>>({});

  useEffect(() => {
    loadCriteria();
  }, []);

  const loadCriteria = async () => {
    try {
      setLoading(true);
      const response = await criteriaService.getCriteria();
      setCriteria(response.criteria);

      const initialProgress: Record<string, CriterionProgressRequest> = {};
      response.criteria.forEach((c) => {
        initialProgress[c.id] = { fulfilledRequirements: [], notes: '' };
      });
      setProgress(initialProgress);
    } catch {
      setError('Fehler beim Laden der Kriterien');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (criterionId: string, requirementId: string) => {
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
      [criterionId]: { ...(prev[criterionId] || { fulfilledRequirements: [] }), notes },
    }));
  };

  const handleSave = async (criterionId: string) => {
    try {
      setSaving((prev) => ({ ...prev, [criterionId]: true }));
      setSaveStatus((prev) => ({ ...prev, [criterionId]: null }));

      await criteriaService.saveProgress(
        personId,
        criterionId,
        progress[criterionId] || { fulfilledRequirements: [], notes: '' }
      );

      setSaveStatus((prev) => ({ ...prev, [criterionId]: 'success' }));
      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, [criterionId]: null }));
      }, 3000);
    } catch {
      setSaveStatus((prev) => ({ ...prev, [criterionId]: 'error' }));
    } finally {
      setSaving((prev) => ({ ...prev, [criterionId]: false }));
    }
  };

  const getQualityLevel = (count: number): number => {
    if (count >= 6) return 3;
    if (count >= 4) return 2;
    if (count >= 2) return 1;
    return 0;
  };

  if (loading) {
    return <div className="loading-text">Kriterien werden geladen...</div>;
  }

  if (error) {
    return <div className="status-error">{error}</div>;
  }

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Bewertungskriterien</h2>
      </div>

      {criteria.map((criterion) => {
        const currentProgress = progress[criterion.id] || { fulfilledRequirements: [], notes: '' };
        const fulfilledCount = currentProgress.fulfilledRequirements.length;
        const totalCount = criterion.requirements.length;
        const qualityLevel = getQualityLevel(fulfilledCount);
        const progressPercent = Math.round((fulfilledCount / totalCount) * 100);

        return (
          <div key={criterion.id} className="criteria-card">
            <div className="criteria-header">
              <div>
                <div className="criteria-id">{criterion.id}</div>
                <div className="criteria-title">{criterion.title}</div>
                <p className="criteria-question">{criterion.question}</p>
              </div>
              <div className={`quality-badge level-${qualityLevel}`}>
                <span className="quality-badge-value">{qualityLevel}</span>
                <span className="quality-badge-label">Stufe</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-count">{fulfilledCount} von {totalCount} erfüllt</span>
                <span className="progress-percent">{progressPercent}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill level-${qualityLevel}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="requirements-section">
              <div className="requirements-title">Anforderungen</div>
              {criterion.requirements.map((req: Requirement) => {
                const isChecked = currentProgress.fulfilledRequirements.includes(req.id);
                return (
                  <div
                    key={req.id}
                    className={`requirement-item ${isChecked ? 'checked' : ''}`}
                    onClick={() => handleToggle(criterion.id, req.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="requirement-text">
                      <strong>{req.id}:</strong> {req.description}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="notes-section">
              <div className="notes-label">Notizen (optional)</div>
              <textarea
                className="notes-textarea"
                value={currentProgress.notes || ''}
                onChange={(e) => handleNotesChange(criterion.id, e.target.value)}
                placeholder="Notizen zu diesem Kriterium..."
              />
            </div>

            <div className="card-actions">
              <button
                onClick={() => handleSave(criterion.id)}
                disabled={saving[criterion.id]}
                style={{ padding: '10px 20px' }}
              >
                {saving[criterion.id] ? 'Speichern...' : 'Speichern'}
              </button>

              {saveStatus[criterion.id] === 'success' && (
                <span className="status-success">Gespeichert</span>
              )}
              {saveStatus[criterion.id] === 'error' && (
                <span className="status-error">Fehler beim Speichern</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
