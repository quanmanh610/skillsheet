package vn.cmc.skillsheet.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "channel")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Channel implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 67150841843494623L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", columnDefinition = "int", nullable = false)
    private int id;

    @Column(name = "name", columnDefinition = "varchar(255)")
    private String name;

    @Column(name = "created_by", columnDefinition = "varchar(50)")
    private String createdBy;

    @Column(name = "created_at", columnDefinition = "DateTime")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "DateTime")
    private LocalDateTime updatedAt;

    @Column(name = "updated_by", columnDefinition = "varchar(50)")
    private String updatedBy;
    


}