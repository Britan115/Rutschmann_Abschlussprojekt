# Bewertungskriterien - Nachweis der Erfüllung

Kurze Übersicht, wo jedes Kriterium im Projekt erfüllt wird.

---

## Modul 324 - DevOps

### 1. Automatisierung (30%)

**Was:** CI/CD-Pipeline automatisiert Build- und Test-Prozesse mit strukturierten Jobs und Abhängigkeiten.

**Wo zu finden:**
- `.github/workflows/ci-build-lint.yml` - Haupt-Pipeline-Datei
- `docs/deployment.md` - Pipeline-Erklärung

**Was zu sehen ist:**
- Automatischer Build bei jedem Commit (Zeilen 1-10: Trigger)
- Backend Build & Test Job (Zeilen 51-120)
- Frontend Build, Test & Lint Job (Zeilen 121-204)
- Staging Deployment Job mit Abhängigkeiten (Zeilen 205-363)
- Alle Jobs haben klare Abhängigkeiten (`needs: [...]`)

---

### 2. Testintegration (20%)

**Was:** Automatisierte Tests sind in die Pipeline integriert und Ergebnisse sind deutlich sichtbar.

**Wo zu finden:**
- `.github/workflows/ci-build-lint.yml` - Test-Ausführung in Pipeline
- `backend/src/test/` - Backend-Tests
- `frontend/src/components/*.test.tsx` - Frontend-Tests

**Was zu sehen ist:**
- Backend-Tests werden automatisch ausgeführt (Zeilen 80-95: `mvn test`)
- Frontend-Tests werden automatisch ausgeführt (Zeilen 180-195: `npm run test`)
- Test-Ergebnisse in GitHub Actions sichtbar (JUnit Reports, Vitest Coverage)
- 37 Tests insgesamt (21 Backend + 16 Frontend), alle bestehen

---

### 3. Code-Qualität (10%)

**Was:** Linter meldet Probleme, fehlerhafter Code wird nicht in den Hauptbranch gemerged.

**Wo zu finden:**
- `.github/workflows/ci-build-lint.yml` - Linter-Integration
- `frontend/.eslintrc.cjs` - ESLint-Konfiguration

**Was zu sehen ist:**
- ESLint wird automatisch ausgeführt (Zeilen 150-160)
- TypeScript-Compiler prüft Code (Zeilen 161-165)
- Pipeline schlägt fehl bei Linter-Fehlern
- Aktuell: 0 Linter-Fehler

---

### 4. Versionskontrolle (10%)

**Was:** Systematische Git-Nutzung mit sinnvollen Commits und Branches. Branches müssen vor dem Merge getestet sein.

**Wo zu finden:**
- `.github/workflows/ci-build-lint.yml` - Pipeline läuft auf Feature-Branches
- `CONTRIBUTING.md` - Git-Workflow-Dokumentation
- Git-History: Alle Commits und Branches

**Was zu sehen ist:**
- Pipeline läuft automatisch auf `feature/**` Branches (Zeilen 1-10)
- Sinnvolle Commit-Messages: `AP-XX: Beschreibung`
- Sinnvolle Branch-Namen: `feature/AP-XX-beschreibung`
- 18 Feature-Branches erstellt und gemerged
- Jeder Branch wird getestet, bevor Merge möglich ist

---

### 5. Vorgehen (30%)

**Was:** Geplantes Vorgehen nachvollziehbar, regelmässiger Fortschritt, klare Kommunikation, Abdeckung der Anforderungen.

**Wo zu finden:**
- `README.md` - Arbeitspakete-Übersicht (Zeilen 57-76)
- `CONTRIBUTING.md` - Workflow-Dokumentation
- `DEFINITION_OF_DONE.md` - DoD-Checkliste
- Git-History: Kontinuierliche Entwicklung

**Was zu sehen ist:**
- 18 Arbeitspakete klar definiert und dokumentiert
- Alle Arbeitspakete abgeschlossen
- Kontinuierliche Commits über gesamte Projektzeit
- Klare Dokumentation des Vorgehens

---

## Modul 450 - Testing

### 6. Testkonzept (25%)

**Was:** Vollständiges Testkonzept mit klarer Beschreibung von Testarten, Zielen und Fällen.

**Wo zu finden:**
- `docs/testkonzept.md` - Vollständiges Testkonzept (301 Zeilen)

**Was zu sehen ist:**
- Testarten definiert: Unit, Integration, Component, API Tests
- Testumgebung dokumentiert
- Traceability: Anforderung → Testfall (Mapping-Tabelle)
- Testabdeckungsziele: Mindestens 80%

---

### 7. Testabdeckung (25%)

**Was:** Mindestens 80% der umgesetzten User-Story-Anforderungen sind durch Tests abgedeckt. Nachvollziehbarkeit: Anforderung → Test.

**Wo zu finden:**
- `docs/testfaelle.md` - 34 dokumentierte Testfälle
- `docs/testkonzept.md` - Traceability-Matrix
- `backend/src/test/` - 21 Backend-Tests
- `frontend/src/components/*.test.tsx` - 16 Frontend-Tests

**Was zu sehen ist:**
- 37 automatisierte Tests implementiert
- 34 Testfälle dokumentiert mit Traceability
- 100% der definierten Testfälle bestehen (37/37)
- Jeder Testfall ist einer Anforderung zugeordnet

---

### 8. Testumsetzung (20%)

**Was:** Unterschiedliche Testarten, unterschiedliche Teststufen (Testpyramide), automatisierte Tests sinnvoll implementiert.

**Wo zu finden:**
- `backend/src/test/java/ch/bbw/ipa/service/SummaryServiceTest.java` - Unit Tests
- `backend/src/test/java/ch/bbw/ipa/controller/` - Integration Tests
- `frontend/src/components/*.test.tsx` - Component Tests
- `.github/workflows/ci-build-lint.yml` - Automatisierte Ausführung

**Was zu sehen ist:**
- 7 Unit Tests (Backend)
- 14 Integration Tests (Backend)
- 16 Component Tests (Frontend)
- Alle Tests laufen automatisch in CI/CD Pipeline
- Mocks/Stubs verwendet (Mockito, Vitest)

---

### 9. Testergebnis (10%)

**Was:** Testergebnisse und Fehler sind dokumentiert (Protokoll, Analyse des Ergebnisses).

**Wo zu finden:**
- `docs/testprotokoll.md` - Vollständiges Testergebnis-Protokoll (344 Zeilen)

**Was zu sehen ist:**
- Alle 37 Tests mit Status dokumentiert
- 4 identifizierte Fehler dokumentiert und behoben
- Testabdeckung dokumentiert: > 80%
- Qualitätssicherung dokumentiert

---

### 10. Vorgehen (30%)

**Was:** Geplantes Vorgehen nachvollziehbar, regelmässiger Fortschritt, klare Kommunikation, Abdeckung der Anforderungen.

**Wo zu finden:**
- `docs/testkonzept.md` - Test-Vorgehen
- `docs/testfaelle.md` - Testfall-Dokumentation
- `docs/testprotokoll.md` - Testergebnisse
- Git-History: Kontinuierliche Test-Entwicklung

**Was zu sehen ist:**
- Testkonzept erstellt vor Test-Implementierung
- Alle Testfälle dokumentiert mit Vorbedingungen, Eingaben, erwarteten Ergebnissen
- Tests parallel zur Feature-Entwicklung
- Alle Test-Anforderungen erfüllt

---

## Schnellzugriff auf wichtige Dateien

**DevOps:**
- CI/CD Pipeline: `.github/workflows/ci-build-lint.yml`
- Docker Compose Staging: `docker-compose.staging.yml`
- Deployment: `docs/deployment.md`
- Git-Workflow: `CONTRIBUTING.md`

**Testing:**
- Testkonzept: `docs/testkonzept.md`
- Testfälle: `docs/testfaelle.md`
- Testergebnisse: `docs/testprotokoll.md`
- Backend-Tests: `backend/src/test/java/ch/bbw/ipa/`
- Frontend-Tests: `frontend/src/components/*.test.tsx`

**Projekt:**
- README: `README.md`
- Architektur: `docs/architektur.md`
- KI-Nutzung: `docs/ki-nutzung.md`

---

**Dokument erstellt**: 2026-01-18  
**Version**: 1.0
