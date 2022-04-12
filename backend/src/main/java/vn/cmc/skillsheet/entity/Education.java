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
@Table(name = "education")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Education implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -7602432544462299701L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "education_id", columnDefinition = "int", nullable = false)
    private int educationId;

    @Column(name = "from_month", columnDefinition = "varchar(50)")
    private String fromMonth;

    @Column(name = "to_month", columnDefinition = "varchar(50)")
    private String toMonth;

    @Column(name = "grade", columnDefinition = "nvarchar(100)")
    private String grade;
    
    @Column(name = "subject", columnDefinition = "nvarchar(200)")
    private String subject;

    @Column(name = "qualification", columnDefinition = "nvarchar(200)")
    private String qualification;

    @Column(name = "achievement", columnDefinition = "nvarchar(2000)")
    private String achievement;

    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

    @Column(name = "updated_date", columnDefinition = "DateTime")
    private Date updatedDate;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "profile_id", nullable = true)
    private Profile profile;

    @ManyToOne(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "school_id", nullable = true)
    private School school;

    @Override
    public String toString() {
        return "Education [educationId=" + educationId + ", fromMonth=" + fromMonth + ", toMonth="
                + toMonth + ", grade=" + grade + ", subject=" + subject + ", qualification="
                + qualification + ", achievement=" + achievement + ", createdDate=" + createdDate
                + ", updatedDate=" + updatedDate + ", school=" + school + "]";
    }
    
    

}