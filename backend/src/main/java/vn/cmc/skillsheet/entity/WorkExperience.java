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
@Table(name = "work_experience")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkExperience implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -5045531138374524233L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "work_experience_id", columnDefinition = "int", nullable = false)
    private int workExperienceId;

    @Column(name = "position", columnDefinition = "nvarchar(100)")
    private String position;

    @Column(name = "from_month", columnDefinition = "varchar(50)")
    private String fromMonth;

    @Column(name = "to_month", columnDefinition = "varchar(50)")
    private String toMonth;
    
    @Column(name = "now", columnDefinition = "boolean")
    private boolean isNow;

    @Column(name = "description", columnDefinition = "nvarchar(2000)")
    private String description;

    @Column(name = "company", columnDefinition = "nvarchar(100)")
    private String company;

    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

    @Column(name = "updated_date", columnDefinition = "DateTime")
    private Date updatedDate;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "profile_id", nullable = true)
    private Profile profile;

    @Override
    public String toString() {
        return "WorkExperience [workExperienceId=" + workExperienceId + ", position=" + position
                + ", fromMonth=" + fromMonth + ", toMonth=" + toMonth + ", now=" + isNow + ", description="
                + description + ", company=" + company + ", createdDate=" + createdDate
                + ", updatedDate=" + updatedDate + "]";
    }
    
    

}