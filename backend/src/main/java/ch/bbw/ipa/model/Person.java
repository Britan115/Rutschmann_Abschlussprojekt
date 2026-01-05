package ch.bbw.ipa.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "persons")
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String vorname;

    @Column(nullable = false)
    private String thema;

    @Column(nullable = false)
    private LocalDate abgabedatum;

    public Person() {
    }

    public Person(String name, String vorname, String thema, LocalDate abgabedatum) {
        this.name = name;
        this.vorname = vorname;
        this.thema = thema;
        this.abgabedatum = abgabedatum;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVorname() {
        return vorname;
    }

    public void setVorname(String vorname) {
        this.vorname = vorname;
    }

    public String getThema() {
        return thema;
    }

    public void setThema(String thema) {
        this.thema = thema;
    }

    public LocalDate getAbgabedatum() {
        return abgabedatum;
    }

    public void setAbgabedatum(LocalDate abgabedatum) {
        this.abgabedatum = abgabedatum;
    }
}

