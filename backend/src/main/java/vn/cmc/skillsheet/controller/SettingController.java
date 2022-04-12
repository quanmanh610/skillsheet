package vn.cmc.skillsheet.controller;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sun.mail.iap.Response;

import vn.cmc.skillsheet.dto.SettingDto;
import vn.cmc.skillsheet.entity.Certificate;
import vn.cmc.skillsheet.entity.Email;
import vn.cmc.skillsheet.entity.ProjectRole;
import vn.cmc.skillsheet.entity.School;
import vn.cmc.skillsheet.entity.Skill;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.entity.TemplateProfile;
import vn.cmc.skillsheet.logic.SettingLogic;
import vn.cmc.skillsheet.repository.SkillRepository;
import vn.cmc.skillsheet.repository.StaffRepository;
import vn.cmc.skillsheet.service.DowloadProfileService;
import vn.cmc.skillsheet.service.EmailService;
import vn.cmc.skillsheet.service.SettingService;
import vn.cmc.skillsheet.service.TaskSchedulerService;
import vn.cmc.skillsheet.util.Messages;
import vn.cmc.skillsheet.util.RoleUtil;
import vn.cmc.skillsheet.vo.ApiMessage;
import vn.cmc.skillsheet.vo.CertificateJsonRequest;
import vn.cmc.skillsheet.vo.EmailJsonRequest;
import vn.cmc.skillsheet.vo.ProjectroleJsonRequest;
import vn.cmc.skillsheet.vo.SchoolJsonRequest;
import vn.cmc.skillsheet.vo.SkillJsonRequest;
import vn.cmc.skillsheet.vo.TemplateProfileJsonRequest;
import vn.cmc.skillsheet.util.StringUtils;

@Controller
public class SettingController {
    @Autowired
    ApplicationContext context;
    
    @Autowired
    private SettingService service;
    
    @Autowired
    private SettingLogic logic;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private TaskSchedulerService sronJobConfigurationService;
    
    @Autowired
    private StaffRepository staffRepository;
    
    @Autowired
    private SkillRepository skillRepository;
    
//    @Value("${path.file.upload}")
//    private String folderPath;

    @Autowired
    private DowloadProfileService dowloadProfileService;

    @EventListener(ApplicationReadyEvent.class)
    public void runTaskScheduleAfterStartup() {
        sronJobConfigurationService.run();
    }

	@RequestMapping(value = { "/api/setting/getSkillList" }, method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getSkillList() throws IOException {    	
        SettingDto dto = service.getSkillList();
        return new ResponseEntity<>(dto.getSkillLst(), HttpStatus.OK);
    }

    @RequestMapping(value = { "/api/setting/getSkillNameList" }, method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getSkillNameList() throws IOException {
    	List<String> skillNameList = skillRepository.getAllSkillNames();
        return new ResponseEntity<>(skillNameList, HttpStatus.OK);
    }
    
    @RequestMapping(value = { "/api/setting/getLanguageList" }, method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getLanguageList() throws IOException {
    	String[] languages = new String[] {"Mandarin Chinese", "Spanish", "English", "Hindi", "Bengali", "Portuguese",
                "Russian", "Japanese", "Western Punjabi", "Marathi", "Telugu", "Wu Chinese",
                "Turkish", "Korean", "French", "German", "Vietnamese", "Tamil", "Yue Chinese",
                "Urdu", "Javanese", "Italian", "Egyptian Arabic", "Gujarati", "Iranian Persian",
                "Bhojpuri", "Min Nan Chinese", "Hakka Chinese", "Jin Chinese", "Hausa",
                "Kannada", "Indonesian", "Polish", "Yoruba", "Xiang Chinese", "Malayalam",
                "Odia", "Maithili", "Burmese", "Eastern Punjabi", "Sunda", "Sudanese Arabic",
                "Algerian Arabic", "Moroccan Arabic", "Ukrainian", "Igbo", "Northern Uzbek", "Sindhi",
                "North Levantine Arabic", "Romanian", "Tagalog", "Dutch", "Saʽidi Arabic", "Gan Chinese",
                "Amharic", "Northern Pashto" , "Magahi", "Thai", "Saraiki", "Khmer", "Chhattisgarhi", 
                "Somali", "Malay (Malaysian Malay)", "Cebuano", "Nepali", "Mesopotamian Arabic",
                "Assamese", "Sinhalese", "Northern Kurdish", "Hejazi Arabic", "Nigerian Fulfulde",
                "Bavarian", "South Azerbaijani", "Greek", "Chittagonian", "Kazakh", "Deccan",
                "Hungarian", "Kinyarwanda", "Zulu", "South Levantine Arabic", "Tunisian Arabic",
                "Sanaani Spoken Arabic", "Min Bei Chinese", "Southern Pashto", "Rundi", "Czech",
                "Taʽizzi-Adeni Arabic", "Uyghur", "Min Dong Chinese", "Sylheti"};
        return new ResponseEntity<>(languages, HttpStatus.OK);
    }

    
    @RequestMapping(value = { "/api/setting/updateSkill" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateSkill(@RequestBody Skill skillSelected, @RequestParam("t") String token) throws IOException {
    	token = token.replace("Bearer ", "");
    	token = StringUtils.hashString(token);
		Staff staff = staffRepository.findOneByToken(token);
		if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		
        SettingDto inDto = new SettingDto();
        inDto.setSelectedSkill(skillSelected);
        Date date = new Date();
        inDto.getSelectedSkill().setUpdatedDate(date);
        try {
            Skill id = service.updateSkill(inDto);
            Skill updatedSkill = new Skill();
            updatedSkill.setSkillId(skillSelected.getSkillId());
            SettingDto outDto = new SettingDto();
            outDto.setSelectedSkill(updatedSkill);
            return new ResponseEntity<>(outDto.getSelectedSkill(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = { "/api/setting/activeAllSkill" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> activeAllSkill(@RequestBody SkillJsonRequest jsonRequest, @RequestParam("t") String token)
            throws IOException {
    	token = token.replace("Bearer ", "");
    	token = StringUtils.hashString(token);
		Staff staff = staffRepository.findOneByToken(token);
		if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		
        List<String> idList = jsonRequest.getIdSelectedLst();
        Date date = new Date();
        try {
            ArrayList<Skill> skill = new ArrayList<Skill>();
            SettingDto dto = service.getSkillList();
            for (int i = 0; i < dto.getSkillLst().size(); i++) {
                if (dto.getSkillLst().get(i).getStatus() != 0) {
                    for (int j = 0; j < idList.size(); j++) {
                        if (Integer.parseInt(idList.get(j)) == dto.getSkillLst().get(i)
                                .getSkillId()) {
                            dto.getSkillLst().get(i).setStatus(0);
                            SettingDto updateDto = new SettingDto();
                            updateDto.setSelectedSkill(dto.getSkillLst().get(i));
                            updateDto.getSelectedSkill().setUpdatedDate(date);
                            service.updateSkill(updateDto);
                            skill.add(dto.getSkillLst().get(i));
                        }
                    }
                }
            }
            return new ResponseEntity<>(skill, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = { "/api/setting/deleteSkill" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> deleteSkill(@RequestBody String idSelectedLst)
            throws IOException {
        JSONObject obj = new JSONObject(idSelectedLst);
        
        String token = obj.getString("token");
        token = token.replace("Bearer ", "");
    	token = StringUtils.hashString(token);
		Staff staff = staffRepository.findOneByToken(token);
		if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		
        JSONArray idList = obj.getJSONArray("idSelectedLst");
        List<String> idl = new ArrayList<String>();
        try {
            for (int i = 0; i < idList.length(); i++) {
                SettingDto inDto = new SettingDto();
                inDto.setSelectedSkillId(String.valueOf(idList.getInt(i)));
                idl.add(String.valueOf(idList.getInt(i)));
                service.deleteSkill(inDto);
            }
            return new ResponseEntity<>(idl, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = { "/api/setting/addSkill" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> addSkill(@RequestBody Skill skill) throws IOException {
        SettingDto inDto = new SettingDto();
        inDto.setSelectedSkill(skill);
        Date date = new Date();
        inDto.getSelectedSkill().setCreatedDate(date);
        try {
            Skill id = service.addSkill(inDto);
            SettingDto dto = new SettingDto();
            dto.setSelectedSkillId(String.valueOf(id));
            Skill pr = new Skill();
            SettingDto outDto = new SettingDto();
            outDto.setSelectedSkill(pr);
            return new ResponseEntity<>(outDto.getSelectedSkill(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }

    }

    @RequestMapping(value = { "/api/setting/getSkill" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getSkill(@RequestBody SkillJsonRequest jsonRequest)
            throws IOException {
        SettingDto inDto = new SettingDto();
        inDto.setSelectedSkillId(jsonRequest.getSkillId());
        SettingDto outDto = service.getSkill(inDto);
        return new ResponseEntity<>(outDto.getSelectedSkill(), HttpStatus.OK);
    }

    @RequestMapping(value = { "/api/setting/getSchoolList" }, method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getSchoolList() throws IOException {
        SettingDto dto = service.getListOfShcool();
        return ResponseEntity.ok(dto.getSchoolList());
    }

    @RequestMapping(value = { "/api/setting/updateSchool" }, method = RequestMethod.POST)
    @ResponseBody
//    public void updateSchool(@RequestBody School Schoolelected) throws IOException {
//        SettingDto inDto = new SettingDto();
//        inDto.setSelectedSchool(Schoolelected);
//        service.updateSchool(inDto);
//    }
    public ResponseEntity<Object> updateSchool(@RequestBody School schoolSelected, @RequestParam("t") String token) throws IOException {
    	token = token.replace("Bearer ", "");
    	token = StringUtils.hashString(token);
		Staff staff = staffRepository.findOneByToken(token);
		if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		
        SettingDto inDto = new SettingDto();
        inDto.setSelectedSchool(schoolSelected);
        Date date = new Date();
        inDto.getSelectedSchool().setUpdatedDate(date);
        try {
            School id = service.updateSchool(inDto);
            School updatedSchool = new School();
            updatedSchool.setSchoolId(schoolSelected.getSchoolId());
            SettingDto outDto = new SettingDto();
            outDto.setSelectedSchool(updatedSchool);
            return new ResponseEntity<>(outDto.getSelectedSchool(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }
    }
    
    @RequestMapping(value = { "/api/setting/deleteSchool" }, method = RequestMethod.POST)
    @ResponseBody
//    public void deleteSchool(@RequestBody SchoolJsonRequest jsonRequest) throws IOException {
//        for (String selectedId : jsonRequest.getIdSelectedLst()) {
//            SettingDto inDto = new SettingDto();
//            inDto.setSelectedSchoolId(selectedId);
//            service.deleteSchool(inDto);
//        }
//    }
    public ResponseEntity<Object> deleteSchool(@RequestBody String idSelectedLst)
            throws IOException {
        JSONObject obj = new JSONObject(idSelectedLst);
        
        String token = obj.getString("token");
        token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        JSONArray idList = obj.getJSONArray("idSelectedLst");
        List<String> idl = new ArrayList<String>();
        try {
            for (int i = 0; i < idList.length(); i++) {
                SettingDto inDto = new SettingDto();
                inDto.setSelectedSchoolId(String.valueOf(idList.getInt(i)));
                idl.add(String.valueOf(idList.getInt(i)));
                service.deleteSchool(inDto);
            }
            return new ResponseEntity<>(idl, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = { "/api/setting/addSchool" }, method = RequestMethod.POST)
    @ResponseBody
//    public void addSchool(@RequestBody School school) throws IOException {
//        SettingDto inDto = new SettingDto();
//        inDto.setSelectedSchool(school);
//        service.addSchool(inDto);
    public ResponseEntity<Object> addSchool(@RequestBody School school) throws IOException {
            SettingDto inDto = new SettingDto();
            inDto.setSelectedSchool(school);
            Date date = new Date();
            inDto.getSelectedSchool().setCreatedDate(date);
            try {
            	School id = service.addSchool(inDto);
                SettingDto dto = new SettingDto();
                dto.setSelectedSchoolId(String.valueOf(id));
                School pr = new School();
                SettingDto outDto = new SettingDto();
                outDto.setSelectedSchool(pr);
                return new ResponseEntity<>(outDto.getSelectedSchool(), HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                        HttpStatus.BAD_REQUEST);
            }

        }
//    }

    @RequestMapping(value = { "/api/setting/getSchool" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getSchool(@RequestBody SchoolJsonRequest jsonRequest)
            throws IOException {
        SettingDto inDto = new SettingDto();
        inDto.setSelectedSchoolId(jsonRequest.getSchoolId());
        SettingDto outDto = service.getSchool(inDto);
        return ResponseEntity.ok(outDto.getSelectedSchool());
    }

    @RequestMapping(value = { "/api/setting/activeAllSchool" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> activeAllSchool(@RequestBody SchoolJsonRequest jsonRequest, @RequestParam("t") String token)
            throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        List<String> idList = jsonRequest.getIdSelectedLst();
        Date date = new Date();
        try {
            ArrayList<School> school = new ArrayList<School>();
            SettingDto dto = service.getListOfShcool();
            for (int i = 0; i < dto.getSchoolList().size(); i++) {
                if (dto.getSchoolList().get(i).getStatus() != 0) {
                    for (int j = 0; j < idList.size(); j++) {
                        if (Integer.parseInt(idList.get(j)) == dto.getSchoolList().get(i)
                                .getSchoolId()) {
                            dto.getSchoolList().get(i).setStatus(0);
                            SettingDto updateDto = new SettingDto();
                            updateDto.setSelectedSchool(dto.getSchoolList().get(i));
                            updateDto.getSelectedSchool().setUpdatedDate(date);
                            service.updateSchool(updateDto);
                            school.add(dto.getSchoolList().get(i));
                        }
                    }
                }
            }
            return new ResponseEntity<>(school, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = { "/api/setting/getCertificateList" }, method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getCertificateList() throws IOException {
        SettingDto dto = service.getListOfCertificate();
        return new ResponseEntity<>(dto.getCertificateList(), HttpStatus.OK);
    }

    @RequestMapping(value = { "/api/setting/updateCertificate" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateCertificate(@RequestBody Certificate CertificateSelected, @RequestParam("t") String token) throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        SettingDto inDto = new SettingDto();
        inDto.setSelectedCertificate(CertificateSelected);
        Date date = new Date();
        inDto.getSelectedCertificate().setUpdatedDate(date);
        try {
            Certificate id = service.updateCertificate(inDto);
            Certificate updatedCertificate = new Certificate();
            updatedCertificate.setCertificateId(CertificateSelected.getCertificateId());
            SettingDto outDto = new SettingDto();
            outDto.setSelectedCertificate(updatedCertificate);
            return new ResponseEntity<>(outDto.getSelectedCertificate(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }
    }

    
    // Check certificate's existence in profile before deleting
    @RequestMapping(value = { "/api/setting/checkCertificate" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> checkCertificate(@RequestBody CertificateJsonRequest jsonRequest, @RequestParam("t") String token) throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
    	int count = 0;
    	for (String selectedId : jsonRequest.getIdSelectedLst()) {
            SettingDto inDto = new SettingDto();
    	    inDto.setSelectedCertificateId(selectedId);
            count += service.checkCertificate(inDto);
    	}
    	return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    // Delete selected record in profile_certificate table
    @RequestMapping(value = { "/api/setting/deleteProfileCertificateByCerId" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> deleteProfileCertificate(@RequestBody CertificateJsonRequest jsonRequest, @RequestParam("t") String token)
            throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        for (String selectedId : jsonRequest.getIdSelectedLst()) {
        	 
            SettingDto inDto = new SettingDto();
            inDto.setSelectedCertificateId(selectedId);
            service.deleteProfileCertificate(inDto);
        }
        
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = { "/api/setting/deleteCertificate" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> deleteCertificate(@RequestBody CertificateJsonRequest jsonRequest, @RequestParam("t") String token)
            throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        for (String selectedId : jsonRequest.getIdSelectedLst()) {
            SettingDto inDto = new SettingDto();
            inDto.setSelectedCertificateId(selectedId);
            service.deleteCertificate(inDto);
        }
        
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = { "/api/setting/addCertificate" }, method = RequestMethod.POST)
    @ResponseBody
//    public void addCertificate(@RequestBody Certificate certificate) throws IOException {
//        SettingDto inDto = new SettingDto();
//        inDto.setSelectedCertificate(certificate);
//        service.addCertificate(inDto);
//    }
    public ResponseEntity<Object> addSchool(@RequestBody Certificate certificate) throws IOException {
        SettingDto inDto = new SettingDto();
        inDto.setSelectedCertificate(certificate);
        Date date = new Date();
        inDto.getSelectedCertificate().setCreatedDate(date);
        try {
        	Certificate id = service.addCertificate(inDto);
            SettingDto dto = new SettingDto();
            dto.setSelectedCertificateId(String.valueOf(id));
            Certificate pr = new Certificate();
            SettingDto outDto = new SettingDto();
            outDto.setSelectedCertificate(pr);
            return new ResponseEntity<>(outDto.getSelectedCertificate(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }

    }

    @RequestMapping(value = { "/api/setting/getCertificate" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getCertificate(@RequestBody CertificateJsonRequest jsonRequest)
            throws IOException {
        SettingDto inDto = new SettingDto();
        inDto.setSelectedCertificateId(jsonRequest.getCertificationId());
        SettingDto outDto = service.getCertificate(inDto);
        return ResponseEntity.ok(outDto.getSelectedCertificate());
    }

    @RequestMapping(value = { "/api/setting/activeAllCertificate" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> activeAllCertificate(
            @RequestBody CertificateJsonRequest jsonRequest, @RequestParam("t") String token) throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        List<String> idList = jsonRequest.getIdSelectedLst();
        Date date = new Date();
        try {
            ArrayList<Certificate> certificate = new ArrayList<Certificate>();
            SettingDto dto = service.getListOfCertificate();
            for (int i = 0; i < dto.getCertificateList().size(); i++) {
                if (dto.getCertificateList().get(i).getStatus() != 0) {
                    for (int j = 0; j < idList.size(); j++) {
                        if (Integer.parseInt(idList.get(j)) == dto.getCertificateList().get(i)
                                .getCertificateId()) {
                            dto.getCertificateList().get(i).setStatus(0);
                            SettingDto updateDto = new SettingDto();
                            updateDto.setSelectedCertificate(dto.getCertificateList().get(i));
                            updateDto.getSelectedCertificate().setUpdatedDate(date);
                            service.updateCertificate(updateDto);
                            certificate.add(dto.getCertificateList().get(i));
                        }
                    }
                }
            }
            return new ResponseEntity<>(certificate, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = { "/api/setting/getProjectroleList" }, method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getProjectroleList() throws IOException {
        SettingDto dto = service.getListOfProjectRole();
        return new ResponseEntity<>(dto.getProjectRoleList(), HttpStatus.OK);
    }

    @RequestMapping(value = { "/api/setting/updateProjectrole" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateProjectrole(@RequestBody ProjectRole projectroleSelected, @RequestParam("t") String token)
            throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        SettingDto inDto = new SettingDto();
        inDto.setSelectedProjectRole(projectroleSelected);
        Date date = new Date();
        inDto.getSelectedProjectRole().setUpdatedDate(date);
        try {
            ProjectRole id = service.updateProjectRole(inDto);
            ProjectRole pr = new ProjectRole();
            SettingDto outDto = new SettingDto();
            outDto.setSelectedProjectRole(pr);
            return new ResponseEntity<>(outDto.getSelectedProjectRole(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = { "/api/setting/activeAllProjectrole" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> activeAllProjectrole(
            @RequestBody ProjectroleJsonRequest jsonRequest, @RequestParam("t") String token) throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        List<String> idList = jsonRequest.getIdSelectedLst();
        Date date = new Date();
        try {
            ArrayList<ProjectRole> projectRole = new ArrayList<ProjectRole>();
            SettingDto dto = service.getListOfProjectRole();
            for (int i = 0; i < dto.getProjectRoleList().size(); i++) {
                if (dto.getProjectRoleList().get(i).getStatus() != 0) {
                    for (int j = 0; j < idList.size(); j++) {
                        if (Integer.parseInt(idList.get(j)) == dto.getProjectRoleList().get(i)
                                .getProjectRoleId()) {
                            dto.getProjectRoleList().get(i).setStatus(0);
                            SettingDto updateDto = new SettingDto();
                            updateDto.setSelectedProjectRole(dto.getProjectRoleList().get(i));
                            updateDto.getSelectedProjectRole().setUpdatedDate(date);
                            service.updateProjectRole(updateDto);
                            projectRole.add(dto.getProjectRoleList().get(i));
                        }
                    }
                }
            }
            return new ResponseEntity<>(projectRole, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = { "/api/setting/deleteProjectrole" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> deleteProjectrole(@RequestBody String idSelectedLst)
            throws IOException {
        JSONObject obj = new JSONObject(idSelectedLst);
        
        String token = obj.getString("token");
        token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        JSONArray idList = obj.getJSONArray("idSelectedLst");
        List<String> idl = new ArrayList<String>();
        try {
            for (int i = 0; i < idList.length(); i++) {
                SettingDto inDto = new SettingDto();
                inDto.setSelectedProjectRoleId(String.valueOf(idList.getInt(i)));
                idl.add(String.valueOf(idList.getInt(i)));
                service.deleteProjectRole(inDto);
            }
            return new ResponseEntity<>(idl, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = { "/api/setting/addProjectrole" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> addProjectrole(@RequestBody ProjectRole projectrole)
            throws IOException {
        SettingDto inDto = new SettingDto();
        inDto.setSelectedProjectRole(projectrole);
        Date date = new Date();
        inDto.getSelectedProjectRole().setCreatedDate(date);
        try {
            ProjectRole id = service.addProjectRole(inDto);
            SettingDto dto = new SettingDto();
            dto.setSelectedProjectRoleId(String.valueOf(id));
            ProjectRole pr = new ProjectRole();
            SettingDto outDto = new SettingDto();
            outDto.setSelectedProjectRole(pr);
            return new ResponseEntity<>(outDto.getSelectedProjectRole(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }

    }

    @RequestMapping(value = { "/api/setting/getProjectrole" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getProjectrole(@RequestBody ProjectroleJsonRequest jsonRequest)
            throws IOException {
        SettingDto inDto = new SettingDto();
        inDto.setSelectedProjectRoleId(jsonRequest.getProjectRoleId());
        SettingDto outDto = service.getProjectRole(inDto);
        return new ResponseEntity<>(outDto.getSelectedProjectRole(), HttpStatus.OK);
    }
    // EMAIL

    @RequestMapping(value = { "/api/setting/getEmailList" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getEmailList() throws IOException {
        SettingDto dto = service.getListOfEmail();
        return new ResponseEntity<>(dto.getEmailList(), HttpStatus.OK);
    }

    @RequestMapping(value = { "/api/setting/updateEmail" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateEmail(@RequestBody Email emailSelected, @RequestParam("t") String token) throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        SettingDto inDto = new SettingDto();
        inDto.setSelectedEmail(emailSelected);
        Date updateddate = new Date();
        inDto.getSelectedEmail().setUpdatedDate(updateddate);
        sronJobConfigurationService.stop();
        try {
            Email id = service.updateEmail(inDto);
            Email updatedEmail = new Email();
            updatedEmail.setEmailId(emailSelected.getEmailId());
            SettingDto outDto = new SettingDto();
            outDto.setSelectedEmail(updatedEmail);
            sronJobConfigurationService.run();
            return new ResponseEntity<>(outDto.getSelectedEmail(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }
    }

//    @PostMapping(value = "/api/setting/deleteEmail")
//    public ResponseEntity<Object> deleteEmail(@RequestBody String idSelectedLst) {
//        JSONObject obj = new JSONObject(idSelectedLst);
//        
//        String token = obj.getString("token");
//        token = token.replace("Bearer ", "");
//        token = StringUtils.hashString(token);
//        
//        Staff staff = staffRepository.findOneByToken(token);
//        
//        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
//        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//        
//        JSONArray idList = obj.getJSONArray("idSelectedLst");
//        List<String> idl = new ArrayList<String>();
//        sronJobConfigurationService.stop();
//        try {
//            for (int i = 0; i < idList.length(); i++) {
//                SettingDto inDto = new SettingDto();
//                inDto.setSelectedEmailId(String.valueOf(idList.getInt(i)));
//                idl.add(String.valueOf(idList.getInt(i)));
//                service.deleteEmail(inDto);
//                sronJobConfigurationService.run();
//            }
//            return new ResponseEntity<>(idl, HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
//                    HttpStatus.BAD_REQUEST);
//        }
//    }

//    @RequestMapping(value = { "/api/setting/addEmail" }, method = RequestMethod.POST)
//    @ResponseBody
//    public ResponseEntity<Object> addEmail(@RequestBody Email email, @RequestParam("t") String token) throws IOException {
//    	token = token.replace("Bearer ", "");
//        token = StringUtils.hashString(token);
//        
//        Staff staff = staffRepository.findOneByToken(token);
//        
//        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
//        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//        
//        SettingDto inDto = new SettingDto();
//        inDto.setSelectedEmail(email);
//        Date date = new Date();
//        inDto.getSelectedEmail().setCreatedDate(date);
//        sronJobConfigurationService.stop();
//        try {
//            Email id = service.addEmail(inDto);
//            SettingDto dto = new SettingDto();
//            dto.setSelectedEmailId(String.valueOf(id));
//            Email pr = new Email();
//            SettingDto outDto = new SettingDto();
//            outDto.setSelectedEmail(pr);
//            sronJobConfigurationService.run();
//            return new ResponseEntity<>(outDto.getSelectedEmail(), HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
//                    HttpStatus.BAD_REQUEST);
//        }
//
//    }

    @RequestMapping(value = { "/api/setting/getEmail" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getEmail(@RequestBody EmailJsonRequest jsonRequest)
            throws IOException {
        SettingDto inDto = new SettingDto();
        inDto.setSelectedEmailId(jsonRequest.getEmailId());
        SettingDto outDto = service.getEmail(inDto);
        return new ResponseEntity<>(outDto.getSelectedEmail(), HttpStatus.OK);
    }

    @RequestMapping(value = {
            "/api/setting/sendUpdateRequestToStaff" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> sendUpdateRequestToStaff(@RequestParam("t") String token) {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        boolean sc = true;
        try {
            sc = emailService.sendUpdateRequestEmailToStaff();
        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (!sc) {
            return new ResponseEntity<>(
                    new ApiMessage(HttpStatus.OK, Messages.UPDATE_REQUEST_TO_STAFF_FAIL),
                    HttpStatus.OK);
        }
        return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, Messages.SUCCESS), HttpStatus.OK);
    }

    @RequestMapping(value = { "/api/setting/getTemplateProfileList" }, method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getTemplateProfileList() throws IOException {
        SettingDto dto = service.getListOfTemplateProfile();
        return ResponseEntity.ok(dto.getTemplateProfileList());
    }

    @RequestMapping(value = { "/api/setting/updateTemplateProfile" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateTemplateProfile(
            @RequestBody TemplateProfile templateProfileSelected, @RequestParam("t") String token) throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        SettingDto inDto = new SettingDto();
        inDto.setSelectedTemplateProfile(templateProfileSelected);
        Date updateddate = new Date();
        inDto.getSelectedTemplateProfile().setUpdatedDate(updateddate);
        try {
            TemplateProfile id = service.updateTemplateProfile(inDto);
            TemplateProfile pr = new TemplateProfile();
            SettingDto outDto = new SettingDto();
            outDto.setSelectedTemplateProfile(pr);
            return ResponseEntity.ok(outDto.getSelectedTemplateProfile());
        } catch (Exception e) {
            return ResponseEntity.ok("FAILED");
        }
    }
    
    @RequestMapping(value = { "/api/setting/downloadTemplateProfile/{id}" }, method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<Object> downloadTemplateProfile(@PathVariable int id) {	
		try {	
//			String fileName = logic.getTemplateProfile(id).getTemplateName();
//			File downloadFile = new File(folderPath + "/" + fileName);
//			InputStream targetStream = new FileInputStream(new File(folderPath + "/" + fileName));
			TemplateProfile template = logic.getTemplateProfile(id);
			InputStream targetStream = new ByteArrayInputStream(template.getFile());
			InputStreamResource resource = new InputStreamResource(targetStream);
			HttpHeaders headers = new HttpHeaders();
			headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + template.getTemplateName());
			headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
			headers.add("Pragma", "no-cache");
			headers.add("Expires", "0");
			System.out.println(headers);
			return ResponseEntity.ok().headers(headers).contentLength(template.getFile().length)
					.contentType(MediaType.APPLICATION_OCTET_STREAM).body(resource);
		} catch (Exception e) {			
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@PostMapping(value = { "/api/setting/addTemplateProfile" }, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Object> addTemplateProfile(@RequestParam MultipartFile file, @RequestParam String createBy, @RequestParam("t") String token) {

//		File outputFolder = new File(folderPath);
//		if (!outputFolder.isDirectory()) {
//			outputFolder.mkdir();
//		}
//		
//		String fileName = StringUtils.cleanPath(file.getOriginalFilename());
//		Path path = Paths.get(folderPath + "/" + fileName);
//		try {
//			Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
//			dowloadProfileService.storeFile(file, createBy);
//			return ResponseEntity.ok().build();
//		} catch (Exception e) {
//			e.printStackTrace(); 
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
//		}	
		token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
		try {
			dowloadProfileService.storeFile(file, createBy);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	
    @RequestMapping(value = { "/api/setting/getTemplateProfile" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getTemplateProfile(
            @RequestBody TemplateProfileJsonRequest jsonRequest) throws IOException {
        SettingDto inDto = new SettingDto();
        inDto.setSelectedTemplateProfileId(jsonRequest.getTemplateProfileId());
        SettingDto outDto = service.getTemplateProfile(inDto);
        return ResponseEntity.ok(outDto.getSelectedTemplateProfile());
    }
    
    @RequestMapping(value = {"/api/setting/deleteTemplateProfile"},  method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> deleteTemplateProfile(@RequestBody String idSelectedLst) {
        JSONObject obj = new JSONObject(idSelectedLst);
        
        String token = obj.getString("token");
        token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        JSONArray idList = obj.getJSONArray("idSelectedLst");
        List<String> idl = new ArrayList<String>();
        sronJobConfigurationService.stop();
        try {
                SettingDto inDto = new SettingDto();
                inDto.setSelectedTemplateProfileId(String.valueOf(idList.getInt(0)));
                idl.add(String.valueOf(idList.getInt(0)));
                if (service.deleteTemplateProfile(inDto) == null) {
                	return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                            HttpStatus.BAD_REQUEST);
                }
                sronJobConfigurationService.run();     
                return new ResponseEntity<>(idl, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }
    }
            
    // Check Skill's existence in profile before deleting
    @RequestMapping(value = { "/api/setting/checkSkill" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> checkSkill(@RequestBody SkillJsonRequest jsonRequest, @RequestParam("t") String token) throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
    	int count = 0;
    	for (String selectedId : jsonRequest.getIdSelectedLst()) {
            SettingDto inDto = new SettingDto();
    	    inDto.setSelectedSkillId(selectedId);
            count += service.checkSkill(inDto);
    	}
    	return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    // Delete selected record in profile_skill table
    @RequestMapping(value = { "/api/setting/deleteProfileSkillBySkillId" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> deleteProfileSkill(@RequestBody SkillJsonRequest jsonRequest, @RequestParam("t") String token)
            throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        for (String selectedId : jsonRequest.getIdSelectedLst()) {
            SettingDto inDto = new SettingDto();
            inDto.setSelectedSkillId(selectedId);
            service.deleteProfileSkill(inDto);
        }
        
        return ResponseEntity.ok().build();
    }
    
    // Check School's existence in profile before deleting
    @RequestMapping(value = { "/api/setting/checkSchool" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> checkSchool(@RequestBody SchoolJsonRequest jsonRequest, @RequestParam("t") String token) throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
    	int count = 0;
    	for (String selectedId : jsonRequest.getIdSelectedLst()) {
            SettingDto inDto = new SettingDto();
    	    inDto.setSelectedSchoolId(selectedId);
            count += service.checkSchool(inDto);
    	}
    	
    	return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    // Delete selected record in education table
    @RequestMapping(value = { "/api/setting/deleteProfileSchoolBySchoolId" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> deleteProfileSchool(@RequestBody SchoolJsonRequest jsonRequest, @RequestParam("t") String token)
            throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        for (String selectedId : jsonRequest.getIdSelectedLst()) {
        	 
            SettingDto inDto = new SettingDto();
            inDto.setSelectedCertificateId(selectedId);
            service.deleteProfileSchool(inDto);
        }
        
        return ResponseEntity.ok().build();
    }
    
    // Check role's existence in profile before deleting
    @RequestMapping(value = { "/api/setting/checkRole" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> checkRole(@RequestBody ProjectroleJsonRequest jsonRequest, @RequestParam("t") String token) throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
    	int count = 0;
    	for (String selectedId : jsonRequest.getIdSelectedLst()) {
            SettingDto inDto = new SettingDto();
    	    inDto.setSelectedProjectRoleId(selectedId);
            count += service.checkRole(inDto);
    	}
    	return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    // Delete selected record in project table
    @RequestMapping(value = { "/api/setting/deleteProfileRoleByRoleId" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> deleteProfileRole(@RequestBody ProjectroleJsonRequest jsonRequest, @RequestParam("t") String token)
            throws IOException {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canUpdateAndDeleteSettings(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        for (String selectedId : jsonRequest.getIdSelectedLst()) {
        	 
            SettingDto inDto = new SettingDto();
            inDto.setSelectedProjectRoleId(selectedId);
            service.deleteProfileRole(inDto);
        }
        
        return ResponseEntity.ok().build();
    }

}
