package ch.bbw.ipa.controller;

import ch.bbw.ipa.dto.CriterionProgressRequest;
import ch.bbw.ipa.dto.SummaryResponse;
import ch.bbw.ipa.model.CriterionProgress;
import ch.bbw.ipa.model.Person;
import ch.bbw.ipa.service.CriterionProgressService;
import ch.bbw.ipa.service.PersonService;
import ch.bbw.ipa.service.SummaryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration Tests für PersonController
 * TC-API-006 bis TC-API-020
 */
@WebMvcTest(PersonController.class)
class PersonControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PersonService personService;

    @MockBean
    private CriterionProgressService criterionProgressService;

    @MockBean
    private SummaryService summaryService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreatePerson_ValidData_Returns201Created() throws Exception {
        // TC-API-006: POST /api/person mit gültigen Daten liefert Status 201 Created
        Person person = new Person("Muster", "Max", "IPA-Kriterien-App", LocalDate.of(2024, 12, 31));
        person.setId(1L);

        when(personService.savePerson(any(Person.class))).thenReturn(person);

        String json = objectMapper.writeValueAsString(person);

        mockMvc.perform(post("/api/person")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Muster"))
                .andExpect(jsonPath("$.vorname").value("Max"));
    }

    @Test
    void testCreatePerson_ResponseContainsSavedPersonWithId() throws Exception {
        // TC-API-007: Response enthält gespeicherte Person mit generierter ID
        Person person = new Person("Muster", "Max", "IPA-Kriterien-App", LocalDate.of(2024, 12, 31));
        person.setId(1L);

        when(personService.savePerson(any(Person.class))).thenReturn(person);

        String json = objectMapper.writeValueAsString(person);

        mockMvc.perform(post("/api/person")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Muster"))
                .andExpect(jsonPath("$.vorname").value("Max"))
                .andExpect(jsonPath("$.thema").value("IPA-Kriterien-App"));
    }

    @Test
    void testUpdateCriterionProgress_SavesFulfilledRequirements() throws Exception {
        // TC-API-011: PUT /api/person/{id}/criteria/{criterionId} speichert erfüllte Anforderungen
        CriterionProgressRequest request = new CriterionProgressRequest();
        request.setFulfilledRequirements(Set.of("A04-1", "A04-2", "A04-3"));
        request.setNotes("Zeitplan ist erstellt");

        CriterionProgress progress = new CriterionProgress();
        progress.setFulfilledRequirements(request.getFulfilledRequirements());
        progress.setNotes(request.getNotes());

        when(criterionProgressService.saveOrUpdateProgress(eq(1L), eq("A04"), any()))
                .thenReturn(progress);

        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(put("/api/person/1/criteria/A04")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.notes").value("Zeitplan ist erstellt"));
    }

    @Test
    void testUpdateCriterionProgress_SavesNotes() throws Exception {
        // TC-API-012: PUT speichert Notizen
        CriterionProgressRequest request = new CriterionProgressRequest();
        request.setFulfilledRequirements(Set.of("A04-1"));
        request.setNotes("Zeitplan muss noch aktualisiert werden");

        CriterionProgress progress = new CriterionProgress();
        progress.setNotes(request.getNotes());

        when(criterionProgressService.saveOrUpdateProgress(eq(1L), eq("A04"), any()))
                .thenReturn(progress);

        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(put("/api/person/1/criteria/A04")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.notes").value("Zeitplan muss noch aktualisiert werden"));
    }

    @Test
    void testUpdateCriterionProgress_PersonNotFound_Returns404() throws Exception {
        // TC-API-014: Fehlerbehandlung bei nicht existierender Person (Status 404)
        CriterionProgressRequest request = new CriterionProgressRequest();
        request.setFulfilledRequirements(Set.of("A04-1"));

        when(criterionProgressService.saveOrUpdateProgress(eq(999L), eq("A04"), any()))
                .thenThrow(new RuntimeException("Person nicht gefunden"));

        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(put("/api/person/999/criteria/A04")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetSummary_Returns200OK() throws Exception {
        // TC-API-016: GET /api/person/{id}/summary liefert Status 200 OK
        SummaryResponse summary = new SummaryResponse();
        when(summaryService.calculateSummary(1L)).thenReturn(summary);

        mockMvc.perform(get("/api/person/1/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void testGetSummary_ResponseContainsQualityLevels() throws Exception {
        // TC-API-017: Response enthält Gütestufen für alle Kriterien
        SummaryResponse summary = new SummaryResponse();
        summary.setCriteriaSummaries(new java.util.ArrayList<>());
        when(summaryService.calculateSummary(1L)).thenReturn(summary);

        mockMvc.perform(get("/api/person/1/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.criteriaSummaries").isArray());
    }

    @Test
    void testGetSummary_ResponseContainsEstimatedGrades() throws Exception {
        // TC-API-018, TC-API-019: Response enthält mutmassliche Noten für Teil 1 und 2
        SummaryResponse summary = new SummaryResponse();
        summary.setEstimatedGradePart1(5.2);
        summary.setEstimatedGradePart2(4.8);
        when(summaryService.calculateSummary(1L)).thenReturn(summary);

        mockMvc.perform(get("/api/person/1/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estimatedGradePart1").value(5.2))
                .andExpect(jsonPath("$.estimatedGradePart2").value(4.8));
    }

    @Test
    void testGetSummary_PersonNotFound_Returns404() throws Exception {
        // TC-API-020: Fehlerbehandlung bei nicht existierender Person (Status 404)
        when(summaryService.calculateSummary(999L))
                .thenThrow(new RuntimeException("Person nicht gefunden"));

        mockMvc.perform(get("/api/person/999/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
