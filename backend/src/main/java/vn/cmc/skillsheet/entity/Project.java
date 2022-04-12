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
@Table(name = "project")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Project implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -3423002202033573487L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id", columnDefinition = "int", nullable = false)
    private int projectId;

    @Column(name = "title", columnDefinition = "nvarchar(100)")
    private String title;

    @Column(name = "client", columnDefinition = "nvarchar(100)")
    private String client;

    @Column(name = "from_month", columnDefinition = "varchar(50)")
    private String fromMonth;

    @Column(name = "to_month", columnDefinition = "varchar(50)")
    private String toMonth;

    @Column(name = "team_size", columnDefinition = "varchar(50)")
    private String teamSize;

    @Column(name = "description", columnDefinition = "nvarchar(500)")
    private String description;

    @Column(name = "responsibilities", columnDefinition = "nvarchar(1000)")
    private String responsibilities;

    @Column(name = "array_skill_names", columnDefinition = "JSON")
    private String arraySkillNames;

    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

    @Column(name = "updated_date", columnDefinition = "DateTime")
    private Date updatedDate;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "profile_id", nullable = true)
    private Profile profile;

    @ManyToOne(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "project_role_id", nullable = true)
    private ProjectRole projectRole;

    @Override
    public String toString() {
        return "Project [projectId=" + projectId + ", title=" + title + ", client=" + client
                + ", fromMonth=" + fromMonth + ", toMonth=" + toMonth + ", teamSize=" + teamSize
                + ", description=" + description + ", responsibilities=" + responsibilities
                + ", arraySkillNames=" + arraySkillNames + ", createdDate=" + createdDate
                + ", updatedDate=" + updatedDate + ", projectRole=" + projectRole + "]";
    }
    

}