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
@Table(name = "school")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class School implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -2240866839860852053L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "school_id", columnDefinition = "int", nullable = false)
    private int schoolId;

    @Column(name = "category", columnDefinition = "nvarchar(100)")
    private String category;

    @Column(name = "name", columnDefinition = "nvarchar(200)")
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
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "school", cascade = CascadeType.ALL)
    private List<Education> educations = new ArrayList<Education>();
    
    @Override
    public String toString() {
        return "School [schoolId=" + schoolId + ", category="
                + category + ", name=" + name + ", status=" + status + ", createBy=" + createBy
                + ", createdDate=" + createdDate + "]";
    }

}