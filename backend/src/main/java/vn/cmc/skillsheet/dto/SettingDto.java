package vn.cmc.skillsheet.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.cmc.skillsheet.entity.Certificate;
import vn.cmc.skillsheet.entity.Email;
import vn.cmc.skillsheet.entity.ProjectRole;
import vn.cmc.skillsheet.entity.School;
import vn.cmc.skillsheet.entity.Skill;
import vn.cmc.skillsheet.entity.TemplateProfile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SettingDto {
    // Skill
    private Skill selectedSkill;

    private List<Skill> skillLst;

    private String selectedSkillId;

    // Schools
    private School selectedSchool;

    private List<School> schoolList;

    private String selectedSchoolId;

    // Certificates
    private Certificate selectedCertificate;

    private List<Certificate> certificateList;

    private String selectedCertificateId;

    // Project Role
    private ProjectRole selectedProjectRole;

    private List<ProjectRole> projectRoleList;

    private String selectedProjectRoleId;

    // Emails
    private Email selectedEmail;

    private List<Email> emailList;

    private String selectedEmailId;

    // Template Profile
    private TemplateProfile selectedTemplateProfile;
    
    private List<TemplateProfile> templateProfileList;

    private String selectedTemplateProfileId;

}
