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
      newErrors.name = 'Name ist erforderlich';
    }

    if (!formData.vorname.trim()) {
      newErrors.vorname = 'Vorname ist erforderlich';
    }

    if (!formData.thema.trim()) {
      newErrors.thema = 'Thema ist erforderlich';
    }

    if (!formData.abgabedatum) {
      newErrors.abgabedatum = 'Abgabedatum ist erforderlich';
    } else {
      const date = new Date(formData.abgabedatum);
      if (isNaN(date.getTime())) {
        newErrors.abgabedatum = 'Ungültiges Datum';
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
    <form onSubmit={handleSubmit} style={{ 
      maxWidth: '600px', 
      margin: '0 auto',
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '4px',
      border: '1px solid #dee2e6'
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.25rem' }}>
        Personendaten erfassen
      </h2>

      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#212529', fontSize: '1rem' }}>
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="z.B. Muster"
          style={{
            width: '100%',
            border: errors.name ? '1px solid #dc3545' : '1px solid #ced4da',
          }}
        />
        {errors.name && <span style={{ color: '#dc3545', fontSize: '0.8125rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="vorname" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#212529', fontSize: '1rem' }}>
          Vorname *
        </label>
        <input
          type="text"
          id="vorname"
          name="vorname"
          value={formData.vorname}
          onChange={handleChange}
          placeholder="z.B. Max"
          style={{
            width: '100%',
            border: errors.vorname ? '1px solid #dc3545' : '1px solid #ced4da',
          }}
        />
        {errors.vorname && (
          <span style={{ color: '#dc3545', fontSize: '0.8125rem', marginTop: '0.25rem', display: 'block' }}>{errors.vorname}</span>
        )}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="thema" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#212529', fontSize: '1rem' }}>
          Thema der Arbeit *
        </label>
        <input
          type="text"
          id="thema"
          name="thema"
          value={formData.thema}
          onChange={handleChange}
          placeholder="z.B. Entwicklung einer Webapplikation"
          style={{
            width: '100%',
            border: errors.thema ? '1px solid #dc3545' : '1px solid #ced4da',
          }}
        />
        {errors.thema && (
          <span style={{ color: '#dc3545', fontSize: '0.8125rem', marginTop: '0.25rem', display: 'block' }}>{errors.thema}</span>
        )}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="abgabedatum" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#212529', fontSize: '1rem' }}>
          Abgabedatum *
        </label>
        <input
          type="date"
          id="abgabedatum"
          name="abgabedatum"
          value={formData.abgabedatum}
          onChange={handleChange}
          style={{
            width: '100%',
            border: errors.abgabedatum ? '1px solid #dc3545' : '1px solid #ced4da',
          }}
        />
        {errors.abgabedatum && (
          <span style={{ color: '#dc3545', fontSize: '0.8125rem', marginTop: '0.25rem', display: 'block' }}>{errors.abgabedatum}</span>
        )}
      </div>

      {submitError && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>{submitError}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          marginTop: '0.5rem'
        }}
      >
        {isSubmitting ? 'Wird gespeichert...' : 'Person speichern'}
      </button>
    </form>
  );
}

