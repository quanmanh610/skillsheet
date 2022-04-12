package vn.cmc.skillsheet.service.impl;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import vn.cmc.skillsheet.dto.SettingDto;
import vn.cmc.skillsheet.entity.Certificate;
import vn.cmc.skillsheet.entity.Email;
import vn.cmc.skillsheet.entity.ProfileCertificate;
import vn.cmc.skillsheet.entity.ProjectRole;
import vn.cmc.skillsheet.entity.School;
import vn.cmc.skillsheet.entity.Skill;
import vn.cmc.skillsheet.entity.TemplateProfile;
import vn.cmc.skillsheet.logic.SettingLogic;
import vn.cmc.skillsheet.repository.TemplateProfileRepository;
import vn.cmc.skillsheet.service.SettingService;
import vn.cmc.skillsheet.util.Messages;
import vn.cmc.skillsheet.vo.ApiMessage;

@Service
public class SettingServiceImpl implements SettingService {
	
    //@Value("${path.file.upload}")
    //private String folderPath;

    @Autowired
    private SettingLogic logic;

    @Override
    public SettingDto getSkillList() {
        SettingDto outDto = new SettingDto();
        List<Skill> skillList = logic.getSkillList();
        outDto.setSkillLst(skillList);
        return outDto;
    }

    @Override
    public Skill addSkill(SettingDto inDto) {
        if (inDto.getSelectedSkill() == null) {
            return null;
        }

        return logic.addSkill(inDto.getSelectedSkill());

    }

    @Override
    public Skill updateSkill(SettingDto inDto) {
        if (inDto.getSelectedSkill() == null) {
            return null;
        }

        return logic.updateSkill(inDto.getSelectedSkill());

    }

    @Override
    public void deleteSkill(SettingDto inDto) {
        if (inDto.getSelectedSkillId() == null) {
            // TODO
        }
        logic.deleteSkill(Integer.parseInt(inDto.getSelectedSkillId().trim()));

    }

    @Override
    public SettingDto getSkill(SettingDto inDto) {
        if (inDto.getSelectedSkillId() == null) {
            // TODO
        }

        SettingDto outDto = new SettingDto();

        Skill skill = logic.getSkill(Integer.parseInt(inDto.getSelectedSkillId().trim()));

        outDto.setSelectedSkill(skill);

        return outDto;
    }

    @Override
    public SettingDto getListOfShcool() {
        SettingDto outDto = new SettingDto();

        List<School> schoolList = logic.getListofSchool();

        outDto.setSchoolList(schoolList);

        return outDto;
    }

    @Override
    public School addSchool(SettingDto inDto) {
        if (null == inDto.getSelectedSchool()) {
            return null;
        }

        return logic.addSchool(inDto.getSelectedSchool());

    }

    @Override
    public School updateSchool(SettingDto inDto) {
        if (null == inDto.getSelectedSchool()) {
            return null;
        }

        return logic.updateSchool(inDto.getSelectedSchool());

    }

    @Override
    public void deleteSchool(SettingDto inDto) {

        if (null != inDto.getSelectedSchoolId()) {
            logic.deleteSchool(Integer.parseInt(inDto.getSelectedSchoolId().trim()));
        }

    }

    @Override
    public SettingDto getSchool(SettingDto inDto) {

        SettingDto outDto = new SettingDto();

        if (null != inDto.getSelectedSchoolId()) {

            School school = logic.getSchool(Integer.parseInt(inDto.getSelectedSchoolId().trim()));

            outDto.setSelectedSchool(school);

            return outDto;

        } else {

            return null;
        }

    }

    @Override
    public SettingDto getListOfCertificate() {
        SettingDto outDto = new SettingDto();

        List<Certificate> certificateList = logic.getListofCertificate();

        outDto.setCertificateList(certificateList);

        return outDto;
    }

    @Override
    public Certificate addCertificate(SettingDto inDto) {
        if (null == inDto.getSelectedCertificate()) {
            return null;
        }

        return logic.addCertificate(inDto.getSelectedCertificate());

    }

    @Override
    public Certificate updateCertificate(SettingDto inDto) {
        if (null == inDto.getSelectedCertificate()) {
            return null;
        }

        return logic.updateCertificate(inDto.getSelectedCertificate());

    }



    @Override
    public void deleteCertificate(SettingDto inDto) {
        if (null != inDto.getSelectedCertificateId()) {
            logic.deleteCertificate(Integer.parseInt(inDto.getSelectedCertificateId().trim()));
        }

    }
    
    @Override
    public int checkCertificate(SettingDto inDto) {
        if (null == inDto.getSelectedCertificateId()) {
            return -99;
        }
        return logic.checkCertificate(Integer.parseInt(inDto.getSelectedCertificateId().trim()));
    }
    
    @Override
    public void deleteProfileCertificate(SettingDto inDto) {
        if (null != inDto.getSelectedCertificateId()) {
            logic.deleteProfileCertificate(Integer.parseInt(inDto.getSelectedCertificateId().trim()));
        }
    }

    @Override
    public SettingDto getCertificate(SettingDto inDto) {

        SettingDto outDto = new SettingDto();

        if (null != inDto.getSelectedCertificateId()) {

            Certificate certificate = logic
                    .getCertificate(Integer.parseInt(inDto.getSelectedCertificateId().trim()));

            outDto.setSelectedCertificate(certificate);

            return outDto;

        } else {

            return null;
        }

    }

    @Override
    public SettingDto getListOfProjectRole() {
        SettingDto outDto = new SettingDto();

        List<ProjectRole> projectRoleList = logic.getListOfProjectRole();

        outDto.setProjectRoleList(projectRoleList);

        return outDto;
    }

    @Override
    public ProjectRole addProjectRole(SettingDto inDto) {
        if (null == inDto.getSelectedProjectRole()) {
            return null;
        }

        return logic.addProjectRole(inDto.getSelectedProjectRole());

    }

    @Override
    public ProjectRole updateProjectRole(SettingDto inDto) {
        if (null == inDto.getSelectedProjectRole()) {
            return null;
        }

        return logic.updateProjectRole(inDto.getSelectedProjectRole());

    }

    @Override
    public void deleteProjectRole(SettingDto inDto) {
        if (null != inDto.getSelectedProjectRoleId()) {
            logic.deleteProjectRole(Integer.parseInt(inDto.getSelectedProjectRoleId().trim()));
        }

    }

    @Override
    public SettingDto getProjectRole(SettingDto inDto) {

        SettingDto outDto = new SettingDto();

        if (null != inDto.getSelectedProjectRoleId()) {

            ProjectRole ProjectRole = logic
                    .getProjectRole(Integer.parseInt(inDto.getSelectedProjectRoleId().trim()));

            outDto.setSelectedProjectRole(ProjectRole);

            return outDto;

        } else {

            return null;
        }

    }

    @Override
    public SettingDto getListOfEmail() {
        SettingDto outDto = new SettingDto();

        List<Email> emailList = logic.getEmailList();

        outDto.setEmailList(emailList);

        return outDto;
    }

    @Override
    public Email addEmail(SettingDto inDto) {
        if (null == inDto.getSelectedEmail()) {
            return null;
        }

        return logic.addEmail(inDto.getSelectedEmail());

    }

    @Override
    public Email updateEmail(SettingDto inDto) {
        if (null == inDto.getSelectedEmail()) {
            return null;
        }

        return logic.updateEmail(inDto.getSelectedEmail());

    }

    @Override
    public void deleteEmail(SettingDto inDto) {

        if (null != inDto.getSelectedEmailId()) {
            logic.deleteEmail(Integer.parseInt(inDto.getSelectedEmailId().trim()));
        }

    }

    @Override
    public SettingDto getEmail(SettingDto inDto) {

        SettingDto outDto = new SettingDto();

        if (null != inDto.getSelectedEmailId()) {

            Email email = logic.getEmail(Integer.parseInt(inDto.getSelectedEmailId().trim()));

            outDto.setSelectedEmail(email);

            return outDto;

        } else {

            return null;
        }

    }

    @Override
    public SettingDto getListOfTemplateProfile() {
        SettingDto outDto = new SettingDto();

        List<TemplateProfile> templateList = logic.getTemplateProfileList();

        outDto.setTemplateProfileList(templateList);

        return outDto;
    }

    @Override
    public TemplateProfile addTemplateProfile(SettingDto inDto) {
        if (null == inDto.getSelectedTemplateProfile()) {
            return null;
        }

        return logic.addTemplateProfile(inDto.getSelectedTemplateProfile());
    }

    @Override
    public TemplateProfile updateTemplateProfile(SettingDto inDto) {
        if (null == inDto.getSelectedEmail()) {
            return null;
        }

        return logic.updateTemplateProfile(inDto.getSelectedTemplateProfile());
    }


    @Override
    public ResponseEntity<?> deleteTemplateProfile(SettingDto inDto) {
        if (null != inDto.getSelectedTemplateProfileId()) {
        	try {
        		logic.deleteTemplateProfile(Integer.parseInt(inDto.getSelectedTemplateProfileId().trim()));
//        		try {
//        			String fileName = logic.getTemplateProfile(Integer.parseInt(inDto.getSelectedTemplateProfileId())).getTemplateName();
//                    File file = new File(folderPath + fileName); 
//                    System.out.println("Deleting file: " + file.getAbsolutePath());
//                    if (file.exists()) {
//                    	file.delete();
//                    } else {
//                    	throw new FileNotFoundException(file.getAbsolutePath());
//                    }                    
//				} catch (Exception e) {
//					e.printStackTrace();
//				}
        		return ResponseEntity.ok().build();
        	} catch (Exception e) {
    			e.printStackTrace();
    			return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                        HttpStatus.BAD_REQUEST);
    		}                       			
        }
        else {
        	return ResponseEntity.badRequest().body("Could not get selected profile template id.");
        }
    }
    
    @Override
    public ResponseEntity<Resource> downloadTemplateProfile(SettingDto inDto) throws IOException {
        if (null != inDto.getSelectedTemplateProfileId()) {
//        	TemplateProfileRepository tmpRepository = new TemplateProfileRepository();
//        	String fileName = logic.getTemplateProfile(Integer.parseInt(inDto.getSelectedTemplateProfileId())).getTemplateName();
//        			System.out.println(fileName);
//        	File initialFile = null;
//        	InputStream targetStream=null;
//        	initialFile=new File(folderPath+fileName);
//        	try {
//        		targetStream = new FileInputStream(initialFile);
//        	} catch (IOException e) {
//        		targetStream = new FileInputStream(new File(folderPath+fileName));
//        	}
        	
        	TemplateProfile template = logic.getTemplateProfile(Integer.parseInt(inDto.getSelectedTemplateProfileId()));
        	InputStream targetStream = new ByteArrayInputStream(template.getFile());
        	InputStreamResource resource = new InputStreamResource(targetStream);
        	
        	HttpHeaders headers = new HttpHeaders();
        			headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + template.getTemplateId());
        	headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        	headers.add("Pragma", "no-cache");
        	headers.add("Expires", "0");
        	
        	return ResponseEntity.ok()
				.headers(headers)
				.contentLength(template.getFile().length)
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.body(resource);

        }
		return null;

    }

    @Override
    public SettingDto getTemplateProfile(SettingDto intDto) {
        SettingDto outDto = new SettingDto();

        if (null != intDto.getSelectedTemplateProfile()) {

            TemplateProfile TemplateProfile = logic.getTemplateProfile(
                    Integer.parseInt(intDto.getSelectedTemplateProfileId().trim()));

            outDto.setSelectedTemplateProfile(TemplateProfile);

            return outDto;

        } else {

            return null;
        }

    }

	@Override
	public int checkSkill(SettingDto inDto) {
		if (null == inDto.getSelectedSkillId()) {
            return -99;
        }
        return logic.checkSkill(Integer.parseInt(inDto.getSelectedSkillId().trim()));
	}

	@Override
	public void deleteProfileSkill(SettingDto inDto) {
		if (null != inDto.getSelectedSkillId()) {
            logic.deleteProfileSkill(Integer.parseInt(inDto.getSelectedSkillId().trim()));
        }
	}

	@Override
	public int checkSchool(SettingDto inDto) {
		if (null == inDto.getSelectedSchoolId()) {
            return -99;
        }
        return logic.checkSchool(Integer.parseInt(inDto.getSelectedSchoolId().trim()));
	}

	@Override
	public void deleteProfileSchool(SettingDto inDto) {
		if (null != inDto.getSelectedSchoolId()) {
            logic.deleteProfileSchool(Integer.parseInt(inDto.getSelectedSchoolId().trim()));
        }
		
	}

	@Override
	public int checkRole(SettingDto inDto) {
		if (null == inDto.getSelectedProjectRoleId()) {
            return -99;
        }
        return logic.checkRole(Integer.parseInt(inDto.getSelectedProjectRoleId().trim()));
	}

	@Override
	public void deleteProfileRole(SettingDto inDto) {
		if (null != inDto.getSelectedProjectRoleId()) {
            logic.deleteProfileRole(Integer.parseInt(inDto.getSelectedProjectRoleId().trim()));
        }
		
	}

}
