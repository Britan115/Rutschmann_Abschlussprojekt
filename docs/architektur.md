# Architektur-Dokumentation

## 1. Übersicht

Die IPA-Kriterien-Erfassungsapplikation ist eine Webapplikation zur Erfassung und Bewertung von IPA-Kriterien gemäss QV BiVo 2021. Die Anwendung folgt einer 3-Tier-Architektur mit klarer Trennung zwischen Frontend, Backend und Datenbank.

## 2. Architektur-Übersicht

### 2.1 Systemarchitektur

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ PersonForm   │  │ CriteriaView │  │  Dashboard   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│         │                  │                  │            │
│         └──────────────────┴──────────────────┘            │
│                            │                                │
│                    ┌───────▼────────┐                      │
│                    │   API Service  │                      │
│                    │   (api.ts)     │                      │
│                    └───────┬────────┘                      │
└────────────────────────────┼──────────────────────────────┘
                             │ HTTP/REST
                             │ JSON
┌────────────────────────────▼──────────────────────────────┐
│                        Backend                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Controller  │  │   Service    │  │  Repository  │   │
│  │   Layer      │  │    Layer     │  │    Layer     │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                 │                 │            │
│         └─────────────────┴─────────────────┘            │
│                            │                                │
│                    ┌───────▼────────┐                      │
│                    │  Spring Data   │                      │
│                    │      JPA       │                      │
│                    └───────┬────────┘                      │
└────────────────────────────┼──────────────────────────────┘
                             │ JDBC
┌────────────────────────────▼──────────────────────────────┐
│                      Datenbank                            │
│                    PostgreSQL 15                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   persons    │  │criterion_    │  │fulfilled_    │   │
│  │              │  │progress      │  │requirements  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Technologie-Stack

**Frontend:**
- React 18 mit Vite (Build-Tool)
- TypeScript für Typsicherheit
- React Testing Library für Komponententests
- Vitest als Test-Framework

**Backend:**
- Java 17 (Spring Boot 3.2.0)
- Spring Web (REST API)
- Spring Data JPA (Datenbankzugriff)
- Maven (Build-Tool)
- JUnit 5 & Mockito (Tests)

**Datenbank:**
- PostgreSQL 15 (via Docker Compose)
- H2 (für Tests)

**CI/CD:**
- GitHub Actions
- Docker (Multi-Stage Builds)

## 3. Datenmodell

### 3.1 Entity-Relationship-Diagramm

```
┌─────────────────┐
│     Person       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ vorname         │
│ thema           │
│ abgabedatum     │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼──────────────────┐
│   CriterionProgress        │
├────────────────────────────┤
│ id (PK)                    │
│ person_id (FK)              │
│ criterionId                │
│ notes                       │
└────────┬────────────────────┘
         │ 1
         │
         │ N
┌────────▼──────────────────┐
│ fulfilled_requirements     │
├────────────────────────────┤
│ progress_id (FK)           │
│ requirement_id            │
└────────────────────────────┘
```

### 3.2 Datenbank-Tabellen

#### Tabelle: `persons`

Speichert die Personendaten (Name, Vorname, Thema, Abgabedatum).

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| id | BIGSERIAL | PRIMARY KEY, NOT NULL | Eindeutige ID (auto-increment) |
| name | VARCHAR(255) | NOT NULL | Nachname der Person |
| vorname | VARCHAR(255) | NOT NULL | Vorname der Person |
| thema | VARCHAR(255) | NOT NULL | Thema der IPA-Arbeit |
| abgabedatum | DATE | NOT NULL | Abgabedatum der IPA |

**Beispiel:**
```sql
INSERT INTO persons (name, vorname, thema, abgabedatum) 
VALUES ('Muster', 'Max', 'IPA-Kriterien-App', '2024-12-31');
```

#### Tabelle: `criterion_progress`

Speichert den Fortschritt pro Person und Kriterium.

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| id | BIGSERIAL | PRIMARY KEY, NOT NULL | Eindeutige ID (auto-increment) |
| person_id | BIGINT | FOREIGN KEY, NOT NULL | Referenz auf `persons.id` |
| criterion_id | VARCHAR(255) | NOT NULL | ID des Kriteriums (z.B. "A04") |
| notes | VARCHAR(1000) | NULL | Notizen zum Kriterium |

**Beziehung:**
- `person_id` → `persons.id` (Many-to-One)
- Eine Person kann mehrere `CriterionProgress` Einträge haben (pro Kriterium)

**Beispiel:**
```sql
INSERT INTO criterion_progress (person_id, criterion_id, notes) 
VALUES (1, 'A04', 'Zeitplan ist erstellt');
```

#### Tabelle: `fulfilled_requirements`

Speichert die erfüllten Anforderungen pro `CriterionProgress` (Element-Collection).

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| progress_id | BIGINT | FOREIGN KEY, NOT NULL | Referenz auf `criterion_progress.id` |
| requirement_id | VARCHAR(255) | NOT NULL | ID der erfüllten Anforderung (z.B. "A04-1") |

**Beziehung:**
- `progress_id` → `criterion_progress.id` (Many-to-One)
- Ein `CriterionProgress` kann mehrere erfüllte Anforderungen haben

**Beispiel:**
```sql
INSERT INTO fulfilled_requirements (progress_id, requirement_id) 
VALUES (1, 'A04-1'), (1, 'A04-2'), (1, 'A04-3');
```

### 3.3 Java Entity-Modelle

#### Person (Entity)

```java
@Entity
@Table(name = "persons")
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String vorname;
    
    @Column(nullable = false)
    private String thema;
    
    @Column(nullable = false)
    private LocalDate abgabedatum;
}
```

**Beschreibung:**
- Repräsentiert eine Person (Student/Studentin) mit IPA-Arbeit
- Wird verwendet, um den Kontext der Kriterien-Erfassung zu speichern
- Jede Person hat eine eindeutige ID

#### CriterionProgress (Entity)

```java
@Entity
@Table(name = "criterion_progress")
public class CriterionProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;
    
    @Column(nullable = false)
    private String criterionId;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "fulfilled_requirements", 
                     joinColumns = @JoinColumn(name = "progress_id"))
    @Column(name = "requirement_id")
    private Set<String> fulfilledRequirements;
    
    @Column(length = 1000)
    private String notes;
}
```

**Beschreibung:**
- Speichert den Fortschritt einer Person für ein spezifisches Kriterium
- `fulfilledRequirements` ist eine Element-Collection (Set von Strings)
- `notes` ermöglicht freie Notizen zum Kriterium

### 3.4 Datenfluss

**Erfassung einer Person:**
1. Frontend sendet POST `/api/person` mit Personendaten
2. Backend speichert in `persons` Tabelle
3. Backend gibt gespeicherte Person mit ID zurück

**Speichern des Kriterien-Fortschritts:**
1. Frontend sendet PUT `/api/person/{id}/criteria/{criterionId}` mit erfüllten Anforderungen
2. Backend speichert/aktualisiert `criterion_progress` Tabelle
3. Backend speichert erfüllte Anforderungen in `fulfilled_requirements` Tabelle

**Berechnung der Summary:**
1. Frontend sendet GET `/api/person/{id}/summary`
2. Backend lädt Person und alle `CriterionProgress` Einträge
3. Backend lädt Kriterien aus `criteria.json`
4. Backend berechnet Gütestufen und Noten
5. Backend gibt `SummaryResponse` zurück

## 4. Backend-Architektur

### 4.1 Schichtenarchitektur

Das Backend folgt einer 3-Schichten-Architektur:

**1. Controller Layer (REST API)**
- `CriteriaController`: Endpoints für Kriterien
- `PersonController`: Endpoints für Personen und Fortschritt

**2. Service Layer (Business-Logik)**
- `CriteriaService`: Lädt Kriterien aus JSON
- `PersonService`: Verwaltet Personendaten
- `CriterionProgressService`: Verwaltet Kriterien-Fortschritt
- `SummaryService`: Berechnet Gütestufen und Noten

**3. Repository Layer (Datenbankzugriff)**
- `PersonRepository`: Spring Data JPA Repository für Person
- `CriterionProgressRepository`: Spring Data JPA Repository für CriterionProgress

### 4.2 Package-Struktur

```
ch.bbw.ipa
├── IpaKriterienApplication.java    # Spring Boot Main Class
├── config/
│   └── CorsConfig.java             # CORS-Konfiguration
├── controller/
│   ├── CriteriaController.java      # REST Endpoints für Kriterien
│   └── PersonController.java        # REST Endpoints für Personen
├── dto/
│   ├── CriterionProgressRequest.java # Request DTO
│   ├── CriterionSummary.java        # Response DTO
│   └── SummaryResponse.java          # Response DTO
├── model/
│   ├── Criteria.java                # Kriterien-Modell
│   ├── CriteriaResponse.java        # Response-Modell
│   ├── CriterionProgress.java       # Entity
│   ├── Person.java                  # Entity
│   ├── QualityLevels.java           # Gütestufen-Modell
│   └── Requirement.java             # Anforderungs-Modell
├── repository/
│   ├── CriterionProgressRepository.java # JPA Repository
│   └── PersonRepository.java            # JPA Repository
└── service/
    ├── CriteriaService.java         # Kriterien-Service
    ├── CriterionProgressService.java # Fortschritt-Service
    ├── PersonService.java           # Personen-Service
    └── SummaryService.java          # Summary-Service
```

### 4.3 REST API Endpoints

#### GET `/api/criteria`
Lädt alle Kriterien aus `criteria.json`.

**Request:** Keine Parameter

**Response:**
```json
{
  "criteria": [
    {
      "id": "A04",
      "title": "Zeitplan",
      "question": "Was sind die Anforderungen an den Zeitplan?",
      "requirements": [...],
      "qualityLevels": {...}
    }
  ]
}
```

#### POST `/api/person`
Erstellt eine neue Person.

**Request:**
```json
{
  "name": "Muster",
  "vorname": "Max",
  "thema": "IPA-Kriterien-App",
  "abgabedatum": "2024-12-31"
}
```

**Response:** Status 201 Created
```json
{
  "id": 1,
  "name": "Muster",
  "vorname": "Max",
  "thema": "IPA-Kriterien-App",
  "abgabedatum": "2024-12-31"
}
```

#### PUT `/api/person/{id}/criteria/{criterionId}`
Speichert/aktualisiert den Fortschritt für ein Kriterium.

**Request:**
```json
{
  "fulfilledRequirements": ["A04-1", "A04-2", "A04-3"],
  "notes": "Zeitplan ist erstellt"
}
```

**Response:** Status 200 OK
```json
{
  "id": 1,
  "person": {...},
  "criterionId": "A04",
  "fulfilledRequirements": ["A04-1", "A04-2", "A04-3"],
  "notes": "Zeitplan ist erstellt"
}
```

#### GET `/api/person/{id}/summary`
Berechnet und liefert die Summary (Gütestufen und Noten).

**Request:** Keine Body-Parameter

**Response:** Status 200 OK
```json
{
  "criteriaSummaries": [
    {
      "criterionId": "A04",
      "criterionTitle": "Zeitplan",
      "fulfilledCount": 6,
      "totalCount": 6,
      "qualityLevel": 3
    }
  ],
  "estimatedGradePart1": 5.5,
  "estimatedGradePart2": 4.8
}
```

### 4.4 Business-Logik

#### Gütestufen-Berechnung

Die Gütestufe wird basierend auf der Anzahl erfüllter Anforderungen berechnet:

| Erfüllte Anforderungen | Gütestufe |
|------------------------|-----------|
| Alle (6/6) | 3 |
| 4-5 | 2 |
| 2-3 | 1 |
| < 2 | 0 |

**Implementierung:** `SummaryService.calculateQualityLevel()`

#### Notenberechnung

Die mutmassliche Note wird pro Teil (Teil 1 oder Teil 2) berechnet:

**Formel:**
```
Note = 4.0 + (Durchschnitt_Gütestufen * 0.5)
```

**Beispiele:**
- Gütestufe 3 → Note = 4.0 + (3.0 * 0.5) = 5.5
- Gütestufe 2 → Note = 4.0 + (2.0 * 0.5) = 5.0
- Gütestufe 1 → Note = 4.0 + (1.0 * 0.5) = 4.5
- Gütestufe 0 → Note = 4.0 + (0.0 * 0.5) = 4.0

**Implementierung:** `SummaryService.calculateSummary()`

#### Teil-Zuordnung

Kriterien werden basierend auf ihren Requirements einem Teil zugeordnet:
- Wenn alle Requirements `part: 1` haben → Teil 1
- Wenn alle Requirements `part: 2` haben → Teil 2
- Bei gemischten Requirements: Mehrheit entscheidet

**Implementierung:** `SummaryService.determinePart()`

## 5. Frontend-Architektur

### 5.1 Komponenten-Struktur

```
src/
├── App.tsx                    # Haupt-Komponente (Routing)
├── main.tsx                   # Entry Point
├── components/
│   ├── PersonForm.tsx         # Formular für Personendaten
│   ├── CriteriaView.tsx       # Anzeige und Bearbeitung der Kriterien
│   └── Dashboard.tsx          # Übersicht mit Gütestufen und Noten
└── services/
    └── api.ts                 # API-Service (HTTP-Requests)
```

### 5.2 Komponenten-Beschreibung

#### App.tsx
Haupt-Komponente, die die Navigation zwischen den Views verwaltet.

**State:**
- `currentPerson`: Aktuell erfasste Person (null wenn keine erfasst)
- `viewMode`: 'form' | 'criteria' | 'dashboard'`

**Funktionalität:**
- Zeigt `PersonForm` wenn keine Person erfasst ist
- Zeigt Navigation (Kriterien/Dashboard) wenn Person erfasst ist
- Wechselt zwischen `CriteriaView` und `Dashboard`

#### PersonForm.tsx
Formular zur Erfassung von Personendaten.

**State:**
- `formData`: Personendaten (name, vorname, thema, abgabedatum)
- `errors`: Validierungsfehler
- `isSubmitting`: Lade-Status
- `submitError`: Fehlermeldung bei API-Fehler

**Funktionalität:**
- Validierung der Eingabefelder
- API-Aufruf zum Speichern der Person
- Callback `onSuccess` nach erfolgreichem Speichern

#### CriteriaView.tsx
Anzeige und Bearbeitung der Kriterien.

**Props:**
- `personId`: ID der Person

**State:**
- `criteria`: Geladene Kriterien
- `progress`: Fortschritt pro Kriterium
- `loading`: Lade-Status
- `error`: Fehlermeldung

**Funktionalität:**
- Lädt alle Kriterien vom Backend
- Zeigt Checkboxen für jede Anforderung
- Zeigt Notizfeld pro Kriterium
- Speichert Fortschritt via API

#### Dashboard.tsx
Übersicht mit Gütestufen und mutmasslichen Noten.

**Props:**
- `personId`: ID der Person

**State:**
- `summary`: Geladene Summary
- `loading`: Lade-Status
- `error`: Fehlermeldung

**Funktionalität:**
- Lädt Summary vom Backend
- Zeigt Gütestufe pro Kriterium (0-3)
- Zeigt mutmassliche Note für Teil 1 und Teil 2
- Visualisierung mit Farben (grün=3, blau=2, gelb=1, rot=0)

### 5.3 API-Service

Der `api.ts` Service kapselt alle HTTP-Requests zum Backend.

**Funktionen:**
- `personService.createPerson()`: Erstellt Person
- `criteriaService.getCriteria()`: Lädt alle Kriterien
- `criteriaService.saveProgress()`: Speichert Fortschritt
- `criteriaService.getSummary()`: Lädt Summary

**Konfiguration:**
- Base URL: `http://localhost:8080/api`
- Content-Type: `application/json`

## 6. Datenbank-Konfiguration

### 6.1 PostgreSQL Setup

**Docker Compose:**
- Image: `postgres:15-alpine`
- Port: 5432
- Datenbank: `ipa_kriterien_db`
- User: `postgres`
- Password: `postgres`

**Connection String:**
```
jdbc:postgresql://localhost:5432/ipa_kriterien_db
```

### 6.2 JPA/Hibernate Konfiguration

**application.properties:**
```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

**DDL-Auto:**
- `update`: Tabellen werden automatisch erstellt/aktualisiert
- Keine manuelle Migration nötig für Entwicklung

## 7. CORS-Konfiguration

Das Backend erlaubt Cross-Origin-Requests vom Frontend:

**CorsConfig.java:**
- Erlaubt Requests von `http://localhost:5173` (Vite Dev Server)
- Erlaubt alle HTTP-Methoden (GET, POST, PUT, etc.)
- Erlaubt alle Headers

## 8. Deployment-Architektur

### 8.1 Docker-Container

**Backend:**
- Multi-Stage Build (Maven Build → JRE Runtime)
- Basis: `eclipse-temurin:17-jre-alpine`
- Port: 8080
- Healthcheck: `/api/criteria`

**Frontend:**
- Multi-Stage Build (Node Build → Nginx)
- Basis: `nginx:alpine`
- Port: 80
- Serves statische Dateien aus `/dist`

### 8.2 CI/CD Pipeline

**GitHub Actions:**
1. Build & Test (Backend + Frontend)
2. Docker Images bauen
3. Deployment (nur auf main-Branch)

**Workflow:** `.github/workflows/ci-build-lint.yml`

## 9. Sicherheit

### 9.1 Aktuelle Implementierung

- Keine Authentifizierung (MVP)
- Keine Autorisierung
- CORS für lokale Entwicklung konfiguriert

### 9.2 Zukünftige Verbesserungen

- JWT-basierte Authentifizierung
- Rollenbasierte Autorisierung
- HTTPS für Production
- Input-Validierung erweitern

## 10. Skalierbarkeit

### 10.1 Aktuelle Architektur

- Monolithisches Backend (Spring Boot)
- Single-Page Application (React)
- Relationale Datenbank (PostgreSQL)

### 10.2 Skalierungsmöglichkeiten

- Horizontal Scaling: Mehrere Backend-Instanzen
- Load Balancing: Nginx/HAProxy vor Backend
- Database: Read-Replicas für bessere Performance
- Caching: Redis für häufig abgerufene Daten

---

**Dokument erstellt**: 2026-01-18  
**Version**: 1.0  
**Status**: Abgeschlossen
