package vn.cmc.skillsheet.entity;

import java.io.Serializable;
import java.time.LocalDate;
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
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "candidate")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Candidate implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 8233429813826079008L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "candidate_id", columnDefinition = "int", nullable = false)
    private int candidateId;

    @Column(name = "full_name", columnDefinition = "nvarchar(254)")
    private String fullName;

    @Column(name = "email", columnDefinition = "nvarchar(45)")
    private String email;

    @Column(name = "role_name", columnDefinition = "nvarchar(45)")
    private String roleName;

    @Column(name = "status", columnDefinition = "varchar(45)")
    private String status;
    
    @Column(name = "create_by", columnDefinition = "varchar(254)")
    private String createBy;
    
    @Column(name = "send_date", columnDefinition = "DateTime")
    private Date sendDate;

    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

    @Column(name = "updated_date", columnDefinition = "DateTime")
    private Date updatedDate;

    @Column(name = "link_request", columnDefinition = "varchar(500)")
    private String linkRequest;
    
    @Column(name = "access_token", columnDefinition = "varchar(250)")
    private String accessToken;
    
    @Column(name = "access_code", columnDefinition = "varchar(50)")
    private String accessCode;
    
    @Column(name = "phone", columnDefinition = "varchar(25)")
    private String phone;
    
    @Column(name = "step", columnDefinition = "int")
    private int step;

    //anbq start

    @Column(name = "address", columnDefinition = "varchar(500)")
    private String address;

    @Column(name = "link_cv", columnDefinition = "varchar(500)")
    private String linkCv;

    @Column(name = "channel", columnDefinition = "int(5)")
    private int channel;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Column(name = "apply_since", columnDefinition = "date")
    private Date applySince;

    @Column(name = "introducer", columnDefinition = "varchar(250)")
    private String introducer;

    @Column(name = "location", columnDefinition = "varchar(250)")
    private String location;

    @Column(name = "school", columnDefinition = "varchar(500)")
    private String school;

    @Column(name = "degree", columnDefinition = "varchar(250)")
    private String degree;

    @Column(name = "skill", columnDefinition = "varchar(500)")
    private String skill;

    @Column(name = "language", columnDefinition = "varchar(250)")
    private String language;

    @Column(name = "job", columnDefinition = "varchar(250)")
    private String job;

    @Column(name = "level", columnDefinition = "varchar(50)")
    private String level;

    @Column(name = "experience", columnDefinition = "varchar(50)")
    private String experience;

    @Column(name = "sex", columnDefinition = "varchar(50)")
    private String sex;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Column(name = "birth_day", columnDefinition = "date")
    private Date birthDay;

    @Column(name = "step_rts", columnDefinition = "varchar(50)")
    private String stepRts;

    @Column(name = "assignees", columnDefinition = "varchar(50)")
    private String assignees;

    @Column(name = "job_rts_id", columnDefinition = "varchar(50)")
    private String jobRtsId;

    @Column(name = "remove_job_rts_id", columnDefinition = "varchar(500)")
    private String removeJobRtsIds;

    @Column(name = "password" ,columnDefinition = "varchar(500)")
    private String password;

    @Column(name = "source" ,columnDefinition = "varchar(500)")
    private String source;

    @Column(name = "last_company" ,columnDefinition = "varchar(500)")
    private String lastCompany;

    @Column(name = "candidate_type" ,columnDefinition = "varchar(500)")
    private String candidateType;

    //anbq stop

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "candidate", cascade = CascadeType.ALL)
    private List<Profile> profiles = new ArrayList<Profile>();

//    @JsonIgnore
//    @OneToMany(fetch = FetchType.LAZY, mappedBy = "candidate", cascade = CascadeType.ALL)
//    private List<ChangeHistory> changeHistorys = new ArrayList<ChangeHistory>();
//
    @Override
    public String toString() {
        return "Candidate [candidateId=" + candidateId + ", fullName=" + fullName + ", email="
                + email + ", roleName=" + roleName + ", status=" + status + ", createBy=" + createBy
                + ", sendDate=" + sendDate + ", createdDate=" + createdDate + ", updatedDate="
                + updatedDate + ", linkRequest=" + linkRequest + ", phone = "+ phone + "]";
    }    
}