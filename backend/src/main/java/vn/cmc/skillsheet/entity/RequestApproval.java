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

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "request_approval")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestApproval implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -3875582100750954283L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_approval_id", columnDefinition = "int", nullable = false)
    private int requestApprovalId;

    @Column(name = "full_name", columnDefinition = "nvarchar(100)")
    private String fullName;

    @Column(name = "email", columnDefinition = "nvarchar(50)")
    private String email;
    
    @Column(name = "pic_email", columnDefinition = "nvarchar(50)")
    private String picEmail;

    @Column(name = "role_name", columnDefinition = "nvarchar(50)")
    private String roleName;

    @Column(name = "ra_group", columnDefinition = "nvarchar(50)")
    private String group;

    @Column(name = "du", columnDefinition = "nvarchar(50)")
    private String du;

    @Column(name = "status", columnDefinition = "varchar(50)")
    private String status;

    @Column(name = "submitted_date", columnDefinition = "DateTime")
    private Date submittedDate;

    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

    @Column(name = "updated_date", columnDefinition = "DateTime")
    private Date updatedDate;
    
    @Column(name = "user_name", columnDefinition = "varchar(45)")
    private String userName;
    
    @Column(name = "comment", columnDefinition = "varchar(500)")
    private String comment;

    @ManyToOne(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "version_id", nullable = true)
    private Version version;

    @Override
    public String toString() {
        return "RequestApproval [requestApprovalId=" + requestApprovalId + ", fullName=" + fullName
                + ", email=" + email + ", roleName=" + roleName + ", group=" + group + ", du=" + du
                + ", status=" + status + ", submittedDate=" + submittedDate + ", createdDate="
                + createdDate + ", updatedDate=" + updatedDate + ", account=" + userName + "]";
    }

}