package vn.cmc.skillsheet.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "profile")
@Data
@EqualsAndHashCode(exclude = "version")
public class Profile implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -3452743388483052734L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id", columnDefinition = "int", nullable = false)
    private int profileId;

    @Column(name = "role_name", columnDefinition = "nvarchar(50)")
    private String roleName;

    @Column(name = "birthday", columnDefinition = "DateTime")
    private Date birthday;

    @Column(name = "phone", columnDefinition = "varchar(20)")
    private String phone;

    @Column(name = "nationality", columnDefinition = "nvarchar(50)")
    private String nationality;

    @Column(name = "email", columnDefinition = "nvarchar(50)")
    private String email;

    @Column(name = "gender", columnDefinition = "varchar(50)")
    private String gender;

    @Column(name = "marital_status", columnDefinition = "nvarchar(50)")
    private String maritalStatus;

    @Column(name = "objective", columnDefinition = "nvarchar(500)")
    private String objective;

    @Column(name = "professional_summary", columnDefinition = "nvarchar(2000)")
    private String professionalSummary;

    @Column(name = "persional_interesting", columnDefinition = "nvarchar(500)")
    private String persionalInteresting;

    @Column(name = "status", columnDefinition = "varchar(50)")
    private String status;
    
    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

    @Column(name = "updated_date", columnDefinition = "DateTime")
    private Date updatedDate;

    @Column(name = "avatar", columnDefinition = "longblob")
    private byte[] avatar;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "profile", cascade = CascadeType.ALL)
    private List<Language> languages = new ArrayList<Language>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "profile", cascade = CascadeType.ALL)
    private List<Project> projects = new ArrayList<Project>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "profile", cascade = CascadeType.ALL)
    private List<WorkExperience> workExperiences = new ArrayList<WorkExperience>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "profile", cascade = CascadeType.ALL)
    private List<Education> educations = new ArrayList<Education>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "profile", cascade = CascadeType.ALL)
    //@OneToMany(fetch = FetchType.LAZY, mappedBy = "profile", cascade = CascadeType.REMOVE)
    private List<ProfileSkill> profileSkills = new ArrayList<ProfileSkill>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "profile", cascade = CascadeType.ALL)
    private List<ProfileCertificate> profileCertificates = new ArrayList<ProfileCertificate>();

    @ManyToOne(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "staff_id", nullable = true)
    private Staff staff;

    @ManyToOne(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "candidate_id", nullable = true)
    private Candidate candidate;

    @OneToOne(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.REMOVE })
    @JoinColumn(name = "version_id", nullable = false)
    private Version version;

    @Override
    public String toString() {
        return "Profile [profileId=" + profileId + ", roleName=" + roleName + ", birthday="
                + birthday + ", phone=" + phone + ", nationality=" + nationality + ", email="
                + email + ", gender=" + gender + ", maritalStatus=" + maritalStatus + ", objective="
                + objective + ", professionalSummary=" + professionalSummary
                + ", persionalInteresting=" + persionalInteresting + ", status=" + status
                + ", createdDate=" + createdDate + ", updatedDate=" + updatedDate + ", languages="
                + languages + ", projects=" + projects + ", workExperiences=" + workExperiences
                + ", educations=" + educations + ", profileSkills=" + profileSkills
                + ", profileCertificates=" + profileCertificates + ", staff=" + staff
                + ", candidate=" + candidate + ", version=" + version + "]";
    }

}