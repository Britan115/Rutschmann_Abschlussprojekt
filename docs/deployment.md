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

**Automatisch gebaute Images aus GitHub Actions verwenden:**

1. **Docker Images aus GitHub Actions Artefakten laden:**
   ```bash
   # Lade docker-images Artefakt aus GitHub Actions Run
   # Entpacke die Images:
   gunzip -c backend-image.tar.gz | docker load
   gunzip -c frontend-image.tar.gz | docker load
   ```

2. **Umgebungsvariablen setzen (aus GitHub Secrets):**
   ```bash
   export STAGING_DB_NAME=ipa_kriterien_db
   export STAGING_DB_USER=postgres
   export STAGING_DB_PASSWORD=<aus_secrets>
   export STAGING_FRONTEND_URL=http://localhost:80
   export STAGING_API_URL=http://localhost:8080/api
   ```

3. **Mit docker-compose starten:**
   ```bash
   docker-compose -f docker-compose.staging.yml up -d
   ```

4. **Status prüfen:**
   ```bash
   docker-compose -f docker-compose.staging.yml ps
   docker-compose -f docker-compose.staging.yml logs -f
   ```

**Oder: Images lokal bauen:**
```bash
# Docker Images bauen
docker build -t ipa-backend:latest ./backend
docker build -t ipa-frontend:latest ./frontend

# Mit docker-compose starten
docker-compose -f docker-compose.staging.yml up -d
```

### Option 2: Railway

1. Railway Account erstellen auf https://railway.app
2. GitHub Repository verbinden
3. PostgreSQL Datenbank hinzufügen
4. Backend und Frontend Services erstellen
5. Umgebungsvariablen konfigurieren

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
