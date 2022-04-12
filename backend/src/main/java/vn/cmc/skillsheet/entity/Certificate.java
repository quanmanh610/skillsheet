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
@Table(name = "certificate")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Certificate implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 9153946689530638129L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certificate_id", columnDefinition = "int", nullable = false)
    private int certificateId;

    @Column(name = "category", columnDefinition = "nvarchar(100)")
    private String category;

    @Column(name = "name", columnDefinition = "nvarchar(100)")
    private String name;

    @Column(name = "status", columnDefinition = "int")
    private int status;

    @Column(name = "create_by", columnDefinition = "varchar(500)")
    private String createBy;

    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

    @Column(name = "updated_date", columnDefinition = "DateTime")
    private Date updatedDate;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "certificate", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    private List<ProfileCertificate> profileCertificates = new ArrayList<ProfileCertificate>();
    
    @Override
    public String toString() {
        return "Certificate [certificateId=" + certificateId + ", category="
                + category + ", name=" + name + ", status=" + status + ", createBy=" + createBy
                + ", createdDate=" + createdDate + "]";
    }


}