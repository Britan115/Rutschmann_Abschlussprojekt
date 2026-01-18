# Testkonzept

## 1. Übersicht

Dieses Dokument beschreibt das Testkonzept für die IPA-Kriterien-Erfassungsapplikation gemäss Modul 450 (Testing). Das Testkonzept definiert die Testarten, das Testumfeld und die Zuordnung von Anforderungen zu Testfällen.

## 2. Testarten

### 2.1 Unit Tests

**Ziel**: Prüfung einzelner Komponenten in Isolation

**Backend (Java/Spring Boot)**:
- **Services**: `CriteriaService`, `PersonService`, `CriterionProgressService`, `SummaryService`
- **Business-Logik**: Gütestufen-Berechnung, Notenberechnung, Teil-Zuordnung
- **Framework**: JUnit 5, Mockito für Mocks
- **Abdeckung**: Mindestens 80% der Business-Logik

**Frontend (React/TypeScript)**:
- **Services**: API-Service-Funktionen (`personService`, `criteriaService`)
- **Utilities**: Helper-Funktionen, Validierungen
- **Framework**: Vitest
- **Abdeckung**: Alle Service-Funktionen

### 2.2 Integration Tests

**Ziel**: Prüfung der Zusammenarbeit mehrerer Komponenten

**Backend**:
- **REST API Endpoints**: Vollständige HTTP-Requests mit MockMvc
- **Datenbank-Integration**: Repository-Tests mit Test-Datenbank (H2 in-memory)
- **End-to-End API**: GET `/api/criteria`, POST `/api/person`, PUT `/api/person/{id}/criteria/{criterionId}`, GET `/api/person/{id}/summary`
- **Framework**: Spring Boot Test, MockMvc, Testcontainers (optional)
- **Abdeckung**: Alle API-Endpoints mit verschiedenen Szenarien

### 2.3 Component Tests

**Ziel**: Prüfung von React-Komponenten in Isolation

**Frontend**:
- **Komponenten**: `PersonForm`, `CriteriaView`, `Dashboard`
- **Interaktionen**: Benutzer-Eingaben, API-Aufrufe, State-Management
- **Framework**: Vitest, React Testing Library, @testing-library/user-event
- **Abdeckung**: Alle UI-Komponenten mit kritischen Interaktionen

### 2.4 API Tests

**Ziel**: Prüfung der REST API Schnittstellen

**Backend**:
- **HTTP-Methoden**: GET, POST, PUT
- **Status-Codes**: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal Server Error
- **Request/Response**: JSON-Format, Validierung
- **Framework**: MockMvc, Spring Boot Test
- **Abdeckung**: Alle Endpoints mit Erfolgs- und Fehlerfällen

## 3. Testumfeld

### 3.1 Entwicklungsumgebung

**Backend**:
- **Java**: JDK 17
- **Build-Tool**: Maven 3.8+
- **Test-Framework**: JUnit 5, Spring Boot Test
- **Mocking**: Mockito
- **Datenbank**: H2 (in-memory für Tests), PostgreSQL (für Integrationstests mit Testcontainers)
- **IDE**: IntelliJ IDEA / Eclipse

**Frontend**:
- **Node.js**: Version 20+
- **Package Manager**: npm
- **Test-Framework**: Vitest
- **Testing Library**: React Testing Library, @testing-library/jest-dom
- **Test-Umgebung**: jsdom (Browser-Simulation)
- **IDE**: VS Code / WebStorm

### 3.2 CI/CD-Umgebung

**GitHub Actions**:
- **Runner**: ubuntu-latest
- **Java Setup**: actions/setup-java@v4 (Java 17)
- **Node Setup**: actions/setup-node@v4 (Node.js 20)
- **Test-Ausführung**: Automatisch bei jedem Push und Pull Request
- **Test-Reports**: JUnit XML-Reports für Backend, Coverage-Reports für Frontend
- **Reporting**: EnricoMi/publish-unit-test-result-action@v2

### 3.3 Test-Daten

**Backend**:
- **Test-Personen**: Vordefinierte Test-Daten für Personendaten
- **Test-Kriterien**: Kriterien aus `criteria.json` (A04, H06, Doc03)
- **Test-Fortschritt**: Verschiedene Kombinationen von erfüllten Anforderungen
- **Datenbank**: H2 in-memory für Unit-Tests, Testcontainers für Integrationstests

**Frontend**:
- **Mock-Daten**: Mock-API-Responses für Komponententests
- **Test-Szenarien**: Verschiedene Zustände (leer, teilweise ausgefüllt, vollständig)

## 4. Zuordnung Anforderungen zu Testfällen

### 4.1 Anforderungsstruktur

Die Anforderungen werden aus den Arbeitspaketen (AP-03 bis AP-09) abgeleitet:

| Arbeitspaket | Anforderung | Testart | Priorität |
|-------------|------------|---------|-----------|
| AP-03 | Kriterien-API | Integration, API | Hoch |
| AP-04 | Personendaten erfassen | Integration, API, Component | Hoch |
| AP-05 | Kriterienfortschritt speichern | Integration, API, Component | Hoch |
| AP-06 | Berechnungslogik & Summary | Unit, Integration, API | Hoch |
| AP-07 | Frontend Personenformular | Component | Mittel |
| AP-08 | Frontend Kriterienansicht | Component | Mittel |
| AP-09 | Frontend Dashboard | Component | Mittel |

### 4.2 Detaillierte Zuordnung

#### AP-03: Kriterien-API

**Anforderung**: REST Endpoint GET `/api/criteria` liefert alle Kriterien aus JSON

**Testfälle**:
- **TC-API-001**: GET `/api/criteria` liefert Status 200 OK
- **TC-API-002**: Response enthält alle 3 Kriterien (A04, H06, Doc03)
- **TC-API-003**: Jedes Kriterium enthält id, title, question, requirements, qualityLevels
- **TC-API-004**: Jede Requirement enthält id, description, module, part
- **TC-API-005**: Fehlerbehandlung bei fehlender criteria.json (Status 500)

**Zuordnung**: Integration Test, API Test

#### AP-04: Personendaten erfassen

**Anforderung**: REST Endpoint POST `/api/person` speichert Personendaten in Datenbank

**Testfälle**:
- **TC-API-006**: POST `/api/person` mit gültigen Daten liefert Status 201 Created
- **TC-API-007**: Response enthält gespeicherte Person mit generierter ID
- **TC-API-008**: Person wird in Datenbank gespeichert
- **TC-API-009**: Validierung: Name, Vorname, Thema, Abgabedatum sind erforderlich
- **TC-API-010**: Fehlerbehandlung bei ungültigen Daten (Status 400)
- **TC-COMP-001**: PersonForm zeigt Validierungsfehler bei leeren Feldern
- **TC-COMP-002**: PersonForm speichert Person nach erfolgreicher Eingabe

**Zuordnung**: Integration Test, API Test, Component Test

#### AP-05: Kriterienfortschritt speichern

**Anforderung**: REST Endpoint PUT `/api/person/{id}/criteria/{criterionId}` speichert Fortschritt

**Testfälle**:
- **TC-API-011**: PUT `/api/person/{id}/criteria/{criterionId}` speichert erfüllte Anforderungen
- **TC-API-012**: PUT speichert Notizen
- **TC-API-013**: PUT aktualisiert bestehenden Fortschritt
- **TC-API-014**: Fehlerbehandlung bei nicht existierender Person (Status 404)
- **TC-API-015**: Fehlerbehandlung bei nicht existierendem Kriterium (Status 404)
- **TC-COMP-003**: CriteriaView zeigt Checkboxen für alle Anforderungen
- **TC-COMP-004**: CriteriaView speichert Fortschritt bei Checkbox-Änderung
- **TC-COMP-005**: CriteriaView speichert Notizen

**Zuordnung**: Integration Test, API Test, Component Test

#### AP-06: Berechnungslogik & Summary API

**Anforderung**: REST Endpoint GET `/api/person/{id}/summary` berechnet Gütestufen und Noten

**Testfälle**:
- **TC-UNIT-001**: `calculateQualityLevel()` berechnet Gütestufe 3 bei allen Anforderungen erfüllt
- **TC-UNIT-002**: `calculateQualityLevel()` berechnet Gütestufe 2 bei 4-5 Anforderungen erfüllt
- **TC-UNIT-003**: `calculateQualityLevel()` berechnet Gütestufe 1 bei 2-3 Anforderungen erfüllt
- **TC-UNIT-004**: `calculateQualityLevel()` berechnet Gütestufe 0 bei weniger als 2 Anforderungen erfüllt
- **TC-UNIT-005**: `determinePart()` ordnet Kriterium korrekt Teil 1 oder 2 zu
- **TC-UNIT-006**: Notenberechnung: Gütestufe 3 → Note 5.5
- **TC-UNIT-007**: Notenberechnung: Gütestufe 0 → Note 4.0
- **TC-API-016**: GET `/api/person/{id}/summary` liefert Status 200 OK
- **TC-API-017**: Response enthält Gütestufen für alle Kriterien
- **TC-API-018**: Response enthält mutmassliche Note für Teil 1
- **TC-API-019**: Response enthält mutmassliche Note für Teil 2
- **TC-API-020**: Fehlerbehandlung bei nicht existierender Person (Status 404)
- **TC-COMP-006**: Dashboard zeigt Gütestufen pro Kriterium
- **TC-COMP-007**: Dashboard zeigt mutmassliche Noten für Teil 1 und 2

**Zuordnung**: Unit Test, Integration Test, API Test, Component Test

#### AP-07: Frontend Personenformular

**Anforderung**: Eingabemaske für Personendaten mit Validierung

**Testfälle**:
- **TC-COMP-008**: PersonForm rendert alle Eingabefelder (Name, Vorname, Thema, Abgabedatum)
- **TC-COMP-009**: PersonForm zeigt Validierungsfehler bei leeren Pflichtfeldern
- **TC-COMP-010**: PersonForm speichert Person nach erfolgreicher Eingabe
- **TC-COMP-011**: PersonForm zeigt Fehlermeldung bei API-Fehler

**Zuordnung**: Component Test

#### AP-08: Frontend Kriterienansicht

**Anforderung**: Anzeige der Kriterien mit Checkboxen und Notizfeld

**Testfälle**:
- **TC-COMP-012**: CriteriaView lädt und zeigt alle Kriterien
- **TC-COMP-013**: CriteriaView zeigt Checkboxen für jede Anforderung
- **TC-COMP-014**: CriteriaView zeigt Notizfeld pro Kriterium
- **TC-COMP-015**: CriteriaView speichert Fortschritt bei Checkbox-Änderung
- **TC-COMP-016**: CriteriaView speichert Notizen
- **TC-COMP-017**: CriteriaView zeigt Fehlermeldung bei API-Fehler

**Zuordnung**: Component Test

#### AP-09: Frontend Dashboard

**Anforderung**: Anzeige der Gütestufen und mutmasslichen Noten

**Testfälle**:
- **TC-COMP-018**: Dashboard lädt Summary für Person
- **TC-COMP-019**: Dashboard zeigt Gütestufe pro Kriterium (0-3)
- **TC-COMP-020**: Dashboard zeigt mutmassliche Note für Teil 1
- **TC-COMP-021**: Dashboard zeigt mutmassliche Note für Teil 2
- **TC-COMP-022**: Dashboard zeigt "N/A" wenn keine Daten vorhanden
- **TC-COMP-023**: Dashboard zeigt Fehlermeldung bei API-Fehler

**Zuordnung**: Component Test

## 5. Testabdeckung

### 5.1 Ziel-Abdeckung

- **Backend**: Mindestens 80% Code-Abdeckung (gemäss Anforderung)
- **Frontend**: Mindestens 80% der definierten Testfälle müssen bestehen
- **Kritische Pfade**: 100% Abdeckung (Gütestufen-Berechnung, Notenberechnung)

### 5.2 Priorisierung

**Hoch (P0)**:
- Gütestufen-Berechnung (TC-UNIT-001 bis TC-UNIT-004)
- Notenberechnung (TC-UNIT-006, TC-UNIT-007)
- API-Endpoints (TC-API-001 bis TC-API-020)

**Mittel (P1)**:
- Frontend-Komponenten (TC-COMP-001 bis TC-COMP-023)
- Validierungen

**Niedrig (P2)**:
- Edge Cases
- Fehlerbehandlung (zusätzliche Szenarien)

## 6. Testausführung

### 6.1 Lokale Ausführung

**Backend**:
```bash
cd backend
mvn test
```

**Frontend**:
```bash
cd frontend
npm run test
```

### 6.2 CI/CD-Ausführung

- Automatisch bei jedem Push auf `main` oder `feature/**`
- Automatisch bei jedem Pull Request auf `main`
- Pipeline stoppt bei Testfehlern
- Test-Reports werden in GitHub Actions angezeigt

## 7. Testdokumentation

### 7.1 Testfälle

Detaillierte Testfälle werden in `docs/testfaelle.md` dokumentiert mit:
- Vorbedingungen
- Eingaben
- Erwarteten Ergebnissen
- Nachbedingungen

### 7.2 Testprotokoll

Testergebnisse werden in `docs/testprotokoll.md` dokumentiert mit:
- Ausführungsdatum
- Testergebnisse (bestanden/fehlgeschlagen)
- Fehlerbeschreibungen
- Abdeckungsstatistiken

## 8. Traceability Matrix

Die vollständige Traceability-Matrix (Anforderung → Testfall) wird in `docs/testfaelle.md` dokumentiert.

## 9. Zusammenfassung

Dieses Testkonzept definiert:
- **4 Testarten**: Unit, Integration, Component, API Tests
- **Testumfeld**: Entwicklungsumgebung, CI/CD, Test-Daten
- **Zuordnung**: 9 Arbeitspakete → 23+ Testfälle
- **Abdeckung**: Mindestens 80% der definierten Testfälle
- **Ausführung**: Lokal und automatisch in CI/CD

Das Testkonzept wird iterativ erweitert, wenn neue Anforderungen hinzukommen.
