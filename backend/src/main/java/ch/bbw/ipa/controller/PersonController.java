package ch.bbw.ipa.controller;

import ch.bbw.ipa.dto.CriterionProgressRequest;
import ch.bbw.ipa.dto.SummaryResponse;
import ch.bbw.ipa.model.CriterionProgress;
import ch.bbw.ipa.model.Person;
import ch.bbw.ipa.service.CriterionProgressService;
import ch.bbw.ipa.service.PersonService;
import ch.bbw.ipa.service.SummaryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PersonController {

    private final PersonService personService;
    private final CriterionProgressService criterionProgressService;
    private final SummaryService summaryService;

    public PersonController(PersonService personService, CriterionProgressService criterionProgressService, SummaryService summaryService) {
        this.personService = personService;
        this.criterionProgressService = criterionProgressService;
        this.summaryService = summaryService;
    }

    @PostMapping("/person")
    public ResponseEntity<Person> createPerson(@RequestBody Person person) {
        try {
            Person savedPerson = personService.savePerson(person);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPerson);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/person/{id}/criteria/{criterionId}")
    public ResponseEntity<CriterionProgress> updateCriterionProgress(
            @PathVariable Long id,
            @PathVariable String criterionId,
            @RequestBody CriterionProgressRequest request) {
        try {
            CriterionProgress progress = criterionProgressService.saveOrUpdateProgress(id, criterionId, request);
            return ResponseEntity.ok(progress);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/person/{id}/summary")
    public ResponseEntity<SummaryResponse> getSummary(@PathVariable Long id) {
        try {
            SummaryResponse summary = summaryService.calculateSummary(id);
            return ResponseEntity.ok(summary);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}

