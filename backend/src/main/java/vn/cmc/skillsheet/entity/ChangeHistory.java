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
@Table(name = "change_history")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangeHistory implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -5967558957017609339L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "change_history_id", columnDefinition = "int", nullable = false)
    private int changeHistoryId;

    @Column(name = "editor", columnDefinition = "nvarchar(254)")
    private String editor;

    @Column(name = "time", columnDefinition = "datetime")
    private Date time;
    
    @Column(name = "action", columnDefinition = "varchar(150)")
    private String action;

    @Column(name = "ch_table", columnDefinition = "nvarchar(254)")
    private String table;

    @Column(name = "field", columnDefinition = "nvarchar(254)")
    private String field;

    @Column(name = "new_value", columnDefinition = "nvarchar(10000)")
    private String newValue;

    @Column(name = "old_value", columnDefinition = "nvarchar(10000)")
    private String oldValue;

    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

//    @JsonIgnore
//    @ManyToOne(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
//    @JoinColumn(name = "staff_id", nullable = true)
//    private Staff staff;
//
//    @JsonIgnore
//    @ManyToOne(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
//    @JoinColumn(name = "candidate_id", nullable = true)
//    private Candidate candidate;

}