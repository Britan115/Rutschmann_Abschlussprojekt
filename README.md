# IPA-Kriterien-Erfassungsapplikation

Webapplikation zur Erfassung und Bewertung von IPA-Kriterien gemäss QV BiVo 2021. Berechnet automatisch Gütestufen (0–3) pro Kriterium und mutmassliche Noten für Teil 1 und Teil 2 der IPA.

## Team

- **Andrin**: Backend, Datenmodell, Business-Logik, CI/CD, Backend-Tests
- **Yanik**: Frontend, UI/UX, Frontend-Tests, Testkonzept

## Technologie-Stack

- **Frontend**: React + Vite, TypeScript, ESLint
- **Backend**: Java Spring Boot (Maven), REST API, JUnit
- **Datenbank**: PostgreSQL (Docker Compose)
- **CI/CD**: GitHub Actions

## Setup

### Voraussetzungen
- Node.js (Version 18+)
- Java JDK 17+
- Maven 3.8+
- Docker & Docker Compose

### Start der Anwendung

1. **Datenbank starten:**
   ```bash
   docker-compose up -d
   ```

2. **Backend starten:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   Backend läuft auf: http://localhost:8080

3. **Frontend starten** (in separatem Terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend läuft auf: http://localhost:5173

### Erste Schritte
1. Personendaten erfassen (Name, Vorname, Thema, Abgabedatum)
2. Kriterien bearbeiten (Anforderungen abhaken, Notizen hinzufügen)
3. Dashboard anzeigen (Gütestufen und mutmassliche Noten)

## Dokumentation

Detaillierte Dokumentation im `/docs` Verzeichnis:
- `architektur.md`, `criteria.md`, `testkonzept.md`, `testfaelle.md`, `pipeline.md`, `ki-nutzung.md`

## Arbeitspakete

- AP-01: Projektsetup (abgeschlossen)
- AP-02: Kriterienaufbereitung (A04, H06, Doc03) (abgeschlossen)
- AP-03: Kriterien-API (abgeschlossen)
- AP-04: Personendaten erfassen (abgeschlossen)
- AP-05: Kriterienfortschritt speichern (abgeschlossen)
- AP-06: Berechnungslogik & Summary API (abgeschlossen)
- AP-07: Frontend Personenformular (abgeschlossen)
- AP-08: Frontend Kriterienansicht (abgeschlossen)
- AP-09: Frontend Dashboard (abgeschlossen)
- AP-10 bis AP-18: [siehe Arbeitspaket-Liste in Projektplanung]

## Contributing

Siehe [CONTRIBUTING.md](./CONTRIBUTING.md) und [DEFINITION_OF_DONE.md](./DEFINITION_OF_DONE.md)

