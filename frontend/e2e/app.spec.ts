import { test, expect } from '@playwright/test';

// E2E-Tests für die IPA-Kriterien-Erfassungsapplikation
// TC-E2E-001 bis TC-E2E-005

test.describe('IPA Kriterien-Tracker E2E Tests', () => {

  test('TC-E2E-001: Startseite zeigt Personenformular', async ({ page }) => {
    await page.goto('/');
    
    // Prüfe Header
    await expect(page.locator('text=IPA Kriterien-Tracker')).toBeVisible();
    
    // Prüfe Formular-Felder
    await expect(page.getByLabel(/vorname/i)).toBeVisible();
    await expect(page.getByLabel(/nachname/i)).toBeVisible();
    await expect(page.getByLabel(/thema der arbeit/i)).toBeVisible();
    await expect(page.getByLabel(/abgabedatum/i)).toBeVisible();
    
    // Prüfe Submit-Button
    await expect(page.getByRole('button', { name: /bewertung starten/i })).toBeVisible();
  });

  test('TC-E2E-002: Formular zeigt Validierungsfehler bei leeren Feldern', async ({ page }) => {
    await page.goto('/');
    
    // Klicke Submit ohne Eingaben
    await page.getByRole('button', { name: /bewertung starten/i }).click();
    
    // Prüfe Validierungsfehler
    await expect(page.locator('text=/ist erforderlich/i').first()).toBeVisible();
  });

  test('TC-E2E-003: Person erfolgreich anlegen', async ({ page }) => {
    await page.goto('/');
    
    // Fülle Formular aus
    await page.getByLabel(/vorname/i).fill('Max');
    await page.getByLabel(/nachname/i).fill('Mustermann');
    await page.getByLabel(/thema der arbeit/i).fill('E2E Test Projekt');
    await page.getByLabel(/abgabedatum/i).fill('2026-06-15');
    
    // Submit
    await page.getByRole('button', { name: /bewertung starten/i }).click();
    
    // Warte auf Navigation zur Kriterienansicht
    // Prüfe, dass Person-Banner angezeigt wird
    await expect(page.locator('text=Max Mustermann')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=E2E Test Projekt')).toBeVisible();
    
    // Prüfe Navigation-Tabs
    await expect(page.getByRole('button', { name: /kriterien erfassen/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /notenübersicht/i })).toBeVisible();
  });

  test('TC-E2E-004: Kriterien anzeigen und Checkbox aktivieren', async ({ page }) => {
    await page.goto('/');
    
    // Person anlegen
    await page.getByLabel(/vorname/i).fill('Test');
    await page.getByLabel(/nachname/i).fill('User');
    await page.getByLabel(/thema der arbeit/i).fill('Kriterien Test');
    await page.getByLabel(/abgabedatum/i).fill('2026-06-15');
    await page.getByRole('button', { name: /bewertung starten/i }).click();
    
    // Warte auf Kriterienansicht
    await expect(page.locator('text=Bewertungskriterien')).toBeVisible({ timeout: 10000 });
    
    // Prüfe, dass Kriterien geladen wurden
    await expect(page.locator('text=/A04|H06|Doc03/').first()).toBeVisible({ timeout: 10000 });
    
    // Prüfe, dass Checkboxen vorhanden sind
    const checkboxes = page.getByRole('checkbox');
    await expect(checkboxes.first()).toBeVisible();
    
    // Klicke auf das erste Anforderungs-Element (die Checkbox wird über das Parent-Element gesteuert)
    const firstRequirement = page.locator('.requirement-item').first();
    await firstRequirement.click();
    
    // Prüfe, dass die Checkbox jetzt aktiviert ist
    await expect(checkboxes.first()).toBeChecked();
  });

  test('TC-E2E-005: Dashboard zeigt Noten an', async ({ page }) => {
    await page.goto('/');
    
    // Person anlegen
    await page.getByLabel(/vorname/i).fill('Dashboard');
    await page.getByLabel(/nachname/i).fill('Tester');
    await page.getByLabel(/thema der arbeit/i).fill('Dashboard Test');
    await page.getByLabel(/abgabedatum/i).fill('2026-06-15');
    await page.getByRole('button', { name: /bewertung starten/i }).click();
    
    // Warte auf Navigation
    await expect(page.locator('text=Dashboard Tester')).toBeVisible({ timeout: 10000 });
    
    // Wechsle zum Dashboard
    await page.getByRole('button', { name: /notenübersicht/i }).click();
    
    // Prüfe Dashboard-Inhalte
    await expect(page.locator('text=Mutmassliche Noten')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/teil 1/i').first()).toBeVisible();
    await expect(page.locator('text=/teil 2/i').first()).toBeVisible();
    
    // Prüfe, dass Noten angezeigt werden (entweder Zahl oder Strich)
    await expect(page.locator('.grade-value').first()).toBeVisible();
  });

});
