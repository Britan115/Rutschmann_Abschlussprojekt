package ch.bbw.ipa.dto;

import java.util.Set;

public class CriterionProgressRequest {
    private Set<String> fulfilledRequirements;
    private String notes;

    public CriterionProgressRequest() {
    }

    public CriterionProgressRequest(Set<String> fulfilledRequirements, String notes) {
        this.fulfilledRequirements = fulfilledRequirements;
        this.notes = notes;
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

