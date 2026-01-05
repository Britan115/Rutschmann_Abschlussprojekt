package ch.bbw.ipa.dto;

import java.util.List;

public class SummaryResponse {
    private List<CriterionSummary> criteriaSummaries;
    private Double estimatedGradePart1;
    private Double estimatedGradePart2;

    public SummaryResponse() {
    }

    public SummaryResponse(List<CriterionSummary> criteriaSummaries, Double estimatedGradePart1, Double estimatedGradePart2) {
        this.criteriaSummaries = criteriaSummaries;
        this.estimatedGradePart1 = estimatedGradePart1;
        this.estimatedGradePart2 = estimatedGradePart2;
    }

    public List<CriterionSummary> getCriteriaSummaries() {
        return criteriaSummaries;
    }

    public void setCriteriaSummaries(List<CriterionSummary> criteriaSummaries) {
        this.criteriaSummaries = criteriaSummaries;
    }

    public Double getEstimatedGradePart1() {
        return estimatedGradePart1;
    }

    public void setEstimatedGradePart1(Double estimatedGradePart1) {
        this.estimatedGradePart1 = estimatedGradePart1;
    }

    public Double getEstimatedGradePart2() {
        return estimatedGradePart2;
    }

    public void setEstimatedGradePart2(Double estimatedGradePart2) {
        this.estimatedGradePart2 = estimatedGradePart2;
    }
}

