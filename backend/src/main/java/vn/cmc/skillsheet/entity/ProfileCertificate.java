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
@Table(name = "profile_certificate")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileCertificate implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 3402262641238308670L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_certificate_id", columnDefinition = "int", nullable = false)
    private int profileCertificateId;

    @Column(name = "issued_date", columnDefinition = "DateTime")
    private Date issuedDate;

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
    @JoinColumn(name = "certificate_id", nullable = true)
    private Certificate certificate;

    @Override
    public String toString() {
        return "ProfileCertificate [profileCertificateId=" + profileCertificateId + ", issuedDate="
                + issuedDate + ", achievement=" + achievement + ", createdDate=" + createdDate
                + ", updatedDate=" + updatedDate + ", certificate=" + certificate + "]";
    }

}