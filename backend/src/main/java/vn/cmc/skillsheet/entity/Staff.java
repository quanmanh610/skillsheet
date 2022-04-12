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
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "staff")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Staff implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -7729046941299921658L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staff_id", columnDefinition = "int", nullable = false)
    private int staffId;

    @Column(name = "user_name", columnDefinition = "nvarchar(45)")
    private String userName;

    @Column(name = "full_name", columnDefinition = "nvarchar(254)")
    private String fullName;

    @Column(name = "email", columnDefinition = "nvarchar(45)")
    private String email;
    
    @Column(name = "du", columnDefinition = "varchar(50)")
    private String du;
    
    @Column(name = "staff_group", columnDefinition = "varchar(50)")
    private String staffGroup;

    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

    @Column(name = "updated_date", columnDefinition = "DateTime")
    private Date updatedDate;
    
    @Column(name = "roles", columnDefinition = "varchar(200)")
    private String roles;
        
    @Column(name = "token", columnDefinition = "varchar(200)")
    private String token;

    @Column(name = "login_count")
    private int loginCount;
    
    @Column(name = "download_count_today")
    private int downloadCountToday;
    
    @Column(name = "latest_download_day")
    private Date latestDownloadDay;
    
    @Column(name = "total_download")
    private int totalDownload;
    
    @Column(name = "available_time")
    private Date availableTime;
    
    @Column(name = "booked_project")
    private String bookedProject;
    
    @Column(name = "booked_from")
    private Date bookedFrom;
    
    @Column(name = "booked_to")
    private Date bookedTo;
    
    @Column(name = "is_du_lead")
    private int isDuLead;
    
    @Column(name = "is_group_lead")
    private int isGroupLead;
    
    @Column(name = "ldap_status", columnDefinition = "bit(1)")
    private Boolean ldapStatus; 
    
    @Column(name = "start_date")
    private Date startDate;
    
    @Column(name = "end_date")
    private Date endDate;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "staff", cascade = CascadeType.ALL)
    private List<Profile> profiles = new ArrayList<Profile>();

//    @JsonIgnore
//    @OneToMany(fetch = FetchType.LAZY, mappedBy = "staff", cascade = CascadeType.ALL)
//    private List<ChangeHistory> changeHistorys = new ArrayList<ChangeHistory>();    
    
    @Override
    public String toString() {
        return "Staff [staffId=" + staffId + ", userName=" + userName + ", fullName=" + fullName
                + ", email=" + email + ", createdDate=" + createdDate + ", updatedDate="
                + updatedDate + "]";
    }
}