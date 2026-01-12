package ch.bbw.ipa.repository;

import ch.bbw.ipa.model.CriterionProgress;
import ch.bbw.ipa.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CriterionProgressRepository extends JpaRepository<CriterionProgress, Long> {
    Optional<CriterionProgress> findByPersonAndCriterionId(Person person, String criterionId);
    
    @Query(value = "SELECT fr.requirement_id FROM criterion_progress cp JOIN fulfilled_requirements fr ON cp.id = fr.progress_id WHERE cp.person_id = :personId AND cp.criterion_id = :criterionId", nativeQuery = true)
    List<String> findFulfilledRequirementsByPersonAndCriterionId(@Param("personId") Long personId, @Param("criterionId") String criterionId);
}
