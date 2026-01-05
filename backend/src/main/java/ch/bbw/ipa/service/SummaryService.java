package ch.bbw.ipa.service;

import ch.bbw.ipa.dto.CriterionSummary;
import ch.bbw.ipa.dto.SummaryResponse;
import ch.bbw.ipa.model.Criteria;
import ch.bbw.ipa.model.CriteriaResponse;
import ch.bbw.ipa.model.CriterionProgress;
import ch.bbw.ipa.model.Person;
import ch.bbw.ipa.repository.CriterionProgressRepository;
import ch.bbw.ipa.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class SummaryService {

    private final CriteriaService criteriaService;
    private final CriterionProgressRepository criterionProgressRepository;
    private final PersonRepository personRepository;

    public SummaryService(CriteriaService criteriaService, CriterionProgressRepository criterionProgressRepository, PersonRepository personRepository) {
        this.criteriaService = criteriaService;
        this.criterionProgressRepository = criterionProgressRepository;
        this.personRepository = personRepository;
    }

    public SummaryResponse calculateSummary(Long personId) throws Exception {
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new RuntimeException("Person nicht gefunden"));

        CriteriaResponse criteriaResponse = criteriaService.loadCriteria();
        List<Criteria> allCriteria = criteriaResponse.getCriteria();
        List<CriterionSummary> summaries = new ArrayList<>();

        double sumPart1 = 0.0;
        double sumPart2 = 0.0;
        int countPart1 = 0;
        int countPart2 = 0;

        for (Criteria criterion : allCriteria) {
            Optional<CriterionProgress> progressOpt = criterionProgressRepository.findByPersonAndCriterionId(person, criterion.getId());
            
            Set<String> fulfilledRequirements = progressOpt
                    .map(CriterionProgress::getFulfilledRequirements)
                    .orElse(Set.of());

            int fulfilledCount = fulfilledRequirements.size();
            int totalCount = criterion.getRequirements().size();
            int qualityLevel = calculateQualityLevel(fulfilledCount, totalCount);

            CriterionSummary summary = new CriterionSummary(
                    criterion.getId(),
                    criterion.getTitle(),
                    fulfilledCount,
                    totalCount,
                    qualityLevel
            );
            summaries.add(summary);

            // Bestimme zu welchem Teil das Kriterium gehört (basierend auf requirements)
            int part = determinePart(criterion);
            if (part == 1) {
                sumPart1 += qualityLevel;
                countPart1++;
            } else if (part == 2) {
                sumPart2 += qualityLevel;
                countPart2++;
            }
        }

        // Berechnung der mutmasslichen Note
        // Formel: Durchschnitt der Gütestufen pro Teil, dann in Note umrechnen
        // Note = 4.0 + (Durchschnitt * 0.5) -> Gütestufe 3 = Note 5.5, Gütestufe 0 = Note 4.0
        Double estimatedGradePart1 = countPart1 > 0 ? 4.0 + (sumPart1 / countPart1) * 0.5 : null;
        Double estimatedGradePart2 = countPart2 > 0 ? 4.0 + (sumPart2 / countPart2) * 0.5 : null;

        return new SummaryResponse(summaries, estimatedGradePart1, estimatedGradePart2);
    }

    private int calculateQualityLevel(int fulfilledCount, int totalCount) {
        // Gütestufen-Logik (fix):
        // Alle Anforderungen erfüllt → Gütestufe 3
        // 4-5 Anforderungen erfüllt → Gütestufe 2
        // 2-3 Anforderungen erfüllt → Gütestufe 1
        // Weniger als 2 erfüllt → Gütestufe 0
        
        if (fulfilledCount == totalCount) {
            return 3;
        } else if (fulfilledCount >= 4 && fulfilledCount <= 5) {
            return 2;
        } else if (fulfilledCount >= 2 && fulfilledCount <= 3) {
            return 1;
        } else {
            return 0;
        }
    }

    private int determinePart(Criteria criterion) {
        // Bestimme Teil basierend auf den Requirements
        // Wenn alle Requirements zu Teil 1 gehören -> Teil 1
        // Wenn alle Requirements zu Teil 2 gehören -> Teil 2
        // Sonst: Mehrheit entscheidet
        
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
}

