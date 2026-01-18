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

Vollständige Dokumentation aller REST API Endpoints mit Request/Response-Beispielen, Status-Codes und Fehlerbehandlung.

#### GET `/api/criteria`

Lädt alle Kriterien aus `criteria.json`.

**HTTP-Methode:** GET  
**URL:** `/api/criteria`  
**Authentifizierung:** Keine (MVP)

**Request:**
- Keine Query-Parameter
- Kein Request-Body

**Response:**

**Status 200 OK:**
```json
{
  "criteria": [
    {
      "id": "A04",
      "title": "Zeitplan",
      "question": "Was sind die Anforderungen an den Zeitplan?",
      "requirements": [
        {
          "id": "A04-1",
          "description": "Der Zeitplan ist Bestandteil von Teil 1 des IPA-Berichts.",
          "module": "BF",
          "part": 1
        },
        {
          "id": "A04-2",
          "description": "Der Zeitplan ist übersichtlich gestaltet.",
          "module": "BF",
          "part": 1
        }
      ],
      "qualityLevels": {
        "level0": "Weniger als 2 Anforderungen erfüllt",
        "level1": "2-3 Anforderungen erfüllt",
        "level2": "4-5 Anforderungen erfüllt",
        "level3": "Alle Anforderungen erfüllt"
      }
    },
    {
      "id": "H06",
      "title": "Automatisierung des Auslieferungsprozesses",
      ...
    },
    {
      "id": "Doc03",
      "title": "Formale Anforderungen an den IPA-Bericht",
      ...
    }
  ]
}
```

**Status 500 Internal Server Error:**
- Tritt auf, wenn `criteria.json` nicht geladen werden kann
- Response: Leerer Body

**Beispiel-Request (cURL):**
```bash
curl -X GET http://localhost:8080/api/criteria \
  -H "Content-Type: application/json"
```

---

#### POST `/api/person`

Erstellt eine neue Person in der Datenbank.

**HTTP-Methode:** POST  
**URL:** `/api/person`  
**Authentifizierung:** Keine (MVP)

**Request:**

**Content-Type:** `application/json`

**Body:**
```json
{
  "name": "Muster",
  "vorname": "Max",
  "thema": "IPA-Kriterien-App",
  "abgabedatum": "2024-12-31"
}
```

**Validierung:**
- `name`: Pflichtfeld, nicht leer
- `vorname`: Pflichtfeld, nicht leer
- `thema`: Pflichtfeld, nicht leer
- `abgabedatum`: Pflichtfeld, Format: YYYY-MM-DD

**Response:**

**Status 201 Created:**
```json
{
  "id": 1,
  "name": "Muster",
  "vorname": "Max",
  "thema": "IPA-Kriterien-App",
  "abgabedatum": "2024-12-31"
}
```

**Status 500 Internal Server Error:**
- Tritt auf bei Datenbankfehlern
- Response: Leerer Body

**Beispiel-Request (cURL):**
```bash
curl -X POST http://localhost:8080/api/person \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Muster",
    "vorname": "Max",
    "thema": "IPA-Kriterien-App",
    "abgabedatum": "2024-12-31"
  }'
```

---

#### PUT `/api/person/{id}/criteria/{criterionId}`

Speichert oder aktualisiert den Fortschritt für ein spezifisches Kriterium einer Person.

**HTTP-Methode:** PUT  
**URL:** `/api/person/{id}/criteria/{criterionId}`  
**Path-Parameter:**
- `id` (Long): ID der Person
- `criterionId` (String): ID des Kriteriums (z.B. "A04", "H06", "Doc03")

**Authentifizierung:** Keine (MVP)

**Request:**

**Content-Type:** `application/json`

**Body:**
```json
{
  "fulfilledRequirements": ["A04-1", "A04-2", "A04-3"],
  "notes": "Zeitplan ist erstellt und dokumentiert"
}
```

**Validierung:**
- `fulfilledRequirements`: Array von Requirement-IDs (kann leer sein)
- `notes`: Optional, max. 1000 Zeichen

**Response:**

**Status 200 OK:**
```json
{
  "id": 1,
  "person": {
    "id": 1,
    "name": "Muster",
    "vorname": "Max",
    "thema": "IPA-Kriterien-App",
    "abgabedatum": "2024-12-31"
  },
  "criterionId": "A04",
  "fulfilledRequirements": ["A04-1", "A04-2", "A04-3"],
  "notes": "Zeitplan ist erstellt und dokumentiert"
}
```

**Status 404 Not Found:**
- Tritt auf, wenn Person mit gegebener ID nicht existiert
- Response: Leerer Body

**Status 500 Internal Server Error:**
- Tritt auf bei Datenbankfehlern
- Response: Leerer Body

**Beispiel-Request (cURL):**
```bash
curl -X PUT http://localhost:8080/api/person/1/criteria/A04 \
  -H "Content-Type: application/json" \
  -d '{
    "fulfilledRequirements": ["A04-1", "A04-2", "A04-3"],
    "notes": "Zeitplan ist erstellt"
  }'
```

---

#### GET `/api/person/{id}/summary`

Berechnet und liefert die Zusammenfassung (Summary) mit Gütestufen pro Kriterium und mutmasslichen Noten für Teil 1 und Teil 2.

**HTTP-Methode:** GET  
**URL:** `/api/person/{id}/summary`  
**Path-Parameter:**
- `id` (Long): ID der Person

**Authentifizierung:** Keine (MVP)

**Request:**
- Keine Query-Parameter
- Kein Request-Body

**Response:**

**Status 200 OK:**
```json
{
  "criteriaSummaries": [
    {
      "criterionId": "A04",
      "criterionTitle": "Zeitplan",
      "fulfilledCount": 6,
      "totalCount": 6,
      "qualityLevel": 3
    },
    {
      "criterionId": "H06",
      "criterionTitle": "Automatisierung des Auslieferungsprozesses",
      "fulfilledCount": 4,
      "totalCount": 6,
      "qualityLevel": 2
    },
    {
      "criterionId": "Doc03",
      "criterionTitle": "Formale Anforderungen an den IPA-Bericht",
      "fulfilledCount": 2,
      "totalCount": 6,
      "qualityLevel": 1
    }
  ],
  "estimatedGradePart1": 5.5,
  "estimatedGradePart2": 4.8
}
```

**Status 404 Not Found:**
- Tritt auf, wenn Person mit gegebener ID nicht existiert
- Response: Leerer Body

**Status 500 Internal Server Error:**
- Tritt auf bei Fehlern beim Laden der Kriterien oder Berechnungsfehlern
- Response: Leerer Body

**Beispiel-Request (cURL):**
```bash
curl -X GET http://localhost:8080/api/person/1/summary \
  -H "Content-Type: application/json"
```

---

### 4.4 API-Fehlerbehandlung

Alle Endpoints verwenden einheitliche HTTP-Status-Codes:

| Status-Code | Bedeutung | Verwendung |
|-------------|-----------|------------|
| 200 OK | Erfolgreiche Anfrage | GET, PUT erfolgreich |
| 201 Created | Ressource erstellt | POST erfolgreich |
| 404 Not Found | Ressource nicht gefunden | Person-ID existiert nicht |
| 500 Internal Server Error | Server-Fehler | Datenbankfehler, JSON-Ladefehler |

**Hinweis:** Aktuell werden keine detaillierten Fehlermeldungen im Response-Body zurückgegeben (MVP). Für Production sollten strukturierte Fehler-Responses implementiert werden.

### 4.4 Business-Logik

#### Gütestufen-Berechnung

Die Gütestufe wird basierend auf der Anzahl erfüllter Anforderungen berechnet. Diese Logik ist fest definiert und darf nicht geändert werden.

**Regeln:**

| Erfüllte Anforderungen | Gütestufe | Beschreibung |
|------------------------|-----------|--------------|
| Alle Anforderungen erfüllt (z.B. 6/6) | 3 | Höchste Qualitätsstufe |
| 4-5 Anforderungen erfüllt | 2 | Gute Qualität |
| 2-3 Anforderungen erfüllt | 1 | Grundanforderungen erfüllt |
| Weniger als 2 erfüllt | 0 | Mindestanforderungen nicht erfüllt |

**Beispiele:**
- Kriterium A04 hat 6 Anforderungen, 6 erfüllt → Gütestufe 3
- Kriterium H06 hat 6 Anforderungen, 4 erfüllt → Gütestufe 2
- Kriterium Doc03 hat 6 Anforderungen, 2 erfüllt → Gütestufe 1
- Kriterium A04 hat 6 Anforderungen, 1 erfüllt → Gütestufe 0

**Implementierung:** `SummaryService.calculateQualityLevel(int fulfilledCount, int totalCount)`

**Code:**
```java
private int calculateQualityLevel(int fulfilledCount, int totalCount) {
    if (fulfilledCount == totalCount) {
        return 3;  // Alle erfüllt
    } else if (fulfilledCount >= 4 && fulfilledCount <= 5) {
        return 2;  // 4-5 erfüllt
    } else if (fulfilledCount >= 2 && fulfilledCount <= 3) {
        return 1;  // 2-3 erfüllt
    } else {
        return 0;  // < 2 erfüllt
    }
}
```

---

#### Notenberechnung

Die mutmassliche Note wird pro Teil (Teil 1 oder Teil 2) berechnet. Die Note gibt eine Schätzung der IPA-Note basierend auf den erreichten Gütestufen.

**Formel:**

```
Note = 1.0 + (Durchschnitt_Gütestufen * 5/3)
```

**Berechnungsschritte:**

1. **Gütestufen pro Teil sammeln:**
   - Alle Kriterien werden ihrem Teil zugeordnet (basierend auf Requirements)
   - Für jedes Kriterium wird die Gütestufe berechnet
   - Gütestufen werden pro Teil summiert

2. **Durchschnitt berechnen:**
   ```
   Durchschnitt_Teil1 = Summe_Gütestufen_Teil1 / Anzahl_Kriterien_Teil1
   Durchschnitt_Teil2 = Summe_Gütestufen_Teil2 / Anzahl_Kriterien_Teil2
```

3. **Note berechnen:**
   ```
   Note_Teil1 = 1.0 + (Durchschnitt_Teil1 * 5/3)
   Note_Teil2 = 1.0 + (Durchschnitt_Teil2 * 5/3)
   ```

**Notenskala:**

| Durchschnitt Gütestufen | Note | Interpretation |
|-------------------------|------|----------------|
| 3.0 | 6.0 | Sehr gut |
| 2.5 | 5.17 | Gut |
| 2.0 | 4.33 | Genügend |
| 1.5 | 3.5 | Ungenügend |
| 1.0 | 2.67 | Ungenügend |
| 0.5 | 1.83 | Ungenügend |
| 0.0 | 1.0 | Ungenügend |

**Detaillierte Beispiele:**

**Beispiel 1: Alle Kriterien mit Gütestufe 3**
- Teil 1: A04 (Gütestufe 3), Doc03 (Gütestufe 3)
- Durchschnitt Teil 1: (3 + 3) / 2 = 3.0
- Note Teil 1: 1.0 + (3.0 * 5/3) = 6.0

- Teil 2: H06 (Gütestufe 3)
- Durchschnitt Teil 2: 3.0 / 1 = 3.0
- Note Teil 2: 1.0 + (3.0 * 5/3) = 6.0

**Beispiel 2: Gemischte Gütestufen**
- Teil 1: A04 (Gütestufe 3), Doc03 (Gütestufe 1)
- Durchschnitt Teil 1: (3 + 1) / 2 = 2.0
- Note Teil 1: 1.0 + (2.0 * 5/3) = 4.33

- Teil 2: H06 (Gütestufe 2)
- Durchschnitt Teil 2: 2.0 / 1 = 2.0
- Note Teil 2: 1.0 + (2.0 * 5/3) = 4.33

**Beispiel 3: Schlechte Leistung**
- Teil 1: A04 (Gütestufe 0), Doc03 (Gütestufe 1)
- Durchschnitt Teil 1: (0 + 1) / 2 = 0.5
- Note Teil 1: 1.0 + (0.5 * 5/3) = 1.83

- Teil 2: H06 (Gütestufe 0)
- Durchschnitt Teil 2: 0.0 / 1 = 0.0
- Note Teil 2: 1.0 + (0.0 * 5/3) = 1.0

**Implementierung:** `SummaryService.calculateSummary(Long personId)`

**Code-Ausschnitt:**
```java
// Summiere Gütestufen pro Teil
double sumPart1 = 0.0;
double sumPart2 = 0.0;
int countPart1 = 0;
int countPart2 = 0;

for (Criteria criterion : allCriteria) {
    int qualityLevel = calculateQualityLevel(fulfilledCount, totalCount);
    int part = determinePart(criterion);
    
    if (part == 1) {
        sumPart1 += qualityLevel;
        countPart1++;
    } else if (part == 2) {
        sumPart2 += qualityLevel;
        countPart2++;
    }
}

// Berechne Noten
Double estimatedGradePart1 = countPart1 > 0 
    ? 1.0 + (sumPart1 / countPart1) * (5.0 / 3.0) 
    : null;
Double estimatedGradePart2 = countPart2 > 0 
    ? 1.0 + (sumPart2 / countPart2) * (5.0 / 3.0) 
    : null;
```

**Hinweise:**
- Wenn keine Kriterien für einen Teil vorhanden sind, wird `null` zurückgegeben
- Die Note wird auf 2 Dezimalstellen gerundet (im Frontend)
- Die Formel ist linear: Jede Gütestufe entspricht 0.5 Notenpunkten

---

#### Teil-Zuordnung

Kriterien werden basierend auf ihren Requirements einem Teil (Teil 1 oder Teil 2) zugeordnet. Dies ist wichtig für die separate Notenberechnung pro Teil.

**Regeln:**

1. **Alle Requirements zu einem Teil:**
   - Wenn alle Requirements `part: 1` haben → Kriterium gehört zu Teil 1
   - Wenn alle Requirements `part: 2` haben → Kriterium gehört zu Teil 2

2. **Gemischte Requirements:**
   - Wenn Requirements zu beiden Teilen gehören → Mehrheit entscheidet
   - Bei Gleichstand: Teil 1 wird bevorzugt

**Beispiele:**

**Kriterium A04 (Zeitplan):**
- Alle 6 Requirements haben `part: 1`
- → Kriterium gehört zu Teil 1

**Kriterium H06 (Automatisierung):**
- Alle 6 Requirements haben `part: 2`
- → Kriterium gehört zu Teil 2

**Kriterium Doc03 (Formale Anforderungen):**
- Alle 6 Requirements haben `part: 1`
- → Kriterium gehört zu Teil 1

**Implementierung:** `SummaryService.determinePart(Criteria criterion)`

**Code:**
```java
private int determinePart(Criteria criterion) {
    if (criterion.getRequirements().isEmpty()) {
        return 1; // Default
    }
    
    int part1Count = 0;
    int part2Count = 0;
    
    for (var req : criterion.getRequirements()) {
        if (req.getPart() == 1) {
            part1Count++;
        } else if (req.getPart() == 2) {
            part2Count++;
        }
    }
    
    return part2Count > part1Count ? 2 : 1;
}
```

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
