package ch.bbw.ipa.repository;

import ch.bbw.ipa.model.CriterionProgress;
import ch.bbw.ipa.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CriterionProgressRepository extends JpaRepository<CriterionProgress, Long> {
    Optional<CriterionProgress> findByPersonAndCriterionId(Person person, String criterionId);
}

