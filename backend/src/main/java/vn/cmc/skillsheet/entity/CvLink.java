package vn.cmc.skillsheet.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "cv_link")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CvLink implements Serializable {


    @Id
    @Column(name = "file_name", columnDefinition = "varchar(255)")
    private String fileName;

    @Column(name = "preview_url", columnDefinition = "varchar(1000)")
    private String previewUrl;

    @Column(name = "created_at", columnDefinition = "DateTime")
    private LocalDateTime createdAt;
    


}