package ch.bbw.ipa.dto;

public class CriterionSummary {
    private String criterionId;
    private String criterionTitle;
    private int fulfilledCount;
    private int totalCount;
    private int qualityLevel;

    public CriterionSummary() {
    }

    public CriterionSummary(String criterionId, String criterionTitle, int fulfilledCount, int totalCount, int qualityLevel) {
        this.criterionId = criterionId;
        this.criterionTitle = criterionTitle;
        this.fulfilledCount = fulfilledCount;
        this.totalCount = totalCount;
        this.qualityLevel = qualityLevel;
    }

    public String getCriterionId() {
        return criterionId;
    }

    public void setCriterionId(String criterionId) {
        this.criterionId = criterionId;
    }

    public String getCriterionTitle() {
        return criterionTitle;
    }

    public void setCriterionTitle(String criterionTitle) {
        this.criterionTitle = criterionTitle;
    }

    public int getFulfilledCount() {
        return fulfilledCount;
    }

    public void setFulfilledCount(int fulfilledCount) {
        this.fulfilledCount = fulfilledCount;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public int getQualityLevel() {
        return qualityLevel;
    }

    public void setQualityLevel(int qualityLevel) {
        this.qualityLevel = qualityLevel;
    }
}

