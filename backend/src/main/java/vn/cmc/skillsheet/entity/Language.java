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
@Table(name = "language")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Language implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 5833958132754372049L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "language_id", columnDefinition = "int", nullable = false)
    private int languageId;

    @Column(name = "name", columnDefinition = "nvarchar(30)")
    private String name;

    @Column(name = "level", columnDefinition = "nvarchar(20)")
    private String level;

    @Column(name = "note", columnDefinition = "nvarchar(2000)")
    private String note;

    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

    @Column(name = "updated_date", columnDefinition = "DateTime")
    private Date updatedDate;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "profile_id", nullable = true)
    private Profile profile;

    @Override
    public String toString() {
        return "Language [languageId=" + languageId + ", name=" + name + ", level=" + level
                + ", note=" + note + ", createdDate=" + createdDate + ", updatedDate=" + updatedDate
                + "]";
    }


}