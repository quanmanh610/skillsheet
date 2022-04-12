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
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "version")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Version implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 6623943102826122574L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "version_id", columnDefinition = "int", nullable = false)
    private int versionId;

    @Column(name = "version_name", columnDefinition = "nvarchar(254)")
    private String versionName;

    @Column(name = "version_type", columnDefinition = "nvarchar(50) default 'Temporary'")
    private String versionType = "Temporary";

    @Column(name = "original_version", columnDefinition = "nvarchar(254)")
    private String originalVersion;

    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

    @Column(name = "updated_date", columnDefinition = "DateTime")
    private Date updatedDate;

    @JsonIgnore
    @OneToOne(fetch = FetchType.EAGER, mappedBy = "version", cascade = { CascadeType.REMOVE })
    private Profile profile;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "version", cascade = CascadeType.ALL)
    private List<RequestApproval> requestApprovals = new ArrayList<RequestApproval>();

    @Override
    public String toString() {
        return "Version [versionId=" + versionId + ", versionName=" + versionName + ", versionType="
                + versionType + ", originalVersion=" + originalVersion + ", createdDate="
                + createdDate + ", updatedDate=" + updatedDate + ", requestApprovals="
                + requestApprovals + "]";
    }

    
}