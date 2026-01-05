package ch.bbw.ipa.model;

import java.util.List;

public class Criteria {
    private String id;
    private String title;
    private String question;
    private List<Requirement> requirements;
    private QualityLevels qualityLevels;

    public Criteria() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<Requirement> getRequirements() {
        return requirements;
    }

    public void setRequirements(List<Requirement> requirements) {
        this.requirements = requirements;
    }

    public QualityLevels getQualityLevels() {
        return qualityLevels;
    }

    public void setQualityLevels(QualityLevels qualityLevels) {
        this.qualityLevels = qualityLevels;
    }
}

