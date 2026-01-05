package ch.bbw.ipa.service;

import ch.bbw.ipa.dto.CriterionProgressRequest;
import ch.bbw.ipa.model.CriterionProgress;
import ch.bbw.ipa.model.Person;
import ch.bbw.ipa.repository.CriterionProgressRepository;
import ch.bbw.ipa.repository.PersonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CriterionProgressService {

    private final CriterionProgressRepository criterionProgressRepository;
    private final PersonRepository personRepository;

    public CriterionProgressService(CriterionProgressRepository criterionProgressRepository, PersonRepository personRepository) {
        this.criterionProgressRepository = criterionProgressRepository;
        this.personRepository = personRepository;
    }

    @Transactional
    public CriterionProgress saveOrUpdateProgress(Long personId, String criterionId, CriterionProgressRequest request) {
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new RuntimeException("Person nicht gefunden"));

        Optional<CriterionProgress> existingProgress = criterionProgressRepository.findByPersonAndCriterionId(person, criterionId);

        if (existingProgress.isPresent()) {
            CriterionProgress progress = existingProgress.get();
            progress.setFulfilledRequirements(request.getFulfilledRequirements());
            progress.setNotes(request.getNotes());
            return criterionProgressRepository.save(progress);
        } else {
            CriterionProgress newProgress = new CriterionProgress(
                    person,
                    criterionId,
                    request.getFulfilledRequirements(),
                    request.getNotes()
            );
            return criterionProgressRepository.save(newProgress);
        }
    }
}

