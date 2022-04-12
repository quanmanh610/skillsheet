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
@Table(name = "template_profile")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TemplateProfile implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 2469857820827256610L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "template_id", columnDefinition = "int", nullable = false)
    private int templateId;

    @Column(name = "template_name", columnDefinition = "nvarchar(30)")
    private String templateName;

    @Column(name = "editor", columnDefinition = "nvarchar(30)")
    private String editor;

    @Column(name = "file_type", columnDefinition = "nvarchar(254)")
    private String fileType;

    @Column(name = "created_date", columnDefinition = "DateTime")
    private Date createdDate;

    @Column(name = "updated_date", columnDefinition = "DateTime")
    private Date updatedDate;

    @Column(name = "file", columnDefinition = "longblob")
    private byte[] file;

    public TemplateProfile(String fileName, String fileType, byte[] data) {
        this.templateName = fileName;
        this.fileType = fileType;
        this.file = data;
    }

}