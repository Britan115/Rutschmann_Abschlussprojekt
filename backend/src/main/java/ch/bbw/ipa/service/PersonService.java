package ch.bbw.ipa.service;

import ch.bbw.ipa.model.Person;
import ch.bbw.ipa.repository.PersonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PersonService {

    private final PersonRepository personRepository;

    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @Transactional
    public Person savePerson(Person person) {
        return personRepository.save(person);
    }
}

