# Testfalldokumentation

## Übersicht

Diese Dokumentation beschreibt alle Testfälle für die IPA-Kriterien-Erfassungsapplikation mit detaillierten Angaben zu Vorbedingungen, Eingaben, erwarteten Ergebnissen und Nachbedingungen.

## Testfall-Format

Jeder Testfall enthält:
- **Testfall-ID**: Eindeutige Identifikation
- **Testart**: Unit, Integration, Component, API
- **Priorität**: Hoch (P0), Mittel (P1), Niedrig (P2)
- **Vorbedingungen**: Was muss vor dem Test erfüllt sein
- **Eingaben**: Welche Daten/Parameter werden verwendet
- **Erwartetes Ergebnis**: Was soll passieren
- **Nachbedingungen**: Zustand nach dem Test

## Unit Tests

### TC-UNIT-001: calculateQualityLevel() - Gütestufe 3 bei allen Anforderungen erfüllt

**Testart**: Unit Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-06

**Vorbedingungen**:
- `SummaryService` ist instanziiert
- Methode `calculateQualityLevel()` ist verfügbar

**Eingaben**:
- `fulfilledCount = 6` (alle Anforderungen erfüllt)
- `totalCount = 6` (Gesamtanzahl Anforderungen)

**Erwartetes Ergebnis**:
- Rückgabewert: `3` (Gütestufe 3)

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Methode gibt korrekten Wert zurück

---

### TC-UNIT-002: calculateQualityLevel() - Gütestufe 2 bei 4-5 Anforderungen erfüllt

**Testart**: Unit Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-06

**Vorbedingungen**:
- `SummaryService` ist instanziiert
- Methode `calculateQualityLevel()` ist verfügbar

**Eingaben**:
- `fulfilledCount = 4` (4 Anforderungen erfüllt)
- `totalCount = 6` (Gesamtanzahl Anforderungen)

**Erwartetes Ergebnis**:
- Rückgabewert: `2` (Gütestufe 2)

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Methode gibt korrekten Wert zurück

**Zusätzliche Testfälle**:
- `fulfilledCount = 5`, `totalCount = 6` → `2` (Gütestufe 2)

---

### TC-UNIT-003: calculateQualityLevel() - Gütestufe 1 bei 2-3 Anforderungen erfüllt

**Testart**: Unit Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-06

**Vorbedingungen**:
- `SummaryService` ist instanziiert
- Methode `calculateQualityLevel()` ist verfügbar

**Eingaben**:
- `fulfilledCount = 2` (2 Anforderungen erfüllt)
- `totalCount = 6` (Gesamtanzahl Anforderungen)

**Erwartetes Ergebnis**:
- Rückgabewert: `1` (Gütestufe 1)

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Methode gibt korrekten Wert zurück

**Zusätzliche Testfälle**:
- `fulfilledCount = 3`, `totalCount = 6` → `1` (Gütestufe 1)

---

### TC-UNIT-004: calculateQualityLevel() - Gütestufe 0 bei weniger als 2 Anforderungen erfüllt

**Testart**: Unit Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-06

**Vorbedingungen**:
- `SummaryService` ist instanziiert
- Methode `calculateQualityLevel()` ist verfügbar

**Eingaben**:
- `fulfilledCount = 1` (1 Anforderung erfüllt)
- `totalCount = 6` (Gesamtanzahl Anforderungen)

**Erwartetes Ergebnis**:
- Rückgabewert: `0` (Gütestufe 0)

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Methode gibt korrekten Wert zurück

**Zusätzliche Testfälle**:
- `fulfilledCount = 0`, `totalCount = 6` → `0` (Gütestufe 0)

---

### TC-UNIT-005: determinePart() - Ordnet Kriterium korrekt Teil 1 oder 2 zu

**Testart**: Unit Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-06

**Vorbedingungen**:
- `SummaryService` ist instanziiert
- Methode `determinePart()` ist verfügbar
- Test-Kriterium mit Requirements vorhanden

**Eingaben**:
- Kriterium mit 6 Requirements, alle `part = 1`

**Erwartetes Ergebnis**:
- Rückgabewert: `1` (Teil 1)

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Methode gibt korrekten Wert zurück

**Zusätzliche Testfälle**:
- Kriterium mit 6 Requirements, alle `part = 2` → `2` (Teil 2)
- Kriterium mit 4 Requirements `part = 1`, 2 Requirements `part = 2` → `1` (Mehrheit Teil 1)
- Kriterium mit 2 Requirements `part = 1`, 4 Requirements `part = 2` → `2` (Mehrheit Teil 2)

---

### TC-UNIT-006: Notenberechnung - Gütestufe 3 → Note 5.5

**Testart**: Unit Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-06

**Vorbedingungen**:
- `SummaryService` ist instanziiert
- Notenberechnung in `calculateSummary()` implementiert

**Eingaben**:
- Durchschnittliche Gütestufe: `3.0` (alle Kriterien Teil 1 haben Gütestufe 3)
- Anzahl Kriterien Teil 1: `2`

**Erwartetes Ergebnis**:
- `estimatedGradePart1 = 4.0 + (3.0 * 0.5) = 5.5`

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Berechnung korrekt

---

### TC-UNIT-007: Notenberechnung - Gütestufe 0 → Note 4.0

**Testart**: Unit Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-06

**Vorbedingungen**:
- `SummaryService` ist instanziiert
- Notenberechnung in `calculateSummary()` implementiert

**Eingaben**:
- Durchschnittliche Gütestufe: `0.0` (alle Kriterien Teil 1 haben Gütestufe 0)
- Anzahl Kriterien Teil 1: `2`

**Erwartetes Ergebnis**:
- `estimatedGradePart1 = 4.0 + (0.0 * 0.5) = 4.0`

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Berechnung korrekt

---

## API Tests

### TC-API-001: GET /api/criteria - Status 200 OK

**Testart**: Integration Test, API Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-03

**Vorbedingungen**:
- Backend-Server läuft
- `criteria.json` existiert im `src/main/resources/` Verzeichnis
- Datenbankverbindung nicht erforderlich

**Eingaben**:
- HTTP GET Request: `http://localhost:8080/api/criteria`
- Headers: `Content-Type: application/json`

**Erwartetes Ergebnis**:
- HTTP Status Code: `200 OK`
- Response Body: JSON-Objekt mit `criteria` Array

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Response ist gültiges JSON

---

### TC-API-002: GET /api/criteria - Response enthält alle 3 Kriterien

**Testart**: Integration Test, API Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-03

**Vorbedingungen**:
- Backend-Server läuft
- `criteria.json` enthält genau 3 Kriterien (A04, H06, Doc03)

**Eingaben**:
- HTTP GET Request: `http://localhost:8080/api/criteria`

**Erwartetes Ergebnis**:
- Response enthält `criteria` Array mit genau 3 Elementen
- Kriterien-IDs: `"A04"`, `"H06"`, `"Doc03"`

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Alle Kriterien vorhanden

---

### TC-API-003: GET /api/criteria - Jedes Kriterium enthält alle erforderlichen Felder

**Testart**: Integration Test, API Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-03

**Vorbedingungen**:
- Backend-Server läuft
- `criteria.json` ist korrekt formatiert

**Eingaben**:
- HTTP GET Request: `http://localhost:8080/api/criteria`

**Erwartetes Ergebnis**:
- Jedes Kriterium enthält:
  - `id` (String)
  - `title` (String)
  - `question` (String)
  - `requirements` (Array)
  - `qualityLevels` (Object mit level0, level1, level2, level3)

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Alle Felder vorhanden

---

### TC-API-004: GET /api/criteria - Jede Requirement enthält alle erforderlichen Felder

**Testart**: Integration Test, API Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-03

**Vorbedingungen**:
- Backend-Server läuft
- `criteria.json` ist korrekt formatiert

**Eingaben**:
- HTTP GET Request: `http://localhost:8080/api/criteria`

**Erwartetes Ergebnis**:
- Jede Requirement enthält:
  - `id` (String, z.B. "A04-1")
  - `description` (String)
  - `module` (String, z.B. "BF")
  - `part` (Number, 1 oder 2)

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Alle Felder vorhanden

---

### TC-API-005: GET /api/criteria - Fehlerbehandlung bei fehlender criteria.json

**Testart**: Integration Test, API Test  
**Priorität**: Mittel (P1)  
**Zuordnung**: AP-03

**Vorbedingungen**:
- Backend-Server läuft
- `criteria.json` wurde temporär entfernt oder umbenannt

**Eingaben**:
- HTTP GET Request: `http://localhost:8080/api/criteria`

**Erwartetes Ergebnis**:
- HTTP Status Code: `500 Internal Server Error`
- Fehler wird korrekt behandelt

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Fehler wird geloggt

---

### TC-API-006: POST /api/person - Status 201 Created mit gültigen Daten

**Testart**: Integration Test, API Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-04

**Vorbedingungen**:
- Backend-Server läuft
- Datenbank ist verfügbar und leer (oder Test-Datenbank)
- PostgreSQL läuft (via Docker Compose)

**Eingaben**:
- HTTP POST Request: `http://localhost:8080/api/person`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "name": "Muster",
  "vorname": "Max",
  "thema": "IPA-Kriterien-App",
  "abgabedatum": "2024-12-31"
}
```

**Erwartetes Ergebnis**:
- HTTP Status Code: `201 Created` (oder `200 OK` wenn Spring Boot so konfiguriert)
- Response Body: JSON-Objekt mit gespeicherter Person
- Person enthält generierte `id` (Number)

**Nachbedingungen**:
- Person ist in Datenbank gespeichert
- Person kann über GET `/api/person/{id}` abgerufen werden

---

### TC-API-007: POST /api/person - Response enthält gespeicherte Person mit ID

**Testart**: Integration Test, API Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-04

**Vorbedingungen**:
- Backend-Server läuft
- Datenbank ist verfügbar

**Eingaben**:
- HTTP POST Request: `http://localhost:8080/api/person`
- Body: Gültige Personendaten (siehe TC-API-006)

**Erwartetes Ergebnis**:
- Response Body enthält:
  - `id` (Number, > 0)
  - `name` (String, wie eingegeben)
  - `vorname` (String, wie eingegeben)
  - `thema` (String, wie eingegeben)
  - `abgabedatum` (String, wie eingegeben)

**Nachbedingungen**:
- Person ist in Datenbank gespeichert
- ID ist eindeutig

---

### TC-API-008: POST /api/person - Person wird in Datenbank gespeichert

**Testart**: Integration Test, API Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-04

**Vorbedingungen**:
- Backend-Server läuft
- Datenbank ist verfügbar
- Datenbank ist leer (oder Test-Datenbank)

**Eingaben**:
- HTTP POST Request: `http://localhost:8080/api/person`
- Body: Gültige Personendaten

**Erwartetes Ergebnis**:
- Person ist in Datenbank-Tabelle `person` gespeichert
- Anzahl Einträge in Tabelle erhöht sich um 1

**Nachbedingungen**:
- Person kann über Repository abgerufen werden
- Person kann über API abgerufen werden

---

### TC-API-009: POST /api/person - Validierung: Pflichtfelder sind erforderlich

**Testart**: Integration Test, API Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-04

**Vorbedingungen**:
- Backend-Server läuft
- Datenbank ist verfügbar

**Eingaben**:
- HTTP POST Request: `http://localhost:8080/api/person`
- Body: Unvollständige Personendaten (z.B. ohne `name`):
```json
{
  "vorname": "Max",
  "thema": "IPA-Kriterien-App",
  "abgabedatum": "2024-12-31"
}
```

**Erwartetes Ergebnis**:
- HTTP Status Code: `400 Bad Request` (oder `422 Unprocessable Entity`)
- Fehlermeldung bezüglich fehlender Pflichtfelder

**Nachbedingungen**:
- Keine Person in Datenbank gespeichert
- Fehler wird korrekt behandelt

**Zusätzliche Testfälle**:
- Ohne `vorname`
- Ohne `thema`
- Ohne `abgabedatum`
- Leerer Body

---

### TC-API-010: POST /api/person - Fehlerbehandlung bei ungültigen Daten

**Testart**: Integration Test, API Test  
**Priorität**: Mittel (P1)  
**Zuordnung**: AP-04

**Vorbedingungen**:
- Backend-Server läuft
- Datenbank ist verfügbar

**Eingaben**:
- HTTP POST Request: `http://localhost:8080/api/person`
- Body: Ungültige Daten (z.B. leere Strings, zu lange Strings, ungültiges Datum)

**Erwartetes Ergebnis**:
- HTTP Status Code: `400 Bad Request`
- Fehlermeldung bezüglich ungültiger Daten

**Nachbedingungen**:
- Keine Person in Datenbank gespeichert
- Fehler wird korrekt behandelt

---

### TC-API-011: PUT /api/person/{id}/criteria/{criterionId} - Speichert erfüllte Anforderungen

**Testart**: Integration Test, API Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-05

**Vorbedingungen**:
- Backend-Server läuft
- Datenbank ist verfügbar
- Person mit ID existiert in Datenbank
- Kriterium mit ID "A04" existiert

**Eingaben**:
- HTTP PUT Request: `http://localhost:8080/api/person/1/criteria/A04`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "fulfilledRequirements": ["A04-1", "A04-2", "A04-3"],
  "notes": "Zeitplan ist erstellt"
}
```

**Erwartetes Ergebnis**:
- HTTP Status Code: `200 OK` (oder `204 No Content`)
- Fortschritt ist in Datenbank gespeichert
- `fulfilledRequirements` enthält genau die angegebenen IDs

**Nachbedingungen**:
- Fortschritt kann über GET `/api/person/{id}/summary` abgerufen werden
- Fortschritt ist persistent gespeichert

---

### TC-API-012: PUT /api/person/{id}/criteria/{criterionId} - Speichert Notizen

**Testart**: Integration Test, API Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-05

**Vorbedingungen**:
- Backend-Server läuft
- Datenbank ist verfügbar
- Person mit ID existiert
- Kriterium mit ID existiert

**Eingaben**:
- HTTP PUT Request: `http://localhost:8080/api/person/1/criteria/A04`
- Body:
```json
{
  "fulfilledRequirements": ["A04-1"],
  "notes": "Zeitplan muss noch aktualisiert werden"
}
```

**Erwartetes Ergebnis**:
- HTTP Status Code: `200 OK`
- Notizen sind in Datenbank gespeichert
- Notizen können später abgerufen werden

**Nachbedingungen**:
- Notizen sind persistent gespeichert
- Notizen können über API abgerufen werden

---

### TC-API-013: PUT /api/person/{id}/criteria/{criterionId} - Aktualisiert bestehenden Fortschritt

**Testart**: Integration Test, API Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-05

**Vorbedingungen**:
- Backend-Server läuft
- Datenbank ist verfügbar
- Person mit ID existiert
- Kriterium mit ID existiert
- Fortschritt für dieses Kriterium existiert bereits

**Eingaben**:
- Erster PUT: `fulfilledRequirements: ["A04-1"]`
- Zweiter PUT: `fulfilledRequirements: ["A04-1", "A04-2", "A04-3"]`

**Erwartetes Ergebnis**:
- Zweiter PUT aktualisiert bestehenden Fortschritt (kein Duplikat)
- `fulfilledRequirements` enthält jetzt 3 IDs
- Alte Daten werden überschrieben

**Nachbedingungen**:
- Nur ein Fortschritt-Eintrag in Datenbank
- Neueste Daten sind gespeichert

---

### TC-API-014: PUT /api/person/{id}/criteria/{criterionId} - Fehler bei nicht existierender Person

**Testart**: Integration Test, API Test  
**Priorität**: Mittel (P1)  
**Zuordnung**: AP-05

**Vorbedingungen**:
- Backend-Server läuft
- Datenbank ist verfügbar
- Person mit ID 999 existiert nicht

**Eingaben**:
- HTTP PUT Request: `http://localhost:8080/api/person/999/criteria/A04`
- Body: Gültige Fortschrittsdaten

**Erwartetes Ergebnis**:
- HTTP Status Code: `404 Not Found`
- Fehlermeldung bezüglich nicht existierender Person

**Nachbedingungen**:
- Keine Änderungen in Datenbank
- Fehler wird korrekt behandelt

---

### TC-API-015: PUT /api/person/{id}/criteria/{criterionId} - Fehler bei nicht existierendem Kriterium

**Testart**: Integration Test, API Test  
**Priorität**: Mittel (P1)  
**Zuordnung**: AP-05

**Vorbedingungen**:
- Backend-Server läuft
- Datenbank ist verfügbar
- Person mit ID existiert
- Kriterium mit ID "INVALID" existiert nicht

**Eingaben**:
- HTTP PUT Request: `http://localhost:8080/api/person/1/criteria/INVALID`
- Body: Gültige Fortschrittsdaten

**Erwartetes Ergebnis**:
- HTTP Status Code: `404 Not Found` (oder `400 Bad Request`)
- Fehlermeldung bezüglich nicht existierendem Kriterium

**Nachbedingungen**:
- Keine Änderungen in Datenbank
- Fehler wird korrekt behandelt

---

### TC-API-016: GET /api/person/{id}/summary - Status 200 OK

**Testart**: Integration Test, API Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-06

**Vorbedingungen**:
- Backend-Server läuft
- Datenbank ist verfügbar
- Person mit ID existiert
- Kriterien sind geladen (aus criteria.json)

**Eingaben**:
- HTTP GET Request: `http://localhost:8080/api/person/1/summary`
- Headers: `Content-Type: application/json`

**Erwartetes Ergebnis**:
- HTTP Status Code: `200 OK`
- Response Body: JSON-Objekt mit `criteriaSummaries`, `estimatedGradePart1`, `estimatedGradePart2`

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Response ist gültiges JSON

---

### TC-API-017: GET /api/person/{id}/summary - Response enthält Gütestufen für alle Kriterien

**Testart**: Integration Test, API Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-06

**Vorbedingungen**:
- Backend-Server läuft
- Datenbank ist verfügbar
- Person mit ID existiert
- Fortschritt für mindestens ein Kriterium vorhanden

**Eingaben**:
- HTTP GET Request: `http://localhost:8080/api/person/1/summary`

**Erwartetes Ergebnis**:
- Response enthält `criteriaSummaries` Array mit 3 Elementen
- Jedes Element enthält:
  - `criterionId` (String)
  - `criterionTitle` (String)
  - `fulfilledCount` (Number)
  - `totalCount` (Number)
  - `qualityLevel` (Number, 0-3)

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Alle Kriterien sind enthalten

---

### TC-API-018: GET /api/person/{id}/summary - Response enthält mutmassliche Note für Teil 1

**Testart**: Integration Test, API Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-06

**Vorbedingungen**:
- Backend-Server läuft
- Datenbank ist verfügbar
- Person mit ID existiert
- Mindestens ein Kriterium gehört zu Teil 1

**Eingaben**:
- HTTP GET Request: `http://localhost:8080/api/person/1/summary`

**Erwartetes Ergebnis**:
- Response enthält `estimatedGradePart1` (Number oder null)
- Wenn Kriterien Teil 1 vorhanden: `estimatedGradePart1` ist zwischen 4.0 und 5.5
- Wenn keine Kriterien Teil 1: `estimatedGradePart1` ist `null`

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Note ist korrekt berechnet

---

### TC-API-019: GET /api/person/{id}/summary - Response enthält mutmassliche Note für Teil 2

**Testart**: Integration Test, API Test  
**Priorität**: Hoch (P0)  
**Zuordnung**: AP-06

**Vorbedingungen**:
- Backend-Server läuft
- Datenbank ist verfügbar
- Person mit ID existiert
- Mindestens ein Kriterium gehört zu Teil 2

**Eingaben**:
- HTTP GET Request: `http://localhost:8080/api/person/1/summary`

**Erwartetes Ergebnis**:
- Response enthält `estimatedGradePart2` (Number oder null)
- Wenn Kriterien Teil 2 vorhanden: `estimatedGradePart2` ist zwischen 4.0 und 5.5
- Wenn keine Kriterien Teil 2: `estimatedGradePart2` ist `null`

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Note ist korrekt berechnet

---

### TC-API-020: GET /api/person/{id}/summary - Fehler bei nicht existierender Person

**Testart**: Integration Test, API Test  
**Priorität**: Mittel (P1)  
**Zuordnung**: AP-06

**Vorbedingungen**:
- Backend-Server läuft
- Datenbank ist verfügbar
- Person mit ID 999 existiert nicht

**Eingaben**:
- HTTP GET Request: `http://localhost:8080/api/person/999/summary`

**Erwartetes Ergebnis**:
- HTTP Status Code: `404 Not Found`
- Fehlermeldung bezüglich nicht existierender Person

**Nachbedingungen**:
- Keine Änderungen am Systemzustand
- Fehler wird korrekt behandelt

---

## Component Tests

### TC-COMP-001: PersonForm - Validierungsfehler bei leeren Pflichtfeldern

**Testart**: Component Test  
**Priorität**: Mittel (P1)  
**Zuordnung**: AP-07

**Vorbedingungen**:
- React-Komponente `PersonForm` ist geladen
- Test-Umgebung (Vitest, React Testing Library) ist eingerichtet

**Eingaben**:
- Benutzer klickt auf "Speichern" ohne Felder auszufüllen

**Erwartetes Ergebnis**:
- Validierungsfehler werden angezeigt
- Fehlermeldungen für leere Pflichtfelder (Name, Vorname, Thema, Abgabedatum)
- Formular wird nicht abgesendet

**Nachbedingungen**:
- Keine API-Aufrufe
- Formular bleibt im gleichen Zustand

---

### TC-COMP-002: PersonForm - Speichert Person nach erfolgreicher Eingabe

**Testart**: Component Test  
**Priorität**: Mittel (P1)  
**Zuordnung**: AP-07

**Vorbedingungen**:
- React-Komponente `PersonForm` ist geladen
- API-Service ist gemockt
- Mock liefert erfolgreiche Response

**Eingaben**:
- Benutzer füllt alle Felder aus:
  - Name: "Muster"
  - Vorname: "Max"
  - Thema: "IPA-Kriterien-App"
  - Abgabedatum: "2024-12-31"
- Benutzer klickt auf "Speichern"

**Erwartetes Ergebnis**:
- API-Aufruf wird mit korrekten Daten ausgeführt
- Erfolgsmeldung wird angezeigt
- Formular wird zurückgesetzt oder weitergeleitet

**Nachbedingungen**:
- Mock wurde aufgerufen
- Person wurde gespeichert (im Mock)

---

### TC-COMP-003: CriteriaView - Zeigt Checkboxen für alle Anforderungen

**Testart**: Component Test  
**Priorität**: Mittel (P1)  
**Zuordnung**: AP-08

**Vorbedingungen**:
- React-Komponente `CriteriaView` ist geladen
- Kriterien-Daten sind geladen (gemockt)
- Test-Kriterium mit 6 Anforderungen

**Eingaben**:
- Komponente rendert mit Kriterien-Daten

**Erwartetes Ergebnis**:
- 6 Checkboxen werden angezeigt (eine pro Anforderung)
- Jede Checkbox hat korrekte Beschriftung (Anforderungs-ID und -Beschreibung)
- Checkboxen sind initial nicht angehakt (wenn kein Fortschritt vorhanden)

**Nachbedingungen**:
- Komponente ist korrekt gerendert
- Alle Checkboxen sind sichtbar

---

### TC-COMP-004: CriteriaView - Speichert Fortschritt bei Checkbox-Änderung

**Testart**: Component Test  
**Priorität**: Mittel (P1)  
**Zuordnung**: AP-08

**Vorbedingungen**:
- React-Komponente `CriteriaView` ist geladen
- API-Service ist gemockt
- Person-ID ist verfügbar
- Kriterium-ID ist verfügbar

**Eingaben**:
- Benutzer hakt Checkbox für Anforderung "A04-1" an

**Erwartetes Ergebnis**:
- API-Aufruf wird mit `fulfilledRequirements: ["A04-1"]` ausgeführt
- Checkbox bleibt angehakt
- Erfolgsmeldung wird angezeigt (optional)

**Nachbedingungen**:
- Mock wurde aufgerufen
- Fortschritt wurde gespeichert (im Mock)

---

### TC-COMP-005: CriteriaView - Speichert Notizen

**Testart**: Component Test  
**Priorität**: Mittel (P1)  
**Zuordnung**: AP-08

**Vorbedingungen**:
- React-Komponente `CriteriaView` ist geladen
- API-Service ist gemockt
- Notizfeld ist vorhanden

**Eingaben**:
- Benutzer gibt Text in Notizfeld ein: "Zeitplan muss noch aktualisiert werden"
- Benutzer klickt auf "Speichern" (oder Auto-Save)

**Erwartetes Ergebnis**:
- API-Aufruf wird mit `notes: "Zeitplan muss noch aktualisiert werden"` ausgeführt
- Notizen werden gespeichert

**Nachbedingungen**:
- Mock wurde aufgerufen
- Notizen wurden gespeichert (im Mock)

---

### TC-COMP-006: Dashboard - Zeigt Gütestufen pro Kriterium

**Testart**: Component Test  
**Priorität**: Mittel (P1)  
**Zuordnung**: AP-09

**Vorbedingungen**:
- React-Komponente `Dashboard` ist geladen
- Summary-Daten sind geladen (gemockt)
- Summary enthält 3 Kriterien mit verschiedenen Gütestufen

**Eingaben**:
- Komponente rendert mit Summary-Daten

**Erwartetes Ergebnis**:
- 3 Kriterien werden angezeigt
- Jedes Kriterium zeigt:
  - Kriterium-Titel
  - Gütestufe (0-3)
  - Erfüllte/ Gesamt-Anforderungen (z.B. "3/6")

**Nachbedingungen**:
- Komponente ist korrekt gerendert
- Alle Gütestufen sind sichtbar

---

### TC-COMP-007: Dashboard - Zeigt mutmassliche Noten für Teil 1 und 2

**Testart**: Component Test  
**Priorität**: Mittel (P1)  
**Zuordnung**: AP-09

**Vorbedingungen**:
- React-Komponente `Dashboard` ist geladen
- Summary-Daten sind geladen (gemockt)
- Summary enthält `estimatedGradePart1` und `estimatedGradePart2`

**Eingaben**:
- Komponente rendert mit Summary-Daten

**Erwartetes Ergebnis**:
- Mutmassliche Note für Teil 1 wird angezeigt (z.B. "5.2")
- Mutmassliche Note für Teil 2 wird angezeigt (z.B. "4.8")
- Noten sind formatiert (z.B. auf 1 Dezimalstelle gerundet)

**Nachbedingungen**:
- Komponente ist korrekt gerendert
- Noten sind sichtbar

---

## Traceability Matrix

| Anforderung | Testfälle | Priorität |
|-------------|-----------|-----------|
| AP-03: Kriterien-API | TC-API-001 bis TC-API-005 | Hoch |
| AP-04: Personendaten erfassen | TC-API-006 bis TC-API-010, TC-COMP-001, TC-COMP-002 | Hoch |
| AP-05: Kriterienfortschritt speichern | TC-API-011 bis TC-API-015, TC-COMP-003 bis TC-COMP-005 | Hoch |
| AP-06: Berechnungslogik & Summary | TC-UNIT-001 bis TC-UNIT-007, TC-API-016 bis TC-API-020, TC-COMP-006, TC-COMP-007 | Hoch |
| AP-07: Frontend Personenformular | TC-COMP-001, TC-COMP-002 | Mittel |
| AP-08: Frontend Kriterienansicht | TC-COMP-003 bis TC-COMP-005 | Mittel |
| AP-09: Frontend Dashboard | TC-COMP-006, TC-COMP-007 | Mittel |

## Zusammenfassung

Diese Testfalldokumentation enthält:
- **7 Unit Tests** (TC-UNIT-001 bis TC-UNIT-007)
- **20 API Tests** (TC-API-001 bis TC-API-020)
- **7 Component Tests** (TC-COMP-001 bis TC-COMP-007)
- **Total: 34 Testfälle**

Jeder Testfall ist vollständig dokumentiert mit Vorbedingungen, Eingaben, erwarteten Ergebnissen und Nachbedingungen. Die Testfälle decken alle kritischen Funktionalitäten ab und erfüllen die Anforderung von mindestens 80% Abdeckung.
