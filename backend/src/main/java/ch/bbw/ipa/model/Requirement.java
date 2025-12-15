package ch.bbw.ipa.model;

public class Requirement {
    private String id;
    private String description;
    private String module;
    private int part;

    public Requirement() {
    }

    public Requirement(String id, String description, String module, int part) {
        this.id = id;
        this.description = description;
        this.module = module;
        this.part = part;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public int getPart() {
        return part;
    }

    public void setPart(int part) {
        this.part = part;
    }
}

