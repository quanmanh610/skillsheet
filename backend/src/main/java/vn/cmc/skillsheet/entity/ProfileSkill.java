package vn.cmc.skillsheet.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profile_skill")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileSkill implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -5110209168961429143L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_skill_id", columnDefinition = "int", nullable = false)
    private int profileSkillId;

    @Column(name = "project", columnDefinition = "nvarchar(500)")
    private String project;

    @Column(name = "level", columnDefinition = "nvarchar(30)")
    private String level;

    @Column(name = "year_of_experiences", columnDefinition = "int")
    private int yearOfExperiences;

    @Column(name = "last_used", columnDefinition = "nvarchar(30)")
    private String lastUsed;

    @Column(name = "best_skill", columnDefinition = "BOOLEAN")
    private String bestSkill;

    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

    @Column(name = "updated_date", columnDefinition = "DateTime")
    private Date updatedDate;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "profile_id", nullable = true)
    private Profile profile;

    @ManyToOne(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "skill_id", nullable = true)
    private Skill skill;

    @Override
    public String toString() {
        return "ProfileSkill [profileSkillId=" + profileSkillId + ", project=" + project
                + ", level=" + level + ", yearOfExperiences=" + yearOfExperiences + ", lastUsed="
                + lastUsed + ", bestSkill=" + bestSkill + ", createdDate=" + createdDate
                + ", updatedDate=" + updatedDate + ", skill_id=" + skill.getSkillId() + "]";
    }

}