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
@Table(name = "project_role")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectRole implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 678084067819550828L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_role_id", columnDefinition = "int", nullable = false)
    private int projectRoleId;

    @Column(name = "name", columnDefinition = "nvarchar(50)")
    private String name;

    @Column(name = "status", columnDefinition = "int")
    private int status;

    @Column(name = "create_by", columnDefinition = "varchar(50)")
    private String createBy;

    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

    @Column(name = "updated_date", columnDefinition = "DateTime")
    private Date updatedDate;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "profile", cascade = CascadeType.ALL)
    private List<Project> project = new ArrayList<Project>();

    @Override
    public String toString() {
        return "ProjectRole [projectRoleId=" + projectRoleId + ", name=" + name + ", status="
                + status + "]";
    }


}