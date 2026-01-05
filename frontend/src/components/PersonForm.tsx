import { useState } from 'react';
import { personService, Person } from '../services/api';

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
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Personendaten erfassen</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: errors.name ? '2px solid red' : '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        {errors.name && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.name}</span>}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="vorname" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Vorname *
        </label>
        <input
          type="text"
          id="vorname"
          name="vorname"
          value={formData.vorname}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: errors.vorname ? '2px solid red' : '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        {errors.vorname && (
          <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.vorname}</span>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="thema" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Thema der Arbeit *
        </label>
        <input
          type="text"
          id="thema"
          name="thema"
          value={formData.thema}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: errors.thema ? '2px solid red' : '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        {errors.thema && (
          <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.thema}</span>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="abgabedatum" style={{ display: 'block', marginBottom: '0.5rem' }}>
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
            padding: '0.5rem',
            border: errors.abgabedatum ? '2px solid red' : '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        {errors.abgabedatum && (
          <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.abgabedatum}</span>
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
          padding: '0.75rem',
          backgroundColor: isSubmitting ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
        }}
      >
        {isSubmitting ? 'Wird gespeichert...' : 'Person speichern'}
      </button>
    </form>
  );
}

