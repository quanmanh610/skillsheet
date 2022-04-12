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
import vn.cmc.skillsheet.util.SettingItemStatus;

@Entity
@Table(name = "skill")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Skill implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 5525198654420598504L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skill_id", columnDefinition = "int", nullable = false)
    private int skillId;

    @Column(name = "category", columnDefinition = "nvarchar(100)")
    private String category;

    @Column(name = "name", columnDefinition = "nvarchar(100)")
    private String name;

    @Column(name = "status", columnDefinition = "int")
    private int status = SettingItemStatus.INACTIVE.value;

    @Column(name = "create_by", columnDefinition = "varchar(500)")
    private String createBy;

    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

    @Column(name = "updated_date", columnDefinition = "DateTime")
    private Date updatedDate;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "skill", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    private List<ProfileSkill> profileSkills = new ArrayList<ProfileSkill>();

    @Override
    public String toString() {
        return "Skill [skillId=" + skillId + ", category=" + category + ", name=" + name
                + ", status=" + status + ", createBy=" + createBy + ", createdDate=" + createdDate
                + ", updatedDate=" + updatedDate + "]";
    }

}