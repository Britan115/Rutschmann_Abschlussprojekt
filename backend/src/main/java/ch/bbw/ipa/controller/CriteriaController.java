package ch.bbw.ipa.controller;

import ch.bbw.ipa.model.CriteriaResponse;
import ch.bbw.ipa.service.CriteriaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CriteriaController {

    private final CriteriaService criteriaService;

    public CriteriaController(CriteriaService criteriaService) {
        this.criteriaService = criteriaService;
    }

    @GetMapping("/criteria")
    public ResponseEntity<CriteriaResponse> getCriteria() {
        try {
            CriteriaResponse response = criteriaService.loadCriteria();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}

