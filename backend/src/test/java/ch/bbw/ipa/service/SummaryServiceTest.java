package ch.bbw.ipa.service;

import ch.bbw.ipa.dto.SummaryResponse;
import ch.bbw.ipa.model.Criteria;
import ch.bbw.ipa.model.CriteriaResponse;
import ch.bbw.ipa.model.CriterionProgress;
import ch.bbw.ipa.model.Person;
import ch.bbw.ipa.model.Requirement;
import ch.bbw.ipa.repository.CriterionProgressRepository;
import ch.bbw.ipa.repository.PersonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit Tests für SummaryService
 * TC-UNIT-001 bis TC-UNIT-007
 */
@ExtendWith(MockitoExtension.class)
class SummaryServiceTest {

    @Mock
    private CriteriaService criteriaService;

    @Mock
    private CriterionProgressRepository criterionProgressRepository;

    @Mock
    private PersonRepository personRepository;

    @InjectMocks
    private SummaryService summaryService;

    private Person testPerson;
    private Criteria testCriterion;

    @BeforeEach
    void setUp() {
        testPerson = new Person();
        testPerson.setId(1L);
        testPerson.setName("Muster");
        testPerson.setVorname("Max");

        testCriterion = new Criteria();
        testCriterion.setId("A04");
        testCriterion.setTitle("Zeitplan");

        Requirement req1 = new Requirement();
        req1.setId("A04-1");
        req1.setPart(1);
        Requirement req2 = new Requirement();
        req2.setId("A04-2");
        req2.setPart(1);
        Requirement req3 = new Requirement();
        req3.setId("A04-3");
        req3.setPart(1);
        Requirement req4 = new Requirement();
        req4.setId("A04-4");
        req4.setPart(1);
        Requirement req5 = new Requirement();
        req5.setId("A04-5");
        req5.setPart(1);
        Requirement req6 = new Requirement();
        req6.setId("A04-6");
        req6.setPart(1);

        testCriterion.setRequirements(Arrays.asList(req1, req2, req3, req4, req5, req6));
    }

    @Test
    void testCalculateQualityLevel_AllFulfilled_Returns3() throws Exception {
        // TC-UNIT-001: Gütestufe 3 bei allen Anforderungen erfüllt
        CriteriaResponse criteriaResponse = new CriteriaResponse();
        criteriaResponse.setCriteria(Arrays.asList(testCriterion));

        CriterionProgress progress = new CriterionProgress();
        progress.setPerson(testPerson);
        progress.setCriterionId("A04");
        progress.setFulfilledRequirements(Set.of("A04-1", "A04-2", "A04-3", "A04-4", "A04-5", "A04-6"));

        when(personRepository.findById(1L)).thenReturn(Optional.of(testPerson));
        when(criteriaService.loadCriteria()).thenReturn(criteriaResponse);
        when(criterionProgressRepository.findByPersonAndCriterionId(testPerson, "A04"))
                .thenReturn(Optional.of(progress));

        SummaryResponse response = summaryService.calculateSummary(1L);

        assertNotNull(response);
        assertEquals(1, response.getCriteriaSummaries().size());
        assertEquals(3, response.getCriteriaSummaries().get(0).getQualityLevel());
    }

    @Test
    void testCalculateQualityLevel_FourFulfilled_Returns2() throws Exception {
        // TC-UNIT-002: Gütestufe 2 bei 4-5 Anforderungen erfüllt
        CriteriaResponse criteriaResponse = new CriteriaResponse();
        criteriaResponse.setCriteria(Arrays.asList(testCriterion));

        CriterionProgress progress = new CriterionProgress();
        progress.setPerson(testPerson);
        progress.setCriterionId("A04");
        progress.setFulfilledRequirements(Set.of("A04-1", "A04-2", "A04-3", "A04-4"));

        when(personRepository.findById(1L)).thenReturn(Optional.of(testPerson));
        when(criteriaService.loadCriteria()).thenReturn(criteriaResponse);
        when(criterionProgressRepository.findByPersonAndCriterionId(testPerson, "A04"))
                .thenReturn(Optional.of(progress));

        SummaryResponse response = summaryService.calculateSummary(1L);

        assertNotNull(response);
        assertEquals(2, response.getCriteriaSummaries().get(0).getQualityLevel());
    }

    @Test
    void testCalculateQualityLevel_TwoThreeFulfilled_Returns1() throws Exception {
        // TC-UNIT-003: Gütestufe 1 bei 2-3 Anforderungen erfüllt
        CriteriaResponse criteriaResponse = new CriteriaResponse();
        criteriaResponse.setCriteria(Arrays.asList(testCriterion));

        CriterionProgress progress = new CriterionProgress();
        progress.setPerson(testPerson);
        progress.setCriterionId("A04");
        progress.setFulfilledRequirements(Set.of("A04-1", "A04-2"));

        when(personRepository.findById(1L)).thenReturn(Optional.of(testPerson));
        when(criteriaService.loadCriteria()).thenReturn(criteriaResponse);
        when(criterionProgressRepository.findByPersonAndCriterionId(testPerson, "A04"))
                .thenReturn(Optional.of(progress));

        SummaryResponse response = summaryService.calculateSummary(1L);

        assertNotNull(response);
        assertEquals(1, response.getCriteriaSummaries().get(0).getQualityLevel());
    }

    @Test
    void testCalculateQualityLevel_LessThanTwoFulfilled_Returns0() throws Exception {
        // TC-UNIT-004: Gütestufe 0 bei weniger als 2 Anforderungen erfüllt
        CriteriaResponse criteriaResponse = new CriteriaResponse();
        criteriaResponse.setCriteria(Arrays.asList(testCriterion));

        CriterionProgress progress = new CriterionProgress();
        progress.setPerson(testPerson);
        progress.setCriterionId("A04");
        progress.setFulfilledRequirements(Set.of("A04-1"));

        when(personRepository.findById(1L)).thenReturn(Optional.of(testPerson));
        when(criteriaService.loadCriteria()).thenReturn(criteriaResponse);
        when(criterionProgressRepository.findByPersonAndCriterionId(testPerson, "A04"))
                .thenReturn(Optional.of(progress));

        SummaryResponse response = summaryService.calculateSummary(1L);

        assertNotNull(response);
        assertEquals(0, response.getCriteriaSummaries().get(0).getQualityLevel());
    }

    @Test
    void testDeterminePart_AllPart1_Returns1() throws Exception {
        // TC-UNIT-005: Ordnet Kriterium korrekt Teil 1 zu
        CriteriaResponse criteriaResponse = new CriteriaResponse();
        criteriaResponse.setCriteria(Arrays.asList(testCriterion));

        when(personRepository.findById(1L)).thenReturn(Optional.of(testPerson));
        when(criteriaService.loadCriteria()).thenReturn(criteriaResponse);
        when(criterionProgressRepository.findByPersonAndCriterionId(any(), any()))
                .thenReturn(Optional.empty());

        SummaryResponse response = summaryService.calculateSummary(1L);

        assertNotNull(response);
        assertEquals(1, response.getCriteriaSummaries().size());
        // Kriterium mit allen Requirements part=1 sollte zu Teil 1 gehören
        assertNotNull(response.getEstimatedGradePart1());
    }

    @Test
    void testCalculateSummary_QualityLevel3_CalculatesGrade6_0() throws Exception {
        // TC-UNIT-006: Notenberechnung Gütestufe 3 → Note 6.0
        CriteriaResponse criteriaResponse = new CriteriaResponse();
        criteriaResponse.setCriteria(Arrays.asList(testCriterion));

        CriterionProgress progress = new CriterionProgress();
        progress.setPerson(testPerson);
        progress.setCriterionId("A04");
        progress.setFulfilledRequirements(Set.of("A04-1", "A04-2", "A04-3", "A04-4", "A04-5", "A04-6"));

        when(personRepository.findById(1L)).thenReturn(Optional.of(testPerson));
        when(criteriaService.loadCriteria()).thenReturn(criteriaResponse);
        when(criterionProgressRepository.findByPersonAndCriterionId(testPerson, "A04"))
                .thenReturn(Optional.of(progress));

        SummaryResponse response = summaryService.calculateSummary(1L);

        assertNotNull(response);
        assertNotNull(response.getEstimatedGradePart1());
        // Gütestufe 3 → Note = 3.0 + (3.0 * 1.0) = 6.0
        assertEquals(6.0, response.getEstimatedGradePart1(), 0.01);
    }

    @Test
    void testCalculateSummary_QualityLevel0_CalculatesGrade3_0() throws Exception {
        // TC-UNIT-007: Notenberechnung Gütestufe 0 → Note 3.0
        CriteriaResponse criteriaResponse = new CriteriaResponse();
        criteriaResponse.setCriteria(Arrays.asList(testCriterion));

        CriterionProgress progress = new CriterionProgress();
        progress.setPerson(testPerson);
        progress.setCriterionId("A04");
        progress.setFulfilledRequirements(Set.of()); // Keine Anforderungen erfüllt

        when(personRepository.findById(1L)).thenReturn(Optional.of(testPerson));
        when(criteriaService.loadCriteria()).thenReturn(criteriaResponse);
        when(criterionProgressRepository.findByPersonAndCriterionId(testPerson, "A04"))
                .thenReturn(Optional.of(progress));

        SummaryResponse response = summaryService.calculateSummary(1L);

        assertNotNull(response);
        assertNotNull(response.getEstimatedGradePart1());
        // Gütestufe 0 → Note = 3.0 + (0.0 * 1.0) = 3.0
        assertEquals(3.0, response.getEstimatedGradePart1(), 0.01);
    }
}
