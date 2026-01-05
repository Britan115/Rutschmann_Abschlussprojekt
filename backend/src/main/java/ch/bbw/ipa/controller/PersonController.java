package ch.bbw.ipa.controller;

import ch.bbw.ipa.model.Person;
import ch.bbw.ipa.service.PersonService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PersonController {

    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
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
}

