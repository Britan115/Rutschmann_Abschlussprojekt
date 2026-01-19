import { useState } from 'react';
import { personService } from '../services/api';
import type { Person } from '../services/api';

interface PersonFormProps {
  onSuccess?: (person: Person) => void;
}

export default function PersonForm({ onSuccess }: PersonFormProps) {
  const [formData, setFormData] = useState<Person>({
    name: '',
    vorname: '',
    thema: '',
    abgabedatum: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Person, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Person, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nachname ist erforderlich';
    }
    if (!formData.vorname.trim()) {
      newErrors.vorname = 'Vorname ist erforderlich';
    }
    if (!formData.thema.trim()) {
      newErrors.thema = 'Thema ist erforderlich';
    }
    if (!formData.abgabedatum) {
      newErrors.abgabedatum = 'Abgabedatum ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const savedPerson = await personService.createPerson(formData);
      setFormData({ name: '', vorname: '', thema: '', abgabedatum: '' });
      if (onSuccess) onSuccess(savedPerson);
    } catch {
      setSubmitError('Fehler beim Speichern. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Person]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-header">
          <div className="form-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="form-title">Neue Bewertung starten</h1>
          <p className="form-subtitle">Erfassen Sie die Daten des IPA-Kandidaten</p>
        </div>

        <div className="form-group">
          <label htmlFor="vorname">Vorname <span className="required">*</span></label>
          <input
            type="text"
            id="vorname"
            name="vorname"
            className="form-input"
            value={formData.vorname}
            onChange={handleChange}
            placeholder="Max"
          />
          {errors.vorname && <div className="form-error">{errors.vorname}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="name">Nachname <span className="required">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="Mustermann"
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="thema">Thema der Arbeit <span className="required">*</span></label>
          <input
            type="text"
            id="thema"
            name="thema"
            className="form-input"
            value={formData.thema}
            onChange={handleChange}
            placeholder="z.B. Entwicklung einer Webapplikation"
          />
          {errors.thema && <div className="form-error">{errors.thema}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="abgabedatum">Abgabedatum <span className="required">*</span></label>
          <input
            type="date"
            id="abgabedatum"
            name="abgabedatum"
            className="form-input"
            value={formData.abgabedatum}
            onChange={handleChange}
          />
          {errors.abgabedatum && <div className="form-error">{errors.abgabedatum}</div>}
        </div>

        {submitError && (
          <div className="status-error" style={{ marginBottom: '1rem' }}>{submitError}</div>
        )}

        <button type="submit" className="form-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Wird gespeichert...' : 'Bewertung starten'}
        </button>
      </form>
    </div>
  );
}
