package ch.bbw.ipa.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "criterion_progress")
public class CriterionProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @Column(nullable = false)
    private String criterionId;

    @ElementCollection
    @CollectionTable(name = "fulfilled_requirements", joinColumns = @JoinColumn(name = "progress_id"))
    @Column(name = "requirement_id")
    private Set<String> fulfilledRequirements;

    @Column(length = 1000)
    private String notes;

    public CriterionProgress() {
    }

    public CriterionProgress(Person person, String criterionId, Set<String> fulfilledRequirements, String notes) {
        this.person = person;
        this.criterionId = criterionId;
        this.fulfilledRequirements = fulfilledRequirements;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public String getCriterionId() {
        return criterionId;
    }

    public void setCriterionId(String criterionId) {
        this.criterionId = criterionId;
    }

    public Set<String> getFulfilledRequirements() {
        return fulfilledRequirements;
    }

    public void setFulfilledRequirements(Set<String> fulfilledRequirements) {
        this.fulfilledRequirements = fulfilledRequirements;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

