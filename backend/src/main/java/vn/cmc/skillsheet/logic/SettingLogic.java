package vn.cmc.skillsheet.logic;

import java.util.List;

import vn.cmc.skillsheet.entity.Certificate;
import vn.cmc.skillsheet.entity.Email;
import vn.cmc.skillsheet.entity.ProjectRole;
import vn.cmc.skillsheet.entity.School;
import vn.cmc.skillsheet.entity.Skill;
import vn.cmc.skillsheet.entity.TemplateProfile;

public interface SettingLogic {

    /**
     * 
     */
    public List<Skill> getSkillList();

    /**
     * 
     * @param skill
     */
    public Skill updateSkill(Skill skill);

    /**
     * 
     * @param skill
     */
    public Skill addSkill(Skill skill);

    /**
     * 
     * @param skill
     */
    public void deleteSkill(int skillId);

    /**
     * 
     * @param skillID
     * @return
     */
    public Skill getSkill(int skillId);
    
    /**
     * 
     * @param skillId
     */
    public int checkSkill(int skillId);
    
    /**
     * 
     * @param skillId
     */
    public void deleteProfileSkill(int skillId);

    // School
    /**
     * 
     */
    public List<School> getListofSchool();

    /**
     * 
     * @param School
     */
    public School updateSchool(School School);

    /**
     * 
     * @param School
     */
    public School addSchool(School School);

    /**
     * 
     * @param schoolId
     */
    public void deleteSchool(int schoolId);

    /**
     * 
     * @param schoolId
     * @return
     */
    public School getSchool(int schoolId);
    
    /**
     * 
     * @param schoolId
     */
    public int checkSchool(int schoolId);
    
    /**
     * 
     * @param schoolId
     */
    public void deleteProfileSchool(int schoolId);

    // Certificate
    /**
     * 
     */
    public List<Certificate> getListofCertificate();

    /**
     * 
     * @param certificate
     */
    public Certificate updateCertificate(Certificate certificate);

    /**
     * 
     * @param certificate
     */
    public Certificate addCertificate(Certificate certificate);

    /**
     * 
     * @param certificateId
     */
    public void deleteCertificate(int certificateId);
    
    /**
     * 
     * @param certificateId
     */
    public int checkCertificate(int certificateId);
    
    /**
     * 
     * @param certificateId
     */
    public void deleteProfileCertificate(int certificateId);

    /**
     * 
     * @param certificateId
     * @return
     */
    public Certificate getCertificate(int certificateId);

    // Project Role
    /**
     * 
     */
    public List<ProjectRole> getListOfProjectRole();

    /**
     * 
     * @param ProjectRole
     */
    public ProjectRole updateProjectRole(ProjectRole ProjectRole);

    /**
     * 
     * @param ProjectRole
     */
    public ProjectRole addProjectRole(ProjectRole ProjectRole);

    /**
     * 
     * @param ProjectRoleId
     */
    public void deleteProjectRole(int ProjectRoleId);

    /**
     * 
     * @param ProjectRoleId
     * @return
     */
    public ProjectRole getProjectRole(int ProjectRoleId);
    
    /**
     * 
     * @param roleId
     */
    public int checkRole(int roleId);
    
    /**
     * 
     * @param roleId
     */
    public void deleteProfileRole(int roleId);

    /**
     * 
     */
    public List<Email> getEmailList();

    /**
     * 
     * @param email
     */
    public Email updateEmail(Email email);

    /**
     * 
     * @param email
     */
    public Email addEmail(Email email);

    /**
     * 
     * @param email
     */
    public void deleteEmail(int emailId);

    /**
     * 
     * @param emailID
     * @return
     */
    public Email getEmail(int emailId);

    /**
     * 
     */
    public List<TemplateProfile> getTemplateProfileList();

    /**
     * 
     * @param TemplateProfile
     */
    public TemplateProfile updateTemplateProfile(TemplateProfile TemplateProfile);

    /**
     * 
     * @param TemplateProfile
     */
    public TemplateProfile addTemplateProfile(TemplateProfile TemplateProfile);

    /**
     * 
     * @param TemplateProfileID
     * @return
     */
    public void deleteTemplateProfile(int TemplateProfileId);

    /**
     * 
     * @param TemplateProfileID
     * @return
     */
    public TemplateProfile getTemplateProfile(int TemplateProfileId);

}
