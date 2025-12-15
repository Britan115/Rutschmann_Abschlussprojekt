# Definition of Done (DoD)

Checkliste für alle Arbeitspakete und Pull Requests.

## Code & Funktionalität
- [ ] Alle Anforderungen des Arbeitspakets vollständig umgesetzt
- [ ] Code entspricht Projekt-Standards (ESLint/Checkstyle)
- [ ] Funktionalität manuell getestet
- [ ] Edge Cases berücksichtigt

## Tests
- [ ] Neue Features durch Tests abgedeckt
- [ ] Bestehende Tests laufen weiterhin
- [ ] Testabdeckung ≥ 80% der definierten Testfälle
- [ ] Backend: JUnit-Tests (Integrationstests falls relevant)
- [ ] Frontend: Komponententests (Jest, React Testing Library)

## Dokumentation
- [ ] README.md aktualisiert (falls relevant)
- [ ] API-Änderungen dokumentiert (falls relevant)
- [ ] Neue Abhängigkeiten dokumentiert

## Git & PR
- [ ] Commits folgen Konvention: `AP-XX: Beschreibung`
- [ ] Branch-Name: `feature/AP-XX-beschreibung`
- [ ] Branch auf neuestem Stand mit `main`
- [ ] PR-Beschreibung vollständig (Was, Dateien, Tests)
- [ ] Code reviewed vom anderen Team-Mitglied

## CI/CD
- [ ] GitHub Actions Pipeline erfolgreich
- [ ] Alle Tests bestehen
- [ ] Linting-Checks bestehen

