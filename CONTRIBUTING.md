# Contributing Guidelines

## Workflow

1. Feature-Branch von `main` erstellen: `feature/AP-XX-beschreibung`
2. Änderungen implementieren
3. Commits: `AP-XX: Beschreibung`
4. Branch pushen
5. Pull Request erstellen
6. **STOPPEN** und auf Review warten
7. Nach Merge: Nächstes Arbeitspaket

## Branch & Commits

```bash
# Branch erstellen
git checkout main
git pull origin main
git checkout -b feature/AP-XX-beschreibung

# Commits
git commit -m "AP-XX: Kurze Beschreibung"
```

**Branch-Format**: `feature/AP-01-projektsetup`  
**Commit-Format**: `AP-01: Projektsetup mit Ordnerstruktur`

## Pull Request

**PR-Titel**: `AP-XX: Beschreibung des Arbeitspakets`

**PR-Beschreibung**:
```markdown
## Arbeitspaket: AP-XX - [Titel]

### Was wurde umgesetzt?
- [Beschreibung]

### Geänderte/Erstellte Dateien
- `pfad/zu/datei1`

### Tests
- [ ] Backend: `mvn test`
- [ ] Frontend: `npm test`
```

**Review**: Anderes Team-Mitglied reviewed, bei Approval: Squash and Merge

## Wichtig

**Nach PR-Erstellung STOPPEN und auf Review/Merge warten. Erst danach nächstes Arbeitspaket.**

