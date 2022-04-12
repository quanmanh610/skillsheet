package vn.cmc.skillsheet.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "email")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Email implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 67150841843494623L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "email_id", columnDefinition = "int", nullable = false)
    private int emailId;

    @Column(name = "receiver", columnDefinition = "varchar(50)")
    private String receiver;

    @Column(name = "schedule", columnDefinition = "varchar(50)")
    private String schedule;

    @Column(name = "have_repeat", columnDefinition = "varchar(50)")
    private String haveRepeat;

    @Column(name = "day", columnDefinition = "varchar(50)")
    private String day;

    @Column(name = "time", columnDefinition = "varchar(50)")
    private String time;

    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

    @Column(name = "updated_date", columnDefinition = "DateTime")
    private Date updatedDate;
    
    @Column(name = "status", columnDefinition = "varchar(50)")
    private String status;

}