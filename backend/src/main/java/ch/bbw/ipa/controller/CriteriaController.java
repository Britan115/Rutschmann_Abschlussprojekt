package ch.bbw.ipa.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CriteriaController {

    @GetMapping("/criteria")
    public String getCriteria() {
        // TODO: Implementierung folgt
        return "Criteria endpoint - in Arbeit";
    }
}

