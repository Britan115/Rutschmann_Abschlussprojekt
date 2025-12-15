package ch.bbw.ipa.model;

import java.util.List;

public class CriteriaResponse {
    private List<Criteria> criteria;

    public CriteriaResponse() {
    }

    public CriteriaResponse(List<Criteria> criteria) {
        this.criteria = criteria;
    }

    public List<Criteria> getCriteria() {
        return criteria;
    }

    public void setCriteria(List<Criteria> criteria) {
        this.criteria = criteria;
    }
}

