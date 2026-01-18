# Deployment-Dokumentation

## Übersicht

Die Anwendung wird automatisch nach erfolgreichem Pipeline-Durchlauf auf die Staging-Umgebung deployed.

## Deployment-Strategie

### Automatisches Deployment

- **Trigger**: Nach erfolgreichem Build & Test auf `main`-Branch
- **Workflow**: `.github/workflows/ci-build-lint.yml` → Job `staging-deployment`
- **Artefakte**: Docker Images für Backend und Frontend

### Docker Images

- **Backend**: `ipa-backend:latest` (Spring Boot JAR)
- **Frontend**: `ipa-frontend:latest` (Nginx mit React Build)

## GitHub Secrets Konfiguration

Die folgenden Secrets müssen in GitHub konfiguriert werden:

**Repository Settings > Secrets and variables > Actions**

### Erforderliche Secrets

#### Datenbank (Staging)
- `STAGING_DB_HOST`: Hostname der Staging-Datenbank
- `STAGING_DB_NAME`: Datenbankname
- `STAGING_DB_USER`: Datenbankbenutzer
- `STAGING_DB_PASSWORD`: Datenbankpasswort

#### Deployment-Plattform (optional)
- `DEPLOYMENT_PLATFORM`: Plattform (z.B. "railway", "render", "fly.io")
- `DEPLOYMENT_TOKEN`: API-Token für Deployment-Plattform
- `STAGING_URL`: URL der Staging-Umgebung

### Secrets hinzufügen

1. Gehe zu: `https://github.com/[USERNAME]/[REPO]/settings/secrets/actions`
2. Klicke auf "New repository secret"
3. Füge Name und Wert hinzu
4. Klicke auf "Add secret"

**WICHTIG**: Secrets werden niemals im Code oder Logs ausgegeben.

## Deployment-Optionen

### Option 1: Docker Compose (Lokal/Server)

```bash
# Docker Images bauen
docker build -t ipa-backend:latest ./backend
docker build -t ipa-frontend:latest ./frontend

# Mit docker-compose starten
docker-compose -f docker-compose.staging.yml up -d
```

### Option 2: Railway

1. Railway Account erstellen
2. GitHub Repository verbinden
3. Secrets in Railway konfigurieren
4. Automatisches Deployment aktivieren

### Option 3: Render

1. Render Account erstellen
2. GitHub Repository verbinden
3. Web Service für Backend erstellen
4. Static Site für Frontend erstellen
5. Secrets in Render konfigurieren

### Option 4: Fly.io

1. Fly.io Account erstellen
2. `flyctl` installieren
3. `fly.toml` konfigurieren
4. Secrets über `flyctl secrets set` konfigurieren

## Umgebungsvariablen

### Backend (application.properties)

```properties
# Datenbank (aus Secrets)
spring.datasource.url=jdbc:postgresql://${STAGING_DB_HOST}/${STAGING_DB_NAME}
spring.datasource.username=${STAGING_DB_USER}
spring.datasource.password=${STAGING_DB_PASSWORD}

# CORS (Frontend URL)
spring.web.cors.allowed-origins=${STAGING_FRONTEND_URL}
```

### Frontend (.env)

```env
VITE_API_URL=${STAGING_API_URL}
```

## Deployment-Status

Der Deployment-Status ist in GitHub Actions sichtbar:
- **Erfolgreich**: Grüner Haken bei "Deploy to Staging"
- **Fehlgeschlagen**: Roter Haken mit Fehlerdetails

## Troubleshooting

### Deployment schlägt fehl

1. Prüfe GitHub Actions Logs
2. Prüfe, ob alle Secrets konfiguriert sind
3. Prüfe Docker Image Builds
4. Prüfe Datenbankverbindung

### Secrets nicht verfügbar

- Secrets sind nur in GitHub Actions verfügbar
- Nicht in lokalen Builds oder anderen Workflows
- Prüfe Repository-Berechtigungen

## Nächste Schritte

1. Secrets in GitHub konfigurieren
2. Deployment-Plattform wählen
3. Spezifisches Deployment-Script implementieren
4. Staging-Umgebung testen
