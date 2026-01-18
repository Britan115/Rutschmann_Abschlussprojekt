package ch.bbw.ipa.controller;

import ch.bbw.ipa.model.Criteria;
import ch.bbw.ipa.model.CriteriaResponse;
import ch.bbw.ipa.model.QualityLevels;
import ch.bbw.ipa.model.Requirement;
import ch.bbw.ipa.service.CriteriaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration Tests für CriteriaController
 * TC-API-001 bis TC-API-005
 */
@WebMvcTest(CriteriaController.class)
class CriteriaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CriteriaService criteriaService;

    @Test
    void testGetCriteria_Returns200OK() throws Exception {
        // TC-API-001: GET /api/criteria liefert Status 200 OK
        CriteriaResponse response = createTestCriteriaResponse();

        when(criteriaService.loadCriteria()).thenReturn(response);

        mockMvc.perform(get("/api/criteria")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void testGetCriteria_ReturnsAllThreeCriteria() throws Exception {
        // TC-API-002: Response enthält alle 3 Kriterien (A04, H06, Doc03)
        CriteriaResponse response = createTestCriteriaResponse();

        when(criteriaService.loadCriteria()).thenReturn(response);

        mockMvc.perform(get("/api/criteria")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.criteria").isArray())
                .andExpect(jsonPath("$.criteria.length()").value(3))
                .andExpect(jsonPath("$.criteria[0].id").value("A04"))
                .andExpect(jsonPath("$.criteria[1].id").value("H06"))
                .andExpect(jsonPath("$.criteria[2].id").value("Doc03"));
    }

    @Test
    void testGetCriteria_EachCriterionContainsRequiredFields() throws Exception {
        // TC-API-003: Jedes Kriterium enthält id, title, question, requirements, qualityLevels
        CriteriaResponse response = createTestCriteriaResponse();

        when(criteriaService.loadCriteria()).thenReturn(response);

        mockMvc.perform(get("/api/criteria")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.criteria[0].id").exists())
                .andExpect(jsonPath("$.criteria[0].title").exists())
                .andExpect(jsonPath("$.criteria[0].question").exists())
                .andExpect(jsonPath("$.criteria[0].requirements").isArray())
                .andExpect(jsonPath("$.criteria[0].qualityLevels").exists());
    }

    @Test
    void testGetCriteria_EachRequirementContainsRequiredFields() throws Exception {
        // TC-API-004: Jede Requirement enthält id, description, module, part
        CriteriaResponse response = createTestCriteriaResponse();

        when(criteriaService.loadCriteria()).thenReturn(response);

        mockMvc.perform(get("/api/criteria")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.criteria[0].requirements[0].id").exists())
                .andExpect(jsonPath("$.criteria[0].requirements[0].description").exists())
                .andExpect(jsonPath("$.criteria[0].requirements[0].module").exists())
                .andExpect(jsonPath("$.criteria[0].requirements[0].part").exists());
    }

    @Test
    void testGetCriteria_ErrorHandling_Returns500() throws Exception {
        // TC-API-005: Fehlerbehandlung bei fehlender criteria.json (Status 500)
        when(criteriaService.loadCriteria()).thenThrow(new RuntimeException("Datei nicht gefunden"));

        mockMvc.perform(get("/api/criteria")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());
    }

    private CriteriaResponse createTestCriteriaResponse() {
        CriteriaResponse response = new CriteriaResponse();

        // Kriterium A04
        Criteria a04 = new Criteria();
        a04.setId("A04");
        a04.setTitle("Zeitplan");
        a04.setQuestion("Was sind die Anforderungen an den Zeitplan?");

        Requirement req1 = new Requirement();
        req1.setId("A04-1");
        req1.setDescription("Der Zeitplan ist Bestandteil von Teil 1 des IPA-Berichts.");
        req1.setModule("BF");
        req1.setPart(1);

        a04.setRequirements(Arrays.asList(req1));

        QualityLevels qualityLevels = new QualityLevels();
        qualityLevels.setLevel0("Weniger als 2 Anforderungen erfüllt");
        qualityLevels.setLevel1("2-3 Anforderungen erfüllt");
        qualityLevels.setLevel2("4-5 Anforderungen erfüllt");
        qualityLevels.setLevel3("Alle Anforderungen erfüllt");
        a04.setQualityLevels(qualityLevels);

        // Kriterium H06
        Criteria h06 = new Criteria();
        h06.setId("H06");
        h06.setTitle("Automatisierung des Auslieferungsprozesses");
        h06.setQuestion("Wie wird der Auslieferungsprozess automatisiert?");
        h06.setRequirements(Arrays.asList());
        h06.setQualityLevels(qualityLevels);

        // Kriterium Doc03
        Criteria doc03 = new Criteria();
        doc03.setId("Doc03");
        doc03.setTitle("Formale Anforderungen an den IPA-Bericht");
        doc03.setQuestion("Welche formalen Anforderungen müssen an den IPA-Bericht erfüllt sein?");
        doc03.setRequirements(Arrays.asList());
        doc03.setQualityLevels(qualityLevels);

        response.setCriteria(Arrays.asList(a04, h06, doc03));
        return response;
    }
}
