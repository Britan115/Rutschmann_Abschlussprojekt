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
      newErrors.name = 'Bitte geben Sie Ihren Nachnamen ein';
    }

    if (!formData.vorname.trim()) {
      newErrors.vorname = 'Bitte geben Sie Ihren Vornamen ein';
    }

    if (!formData.thema.trim()) {
      newErrors.thema = 'Bitte geben Sie das Thema Ihrer Arbeit ein';
    }

    if (!formData.abgabedatum) {
      newErrors.abgabedatum = 'Bitte wählen Sie ein Abgabedatum';
    } else {
      const date = new Date(formData.abgabedatum);
      if (isNaN(date.getTime())) {
        newErrors.abgabedatum = 'Ungültiges Datumsformat';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const savedPerson = await personService.createPerson(formData);
      setFormData({
        name: '',
        vorname: '',
        thema: '',
        abgabedatum: '',
      });
      if (onSuccess) {
        onSuccess(savedPerson);
      }
    } catch (error) {
      setSubmitError('Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
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
    <div className="form-container animate-fade-in">
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-header">
          <div className="form-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="form-title">Willkommen</h1>
          <p className="form-subtitle">Erfassen Sie Ihre Daten, um mit der Bewertung zu beginnen</p>
        </div>

        <div className="form-group">
          <label htmlFor="vorname">
            Vorname <span className="required">*</span>
          </label>
          <input
            type="text"
            id="vorname"
            name="vorname"
            className="form-input"
            value={formData.vorname}
            onChange={handleChange}
            placeholder="Max"
            autoComplete="given-name"
          />
          {errors.vorname && <div className="form-error">{errors.vorname}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="name">
            Nachname <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="Mustermann"
            autoComplete="family-name"
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="thema">
            Thema der Arbeit <span className="required">*</span>
          </label>
          <input
            type="text"
            id="thema"
            name="thema"
            className="form-input"
            value={formData.thema}
            onChange={handleChange}
            placeholder="z.B. Entwicklung einer Webapplikation zur..."
          />
          {errors.thema && <div className="form-error">{errors.thema}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="abgabedatum">
            Abgabedatum <span className="required">*</span>
          </label>
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
          <div className="status-error" style={{ marginBottom: '1.5rem' }}>
            {submitError}
          </div>
        )}

        <button type="submit" className="form-submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-pulse">
                <circle cx="12" cy="12" r="10" />
              </svg>
              Wird gespeichert...
            </>
          ) : (
            <>
              Weiter zur Bewertung
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12,5 19,12 12,19" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
