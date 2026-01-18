# KI-Nutzungsdokumentation

Dieses Dokument beschreibt transparent, wo und wie künstliche Intelligenz (KI) im Rahmen dieses Projekts eingesetzt wurde. Die Dokumentation erfolgt gemäss den Anforderungen für IPA-Projekte.

**Datum der Erstellung**: 2026-01-18  
**Projekt**: IPA-Kriterien-Erfassungsapplikation  
**Team**: Yanik und Andrin

## 1. Übersicht

KI wurde als Entwicklungsassistent eingesetzt, um die Entwicklung zu beschleunigen und Best Practices zu gewährleisten. Alle generierten Code-Teile wurden von den Teammitgliedern überprüft, getestet und angepasst.

**Einsatzbereiche:**
- Code-Generierung (Backend, Frontend)
- Test-Implementierung
- Dokumentationserstellung
- CI/CD Pipeline-Konfiguration
- Fehlerbehebung und Debugging
- Architektur-Entscheidungen

## 2. Backend-Entwicklung

### 2.1 Projektstruktur und Setup

**Dateien:**
- `backend/pom.xml` - Maven-Konfiguration
- `backend/src/main/java/ch/bbw/ipa/IpaKriterienApplication.java` - Spring Boot Main Class
- `backend/src/main/resources/application.properties` - Datenbank-Konfiguration
- `docker-compose.yml` - PostgreSQL-Container-Konfiguration

**KI-Unterstützung:**
- Generierung der initialen Projektstruktur
- Maven-Dependencies-Konfiguration (Spring Boot, JPA, PostgreSQL)
- Docker Compose-Setup für lokale Entwicklung

### 2.2 Datenmodell und Entitäten

**Dateien:**
- `backend/src/main/java/ch/bbw/ipa/model/Person.java` - JPA-Entity für Personendaten
- `backend/src/main/java/ch/bbw/ipa/model/CriterionProgress.java` - JPA-Entity für Kriterienfortschritt

**KI-Unterstützung:**
- Generierung der JPA-Entity-Klassen mit korrekten Annotationen
- Definition der Beziehungen (Many-to-One)
- ElementCollection für Set von erfüllten Anforderungen

### 2.3 Service-Layer

**Dateien:**
- `backend/src/main/java/ch/bbw/ipa/service/CriteriaService.java` - Lädt Kriterien aus JSON
- `backend/src/main/java/ch/bbw/ipa/service/PersonService.java` - CRUD-Operationen für Personen
- `backend/src/main/java/ch/bbw/ipa/service/CriterionProgressService.java` - Speichert Kriterienfortschritt
- `backend/src/main/java/ch/bbw/ipa/service/SummaryService.java` - Berechnungslogik für Gütestufen und Noten

**KI-Unterstützung:**
- Implementierung der JSON-Parsing-Logik (Jackson ObjectMapper)
- Implementierung der Gütestufen-Berechnung (0-3 basierend auf erfüllten Anforderungen)
- Implementierung der Notenberechnung (Formel: 4.0 + (Durchschnitt * 0.5))
- Teil-Zuordnung (Teil 1 vs. Teil 2) basierend auf Requirements

### 2.4 Controller-Layer (REST API)

**Dateien:**
- `backend/src/main/java/ch/bbw/ipa/controller/CriteriaController.java` - GET /api/criteria
- `backend/src/main/java/ch/bbw/ipa/controller/PersonController.java` - POST /api/person, PUT /api/person/{id}/criteria/{criterionId}, GET /api/person/{id}/summary

**KI-Unterstützung:**
- Generierung der REST-Controller mit korrekten HTTP-Methoden
- Request/Response-Handling
- Fehlerbehandlung (404, 500)

### 2.5 Repository-Layer

**Dateien:**
- `backend/src/main/java/ch/bbw/ipa/repository/PersonRepository.java` - Spring Data JPA Repository
- `backend/src/main/java/ch/bbw/ipa/repository/CriterionProgressRepository.java` - Spring Data JPA Repository mit Custom Query

**KI-Unterstützung:**
- Generierung der Repository-Interfaces
- Custom Query für findByPersonAndCriterionId

### 2.6 DTOs (Data Transfer Objects)

**Dateien:**
- `backend/src/main/java/ch/bbw/ipa/dto/CriterionProgressRequest.java` - Request DTO
- `backend/src/main/java/ch/bbw/ipa/dto/SummaryResponse.java` - Response DTO
- `backend/src/main/java/ch/bbw/ipa/dto/CriterionSummary.java` - Response DTO

**KI-Unterstützung:**
- Generierung der DTO-Klassen für API-Kommunikation

### 2.7 Konfiguration

**Dateien:**
- `backend/src/main/java/ch/bbw/ipa/config/CorsConfig.java` - CORS-Konfiguration für Frontend

**KI-Unterstützung:**
- CORS-Konfiguration für lokale Entwicklung (localhost:5173)

## 3. Frontend-Entwicklung

### 3.1 Projektstruktur und Setup

**Dateien:**
- `frontend/package.json` - npm-Dependencies
- `frontend/tsconfig.json` - TypeScript-Konfiguration
- `frontend/vitest.config.ts` - Vitest-Konfiguration
- `frontend/.eslintrc.cjs` - ESLint-Konfiguration

**KI-Unterstützung:**
- Initialisierung des React + Vite-Projekts
- TypeScript-Konfiguration mit JSX-Support
- Vitest-Setup für Testing
- ESLint-Konfiguration

### 3.2 Komponenten

**Dateien:**
- `frontend/src/components/PersonForm.tsx` - Formular für Personendaten
- `frontend/src/components/CriteriaView.tsx` - Anzeige und Bearbeitung der Kriterien
- `frontend/src/components/Dashboard.tsx` - Übersicht mit Gütestufen und Noten
- `frontend/src/App.tsx` - Haupt-Komponente mit Navigation

**KI-Unterstützung:**
- Generierung der React-Komponenten mit TypeScript
- State-Management mit React Hooks (useState, useEffect, useCallback)
- Formular-Validierung
- API-Integration
- UI-Layout und Styling

### 3.3 API-Service

**Dateien:**
- `frontend/src/services/api.ts` - HTTP-Requests zum Backend

**KI-Unterstützung:**
- Generierung der API-Service-Funktionen (fetch-Requests)
- TypeScript-Interfaces für alle Datenmodelle
- Error-Handling

### 3.4 Styling

**Dateien:**
- `frontend/src/App.css` - Basis-Styling
- `frontend/src/style.css` - Globale Styles

**KI-Unterstützung:**
- CSS-Styling für moderne UI
- Responsive Design-Grundlagen

## 4. Testing

### 4.1 Backend-Tests

**Dateien:**
- `backend/src/test/java/ch/bbw/ipa/service/SummaryServiceTest.java` - Unit Tests für Berechnungslogik
- `backend/src/test/java/ch/bbw/ipa/controller/CriteriaControllerTest.java` - Integration Tests für CriteriaController
- `backend/src/test/java/ch/bbw/ipa/controller/PersonControllerTest.java` - Integration Tests für PersonController

**KI-Unterstützung:**
- Generierung der Test-Klassen mit JUnit 5
- Mockito-Setup für Unit Tests
- MockMvc-Setup für Integration Tests
- Testfälle für alle kritischen Szenarien (Gütestufen 0-3, Notenberechnung, Fehlerbehandlung)
- Korrektur von Test-Fehlern (Java 23 Kompatibilität, NullPointerException)

### 4.2 Frontend-Tests

**Dateien:**
- `frontend/src/components/PersonForm.test.tsx` - Component Tests für PersonForm
- `frontend/src/components/CriteriaView.test.tsx` - Component Tests für CriteriaView
- `frontend/src/components/Dashboard.test.tsx` - Component Tests für Dashboard
- `frontend/src/test/setup.ts` - Vitest-Setup

**KI-Unterstützung:**
- Generierung der Component Tests mit Vitest und React Testing Library
- Mock-Setup für API-Calls
- Testfälle für alle UI-Interaktionen (Formular-Validierung, Checkbox-Interaktionen, API-Integration)
- Korrektur von Timing-Problemen in Tests (waitFor, getAllByText)

## 5. CI/CD Pipeline

### 5.1 GitHub Actions Workflow

**Dateien:**
- `.github/workflows/ci-build-lint.yml` - CI/CD Pipeline

**KI-Unterstützung:**
- Generierung der GitHub Actions Workflow-Datei
- Konfiguration für Backend-Build (Maven)
- Konfiguration für Frontend-Build (npm)
- Integration von ESLint-Checks
- Integration von automatischen Tests
- Test-Reporting (JUnit XML, Vitest Coverage)
- Docker-Image-Build für Staging-Deployment
- GitHub Secrets-Integration für sensible Daten
- Fehlerbehebung (deprecated Actions, Test-Report-Handling)

## 6. Docker-Konfiguration

### 6.1 Dockerfiles

**Dateien:**
- `backend/Dockerfile` - Multi-Stage Build für Spring Boot
- `frontend/Dockerfile` - Multi-Stage Build für React/Nginx
- `backend/.dockerignore` - Ignore-Dateien für Backend
- `frontend/.dockerignore` - Ignore-Dateien für Frontend

**KI-Unterstützung:**
- Generierung der Multi-Stage Dockerfiles
- Optimierung der Image-Grösse (Alpine-Basis)
- Healthcheck-Konfiguration
- Nginx-Konfiguration für SPA-Routing

## 7. Dokumentation

### 7.1 Projekt-Dokumentation

**Dateien:**
- `README.md` - Projektübersicht
- `CONTRIBUTING.md` - Workflow-Regeln
- `DEFINITION_OF_DONE.md` - DoD-Checkliste
- `docs/architektur.md` - Architektur-Dokumentation
- `docs/testkonzept.md` - Testkonzept
- `docs/testfaelle.md` - Testfalldokumentation
- `docs/testprotokoll.md` - Testergebnis-Protokoll
- `docs/deployment.md` - Deployment-Dokumentation

**KI-Unterstützung:**
- Generierung der initialen README-Struktur
- Erstellung der vollständigen Architektur-Dokumentation (3-Tier-Architektur, Datenmodell, API-Dokumentation)
- Detaillierte API-Dokumentation mit Request/Response-Beispielen
- Beschreibung der Notenberechnung mit Formeln und Beispielen
- Testkonzept mit Testarten, Testzielen, Testumgebung
- 34 dokumentierte Testfälle (Unit, Integration, Component)
- Testergebnis-Protokoll mit Fehleranalyse
- Deployment-Dokumentation mit GitHub Secrets

### 7.2 Code-Kommentare

**KI-Unterstützung:**
- JavaDoc-Kommentare in kritischen Methoden
- Inline-Kommentare für komplexe Logik (z.B. Notenberechnung)

## 8. Fehlerbehebung und Debugging

### 8.1 Identifizierte und behobene Fehler

**KI-Unterstützung bei:**
- Git-Repository-Initialisierung und Branch-Management
- PowerShell-Syntax-Probleme (mkdir -p)
- Frontend TypeScript-Konfiguration (JSX-Support)
- Import-Fehler (type-only imports)
- React Hooks Dependency-Warnings
- CI Pipeline-Fehler (deprecated Actions, npm ci)
- Docker Healthcheck-Konfiguration (Actuator fehlend)
- Java 23 Kompatibilität mit Mockito (Byte Buddy)
- Test-Fehler (NullPointerException, Timing-Probleme)
- ESLint-Fehler (unused imports)

## 9. Code-Qualität und Best Practices

### 9.1 Angewandte Best Practices

**KI-Unterstützung:**
- Clean Code-Prinzipien (klare Methodennamen, Single Responsibility)
- SOLID-Prinzipien (Service-Layer-Trennung)
- RESTful API-Design
- TypeScript-Typisierung für Type-Safety
- Error-Handling in allen Schichten
- Transaktionale Datenbankoperationen (@Transactional)

## 10. Zusammenfassung

### 10.1 KI-Einsatz nach Kategorien

| Kategorie | Anteil KI-Unterstützung | Team-Überprüfung |
|-----------|------------------------|------------------|
| Code-Generierung | ~80% | 100% überprüft und angepasst |
| Tests | ~70% | 100% überprüft und erweitert |
| Dokumentation | ~90% | 100% überprüft und korrigiert |
| CI/CD | ~85% | 100% getestet und validiert |
| Fehlerbehebung | ~60% | 100% validiert |

### 10.2 Verantwortlichkeit

**Wichtig:** Alle KI-generierten Inhalte wurden von den Teammitgliedern (Yanik und Andrin) überprüft, getestet und bei Bedarf angepasst. Die finale Verantwortung für den Code liegt vollständig beim Team.

### 10.3 Transparenz

Diese Dokumentation dient der vollständigen Transparenz über den KI-Einsatz im Projekt. Alle generierten Code-Teile und Dokumentationen sind im Git-Repository nachvollziehbar und können von externen Fachpersonen überprüft werden.

---

**Dokument erstellt**: 2026-01-18  
**Version**: 1.0  
**Status**: Abgeschlossen
