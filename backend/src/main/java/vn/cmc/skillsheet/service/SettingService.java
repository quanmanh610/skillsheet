package vn.cmc.skillsheet.service;

import java.io.FileNotFoundException;
import java.io.IOException;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

import vn.cmc.skillsheet.dto.SettingDto;
import vn.cmc.skillsheet.entity.Certificate;
import vn.cmc.skillsheet.entity.Email;
import vn.cmc.skillsheet.entity.ProjectRole;
import vn.cmc.skillsheet.entity.School;
import vn.cmc.skillsheet.entity.Skill;
import vn.cmc.skillsheet.entity.TemplateProfile;

public interface SettingService {
    public SettingDto getSkillList();

    public Skill addSkill(SettingDto inDto);

    public Skill updateSkill(SettingDto inDto);

    public void deleteSkill(SettingDto inDto);

    public SettingDto getSkill(SettingDto inDto);
    
    public int checkSkill(SettingDto inDto);
    
    public void deleteProfileSkill(SettingDto inDto);

    // School
    public SettingDto getListOfShcool();

    public School addSchool(SettingDto inDto);

    public School updateSchool(SettingDto inDto);

    public void deleteSchool(SettingDto inDto);

    public SettingDto getSchool(SettingDto inDto);
    
    public int checkSchool(SettingDto inDto);
    
    public void deleteProfileSchool(SettingDto inDto);

    // Certificates
    public SettingDto getListOfCertificate();

    public Certificate addCertificate(SettingDto inDto);

    public Certificate updateCertificate(SettingDto inDto);

    public void deleteCertificate(SettingDto inDto);

    public SettingDto getCertificate(SettingDto inDto);
    
    public int checkCertificate(SettingDto inDto);
    
    public void deleteProfileCertificate(SettingDto inDto);

    // ProjectRole
    public SettingDto getListOfProjectRole();

    public ProjectRole addProjectRole(SettingDto inDto);

    public ProjectRole updateProjectRole(SettingDto inDto);

    public void deleteProjectRole(SettingDto inDto);

    public SettingDto getProjectRole(SettingDto inDto);
    
    public int checkRole(SettingDto inDto);
    
    public void deleteProfileRole(SettingDto inDto);

    // Email
    public SettingDto getListOfEmail();

    public Email addEmail(SettingDto inDto);

    public Email updateEmail(SettingDto inDto);

    public void deleteEmail(SettingDto inDto);

    public SettingDto getEmail(SettingDto inDto);

    // TemplateProfile

    public SettingDto getListOfTemplateProfile();

    public TemplateProfile addTemplateProfile(SettingDto inDto);

    public TemplateProfile updateTemplateProfile(SettingDto inDto);

    public ResponseEntity deleteTemplateProfile(SettingDto inDto);
    
    public ResponseEntity<Resource> downloadTemplateProfile(SettingDto inDto) throws IOException;

    public SettingDto getTemplateProfile(SettingDto intDto);

	
}
