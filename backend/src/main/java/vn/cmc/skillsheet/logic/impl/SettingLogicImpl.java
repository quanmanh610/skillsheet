package vn.cmc.skillsheet.logic.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import vn.cmc.skillsheet.entity.Certificate;
import vn.cmc.skillsheet.entity.Email;
import vn.cmc.skillsheet.entity.ProjectRole;
import vn.cmc.skillsheet.entity.School;
import vn.cmc.skillsheet.entity.Skill;
import vn.cmc.skillsheet.entity.TemplateProfile;
import vn.cmc.skillsheet.logic.SettingLogic;
import vn.cmc.skillsheet.repository.CertificateRepository;
import vn.cmc.skillsheet.repository.EducationRepository;
import vn.cmc.skillsheet.repository.EmailRepository;
import vn.cmc.skillsheet.repository.ProfileCertificateRepository;
import vn.cmc.skillsheet.repository.ProfileSkillRepository;
import vn.cmc.skillsheet.repository.ProjectRepository;
import vn.cmc.skillsheet.repository.ProjectRoleRepository;
import vn.cmc.skillsheet.repository.SchoolRepository;
import vn.cmc.skillsheet.repository.SkillRepository;
import vn.cmc.skillsheet.repository.TemplateProfileRepository;

@Component
public class SettingLogicImpl implements SettingLogic {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private ProjectRoleRepository projectRoleRepository;

    @Autowired
    private EmailRepository emailRepository;
 
    @Autowired
    private TemplateProfileRepository templateprofileRepository;
    
    @Autowired
    private ProfileCertificateRepository profileCertificateRepository;
    
    @Autowired
    private EducationRepository educationRepository;
    
    @Autowired
    private ProfileSkillRepository profileSkillRepository;
    
    @Autowired
    private ProjectRepository projectRepository;


    @Override
    public List<Skill> getSkillList() {
        return skillRepository.findAll(Sort.by(Sort.Direction.DESC, "skillId"));
    }

    @Override
    public Skill updateSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    @Override
    public Skill addSkill(Skill skill) {
        return skillRepository.save(skill);

    }

    @Override
    public void deleteSkill(int skillId) {
        skillRepository.deleteById(skillId);

    }

    @Override
    public Skill getSkill(int skillId) {
        return skillRepository.findOneById(skillId);
    }

    @Override
    public List<School> getListofSchool() {
        return schoolRepository.findAll(Sort.by(Sort.Direction.DESC, "schoolId"));
    }

    @Override
    public School updateSchool(School school) {
        return schoolRepository.save(school);

    }

    @Override
    public School addSchool(School school) {
        return schoolRepository.save(school);

    }

    @Override
    public void deleteSchool(int schoolId) {
        schoolRepository.deleteById(schoolId);

    }

    @Override
    public School getSchool(int schoolId) {
        return schoolRepository.findOneById(schoolId);
    }

    @Override
    public List<Certificate> getListofCertificate() {
        return certificateRepository.findAll(Sort.by(Sort.Direction.DESC, "certificateId"));
    }

    @Override
    public Certificate updateCertificate(Certificate certificate) {
        return certificateRepository.save(certificate);
    }

    @Override
    public Certificate addCertificate(Certificate certificate) {
        return certificateRepository.save(certificate);
    }

    @Override
    public void deleteCertificate(int certificateId) {
        certificateRepository.deleteById(certificateId);
    }
    
    @Override
    public int checkCertificate(int certificateId) {
    	return profileCertificateRepository.findByCertificateId(certificateId);
    	
    }
    
	@Override
	public void deleteProfileCertificate(int certificateId) {
		profileCertificateRepository.deleteByCertificateId(certificateId);
	}

    @Override
    public Certificate getCertificate(int certificateId) {
        return certificateRepository.findOneById(certificateId);
    }

    @Override
    public List<ProjectRole> getListOfProjectRole() {
        return projectRoleRepository.findAll(Sort.by(Sort.Direction.DESC, "projectRoleId"));
    }

    @Override
    public ProjectRole updateProjectRole(ProjectRole projectrole) {
        return projectRoleRepository.save(projectrole);
    }

    @Override
    public ProjectRole addProjectRole(ProjectRole projectrole) {
        return projectRoleRepository.save(projectrole);
    }

    @Override
    public void deleteProjectRole(int projectroleId) {
        projectRoleRepository.deleteById(projectroleId);
    }

    @Override
    public ProjectRole getProjectRole(int projectroleId) {
        return projectRoleRepository.findOneById(projectroleId);
    }

    @Override
    public List<Email> getEmailList() {
        return emailRepository.findAll();
    }

    @Override
    public Email updateEmail(Email email) {
        return emailRepository.save(email);
    }

    @Override
    public Email addEmail(Email email) {
        return emailRepository.save(email);

    }

    @Override
    public void deleteEmail(int emailId) {
        emailRepository.deleteById(emailId);

    }

    @Override
    public Email getEmail(int emailId) {
        return emailRepository.findOneById(emailId);
    }

    @Override
    public List<TemplateProfile> getTemplateProfileList() {
        return templateprofileRepository.findAll();
    }

    @Override
    public TemplateProfile updateTemplateProfile(TemplateProfile templateProfile) {
        return templateprofileRepository.save(templateProfile);
    }

    @Override
    public TemplateProfile addTemplateProfile(TemplateProfile templateProfile) {
        return templateprofileRepository.save(templateProfile);
    }

    @Override
    public void deleteTemplateProfile(int templateProfileId) {
        templateprofileRepository.deleteById(templateProfileId);

    }

    @Override
    public TemplateProfile getTemplateProfile(int templateProfileId) {
        return templateprofileRepository.findOneById(templateProfileId);
    }

	@Override
	public int checkSkill(int skillId) {
		return profileSkillRepository.findBySkillId(skillId);
	}

	@Override
	public void deleteProfileSkill(int skillId) {
		profileSkillRepository.deleteBySkillId(skillId);
		
	}

	@Override
	public int checkSchool(int schoolId) {
		return educationRepository.findBySchoolId(schoolId);
	}

	@Override
	public void deleteProfileSchool(int schoolId) {
		educationRepository.deleteBySchoolId(schoolId);
		
	}

	@Override
	public int checkRole(int roleId) {

		return projectRepository.findByRoleId(roleId);
	}

	@Override
	public void deleteProfileRole(int roleId) {
		projectRepository.deleteByRoleId(roleId);
		
	}
}
