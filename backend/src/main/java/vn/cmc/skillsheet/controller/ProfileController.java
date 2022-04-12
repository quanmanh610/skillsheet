package vn.cmc.skillsheet.controller;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import vn.cmc.skillsheet.constant.POARoles;
import vn.cmc.skillsheet.dto.ProfileDto;
import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.Education;
import vn.cmc.skillsheet.entity.Language;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.ProfileCertificate;
import vn.cmc.skillsheet.entity.ProfileSkill;
import vn.cmc.skillsheet.entity.Project;
import vn.cmc.skillsheet.entity.RequestApproval;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.entity.TemplateProfile;
import vn.cmc.skillsheet.entity.Version;
import vn.cmc.skillsheet.entity.WorkExperience;
import vn.cmc.skillsheet.repository.CandidateRepository;
import vn.cmc.skillsheet.repository.EducationRepository;
import vn.cmc.skillsheet.repository.LanguageRepository;
import vn.cmc.skillsheet.repository.ProfileCertificateRepository;
import vn.cmc.skillsheet.repository.ProfileRepository;
import vn.cmc.skillsheet.repository.ProfileSkillRepository;
import vn.cmc.skillsheet.repository.ProjectRepository;
import vn.cmc.skillsheet.repository.RequestApprovalRepository;
import vn.cmc.skillsheet.repository.StaffRepository;
import vn.cmc.skillsheet.repository.TemplateProfileRepository;
import vn.cmc.skillsheet.repository.VersionRepository;
import vn.cmc.skillsheet.repository.WorkExperienceRepository;
import vn.cmc.skillsheet.service.DowloadProfileService;
import vn.cmc.skillsheet.service.EmailService;
import vn.cmc.skillsheet.service.ProfileService;
import vn.cmc.skillsheet.util.Messages;
import vn.cmc.skillsheet.util.RoleUtil;
import vn.cmc.skillsheet.util.StringUtils;
import vn.cmc.skillsheet.vo.ApiMessage;
import vn.cmc.skillsheet.vo.FindProfileParams;
import vn.cmc.skillsheet.vo.LoginUser;
import vn.cmc.skillsheet.vo.StaffEmail;

@Controller
public class ProfileController {

	@Autowired
	private ProfileRepository profileRepository;

	@Autowired
	private CandidateRepository candidateRepository;

	@Autowired
	private EducationRepository educationRepository;

	@Autowired
	private WorkExperienceRepository workExperienceRepository;

	@Autowired
	private ProjectRepository projectRepository;

	@Autowired
	private ProfileCertificateRepository profileCertificateRepository;

	@Autowired
	private ProfileSkillRepository profileSkillRepository;

	@Autowired
	private LanguageRepository languageRepository;

	@Autowired
	private VersionRepository versionRepository;

	@Autowired
	private ProfileService profileService;

	@Autowired
	private RequestApprovalRepository requestApprovalRepository;

	@Autowired
	private DowloadProfileService dowloadProfileService;
	
    @Autowired
    private EmailService emailService;

	@Autowired
	private TemplateProfileRepository templateProfileRepository;
	
	@Autowired
    private HttpServletRequest request;
	
	@Autowired
	private StaffRepository staffRepository;
	
	@Value("${maxdownload}")
	private int maxDownload;
	

	@RequestMapping(value = { "/api/profile/getProfileByCandidateEmail" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> getProfileByCandidateEmail(@RequestBody String email) {
		JSONObject obj = new JSONObject(email);
		String candidateEmail = obj.getString("candidateEmail");
		String token = obj.getString("token").replace("Bearer ", "");
		token = token.replace("FAKE-", "");
		token = StringUtils.hashString(token);
		Candidate candidate = candidateRepository.findOneByToken(token);
		Profile profile = profileService.getProfileByCandidateEmail(candidateEmail);
		if (candidate == null) {
			Staff staff = staffRepository.findOneByToken(token);
			if (staff == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}
			
			if (RoleUtil.checkCandidateProfileRole(staff, profile)) {
				return new ResponseEntity<>(profile, HttpStatus.OK);
			} else {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
			}			
		}		
		
		if (!RoleUtil.isCandidateProfileOwner(candidate, profile)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		
		return new ResponseEntity<>(profile, HttpStatus.OK);
	}

//	@RequestMapping(value = { "/api/profile/getProfileByCandidateId" }, method = RequestMethod.POST)
//	@ResponseBody
//	public ResponseEntity<Object> getProfileByCandidateId(@RequestBody String candidateId) {
//		int id;
//		try {
//			JSONObject obj = new JSONObject(candidateId);
//	        String strId = obj.get("candidateId").toString();
//			id = Integer.parseInt(strId);
//		} catch (Exception e) {
//			return ResponseEntity.badRequest().body(e.getMessage());
//		}
//		try {
//			return new ResponseEntity<>(profileService.getProfileByCandidateId(id), HttpStatus.OK);
//			
//		} catch (IllegalArgumentException e) {
//			return ResponseEntity.badRequest().body(e.getMessage());
//		}
//	}

	@RequestMapping(value = { "/api/profile/getProfileById" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> getProfileById(@RequestBody String id) {
		JSONObject obj = new JSONObject(id);
		int profile_id = obj.getInt("profileId");
		String token = obj.getString("token").replace("Bearer ", "");
		token = StringUtils.hashString(token);
		Optional<Profile> profile = profileRepository.findById(profile_id);
		if (profile.isPresent()) {
			Staff staff = staffRepository.findOneByToken(token);
			if (staff == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}
			
			if (!RoleUtil.checkStaffProfileRole(staff, profile.get())) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
			}
			return new ResponseEntity<>(profile.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, "Profile not found"), HttpStatus.OK);
		}
	}

	@RequestMapping(value = { "/api/profile/getProfileByStaffEmail" }, method = RequestMethod.POST)
	@ResponseBody
	@ModelAttribute
	public ResponseEntity<Object> getProfileByStaffEmail(@RequestBody String email) {
		JSONObject obj = new JSONObject(email);
		String staffEmail = obj.getString("staffEmail");
		String token = obj.getString("token").replace("Bearer ", "");
		token = StringUtils.hashString(token);		
		Staff staff = staffRepository.findOneByToken(token);
		if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		List<Profile> profiles = profileRepository.findByEmail(staffEmail);		

		for (int i = 0; i < profiles.size(); i++) {
			if (null != profiles.get(i).getVersion().getVersionType()
					&& "Main".equals(profiles.get(i).getVersion().getVersionType())) {
				if (!RoleUtil.checkStaffProfileRole(staff, profiles.get(i))) {
					return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
				}
				return new ResponseEntity<>(profiles.get(i), HttpStatus.OK);
			}
		}
		if (profiles.size() > 0) {
			if (!RoleUtil.checkStaffProfileRole(staff, profiles.get(0))) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
			}
			return new ResponseEntity<>(profiles.get(0), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, "Profile not found"), HttpStatus.OK);
		}
	}
	
	// get Profile by a list of email
	@RequestMapping(value = { "/api/profile/getProfileByStaffEmailList" }, method = RequestMethod.POST)
	@ResponseBody
	@ModelAttribute
	public ResponseEntity<Object> getProfileByStaffEmailList(@RequestBody String emailList) {
		JSONObject obj = new JSONObject(emailList);
		String[] listOfEmails = obj.getString("emailList").split(",");
		Map<String, Profile> profiles = new HashMap<>();
		
		String token = obj.getString("token").replace("Bearer ", "");
		token = StringUtils.hashString(token);		
		Staff staff = staffRepository.findOneByToken(token);
		if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		for (int i = 0; i < listOfEmails.length; i++) {
			Profile profile = profileRepository.findByEmailForDashboard(listOfEmails[i]);
			if (profile != null && !RoleUtil.checkStaffProfileRole(staff, profile)) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
			}
			profiles.put(listOfEmails[i], profile);
		}

		if (profiles.size() > 0) {
			return new ResponseEntity<>(profiles, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, "Profiles not found"), HttpStatus.OK);
		}
	}

	@RequestMapping(value = { "/api/profile/getProfileByVersion" }, method = RequestMethod.POST)
	@ResponseBody
	@ModelAttribute
	public ResponseEntity<Object> getProfileByVersion(@RequestBody String payload) {
		JSONObject obj = new JSONObject(payload);
		String token = obj.getString("token").replace("Bearer ", "");	
		token = StringUtils.hashString(token);
		int versionId = obj.getInt("versionId");
		Version ver = versionRepository.findOneById(versionId);
		if (ver.getProfile() == null) {
			return ResponseEntity.badRequest().body("Cannot get profile of the version.");
		}
		
		Profile profile = profileRepository.findOneById(ver.getProfile().getProfileId());
		Staff staff = staffRepository.findOneByToken(token);
		if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		if (staff == null || !RoleUtil.checkStaffProfileRole(staff, profile)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		return new ResponseEntity<>(profile, HttpStatus.OK);		
	}

	@RequestMapping(value = { "/api/profile/updateProfile" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> updateProfile(@RequestBody Profile profile, @RequestParam("t") String token) {
		if (!RoleUtil.checkProfileOwner(profile, token, staffRepository, candidateRepository)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		
		return new ResponseEntity<>(profileService.updateProfile(profile), HttpStatus.OK);
	}

	@RequestMapping(value = { "/api/profile/deleteEducation" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> deleteEducation(@RequestBody Education education, @RequestParam("t") String token) {
		Profile profile = profileRepository
				.findOneById(educationRepository.selectProfileId(education.getEducationId()));
		
		if (!RoleUtil.checkProfileOwner(profile, token, staffRepository, candidateRepository)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		
		profile.setUpdatedDate(new Date());
		profileRepository.save(profile);
		educationRepository.delete(education);
		return new ResponseEntity<>(education, HttpStatus.OK);
	}

	@RequestMapping(value = { "/api/profile/deleteLanguage" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> deleteLanguage(@RequestBody Language language, @RequestParam("t") String token) {
		Profile profile = profileRepository.findOneById(languageRepository.selectProfileId(language.getLanguageId()));
		
		if (!RoleUtil.checkProfileOwner(profile, token, staffRepository, candidateRepository)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		
		profile.setUpdatedDate(new Date());
		profileRepository.save(profile);
		languageRepository.delete(language);
		return new ResponseEntity<>(language, HttpStatus.OK);
	}

	@RequestMapping(value = { "/api/profile/deleteWorkExperience" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> deleteWorkExperience(@RequestBody WorkExperience workExperience, @RequestParam("t") String token) {
		Profile profile = profileRepository
				.findOneById(workExperienceRepository.selectProfileId(workExperience.getWorkExperienceId()));
		
		if (!RoleUtil.checkProfileOwner(profile, token, staffRepository, candidateRepository)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		
		profile.setUpdatedDate(new Date());
		profileRepository.save(profile);
		workExperienceRepository.delete(workExperience);
		return new ResponseEntity<>(workExperience, HttpStatus.OK);
	}

	@RequestMapping(value = { "/api/profile/deleteProject" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> deleteWorkProject(@RequestBody Project project, @RequestParam("t") String token) {
		Profile profile = profileRepository.findOneById(projectRepository.selectProfileId(project.getProjectId()));
		
		if (!RoleUtil.checkProfileOwner(profile, token, staffRepository, candidateRepository)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		
		profile.setUpdatedDate(new Date());
		profileRepository.save(profile);
		projectRepository.delete(project);
		return new ResponseEntity<>(project, HttpStatus.OK);
	}

	@RequestMapping(value = { "/api/profile/addProfileCertificate" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> addProfileCertificate(@RequestBody String certi) {		
		try {
			Profile profile = profileService.addProfileCertificate(certi);
			return new ResponseEntity<>(profile, HttpStatus.OK);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}		
	}

	@RequestMapping(value = { "/api/profile/updateProfileCertificate" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> updateProfileCertificate(@RequestBody String certi) {
		try {
			Profile profile = profileService.updateProfileCertificate(certi);
			return new ResponseEntity<>(profile, HttpStatus.OK);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
	}

	@RequestMapping(value = { "/api/profile/deleteProfileCertificate" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> deleteProfileCertificate(@RequestBody String deleteId) {
		JSONObject obj = new JSONObject(deleteId);
		JSONArray idList = obj.getJSONArray("deleteIds");
		String token = obj.getString("token");
		Date date = new Date();
		for (int i = 0; i < idList.length(); i++) {
			ProfileCertificate profileCertificate = profileCertificateRepository.findOneById(idList.getInt(i));
			Profile profile = profileCertificate.getProfile();
			if (!RoleUtil.checkProfileOwner(profile, token, staffRepository, candidateRepository)) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
			}
			profile.setUpdatedDate(date);
			profileRepository.save(profile);
			profileCertificateRepository.deleteById(idList.getInt(i));
		}
		return new ResponseEntity<>("DELETED", HttpStatus.OK);
	}

	@RequestMapping(value = { "/api/profile/addProfileSkill" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> addProfileSkill(@RequestBody String skill_l) {
		try {
			Profile profile = profileService.addProfileSkill(skill_l);
			return new ResponseEntity<>(profile, HttpStatus.OK);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
	}

	@RequestMapping(value = { "/api/profile/updateProfileSkill" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> updateProfileSkill(@RequestBody String skill_l) {
		try {
			Profile profile = profileService.updateProfileSkill(skill_l);
			return new ResponseEntity<>(profile, HttpStatus.OK);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
	}

	@RequestMapping(value = { "/api/profile/deleteProfileSkill" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> deleteProfileSkill(@RequestBody String deleteId) {
		JSONObject obj = new JSONObject(deleteId);
		JSONArray idList = obj.getJSONArray("deleteIds");
		String token = obj.getString("token");
		Date date = new Date();
		for (int i = 0; i < idList.length(); i++) {
			ProfileSkill profileSkill = profileSkillRepository.findOneById(idList.getInt(i));
			Profile profile = profileSkill.getProfile();
			if (!RoleUtil.checkProfileOwner(profile, token, staffRepository, candidateRepository)) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
			}
			profile.setUpdatedDate(date);
			profileRepository.save(profile);
			profileSkillRepository.deleteById(idList.getInt(i));
		}
		return new ResponseEntity<>("DELETED", HttpStatus.OK);
	}

	@RequestMapping(value = { "/api/profile/createFirstStaffProfile" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> createFirstStaffProfile(@RequestBody LoginUser loginUser, @RequestParam("t") String token) {
		try {
			Profile profile = profileService.createFirstStaffProfile(loginUser, token);
			return new ResponseEntity<>(profile, HttpStatus.OK);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
	}

	@RequestMapping(value = { "/api/profile/copyCandidateProfile" }, method = RequestMethod.POST)
	@ResponseBody
	@ModelAttribute
	public ResponseEntity<Object> copyCandidateProfile(@RequestBody String email) {
		JSONObject obj = new JSONObject(email);
		String candidateEmail = obj.getString("candidateEmail");
		String userName = obj.getString("userName");
		String staffEmail = obj.getString("staffEmail");
		Date date = new Date();

		List<Candidate> candiList = candidateRepository.findByEmail(candidateEmail);
		if (candiList.size() == 0) {
			return ResponseEntity.badRequest().body("Candidate email does not exist");
		} else {
			List<Profile> profileList = profileRepository.findByEmail(candidateEmail);

			if (null == profileList || profileList.size() == 0) {
				return ResponseEntity.badRequest().body("Profile does not exist: " + candidateEmail);
			} else {
				return new ResponseEntity<>(
						profileService.copyCandidateProfile(profileList.get(0), date, userName, staffEmail),
						HttpStatus.OK);
			}
		}
	}

	@RequestMapping(value = { "/api/profile/setMainVersion" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> setMainVersion(@RequestBody String data) {
		try {
			return new ResponseEntity<>(profileService.setMainVersion(data), HttpStatus.OK);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
	}

	@RequestMapping(value = { "/api/profile/requestApprove" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> requestApprove(@RequestBody String data) {
		try {
			return new ResponseEntity<>(profileService.requestApprove(data), HttpStatus.OK);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		} catch (RuntimeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@RequestMapping(value = { "/api/profile/requestSubmitCandidateProfile" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> requestSubmitCandidateProfile(@RequestBody String data) {
		try {
			return new ResponseEntity<>(profileService.requestSubmitCandidateProfile(data), HttpStatus.OK);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
	}

	@RequestMapping(value = { "/api/profile/cloneNewVersion" }, method = RequestMethod.POST)
	@ResponseBody
	@ModelAttribute
	public ResponseEntity<Object> cloneNewVersion(@RequestBody Profile profile, @RequestParam("t") String token) {
		try {
			return new ResponseEntity<>(profileService.cloneNewVersion(profile, token), HttpStatus.OK);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
	}

	@RequestMapping(value = { "/api/profile/deleteVersion" }, method = RequestMethod.POST)
	@ResponseBody
	@ModelAttribute
	public ResponseEntity<Object> deleteVersion(@RequestBody Version version, @RequestParam("t") String token) {		
//		profileRepository.delete(profile);
//        List<RequestApproval> rqList = requestApprovalRepository
//                .findByVersionId(profile.getVersion().getVersionId());
//        for (int i = 0; i < rqList.size(); i++) {
//            requestApprovalRepository.delete(rqList.get(i));
//        }
		token = token.replace("Bearer ", "");
		token = StringUtils.hashString(token);
		Version foundVersion = versionRepository.findOneById(version.getVersionId());
		Profile profile = foundVersion.getProfile();
		Staff staff = staffRepository.findOneByToken(token);
		if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		if (!RoleUtil.isStaffProfileOwner(staff, profile)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
        versionRepository.delete(foundVersion);
		return new ResponseEntity<>("DELETED", HttpStatus.OK);
	}

	//@GetMapping("/api/profile/downloadProfile/{profileId}")
	@RequestMapping(value = { "/api/profile/downloadProfile/{profileId}" }, method = RequestMethod.POST)
	public ResponseEntity<Object> downloadFile(@PathVariable("profileId") String profileId, @RequestParam("tid") int templateId, @RequestParam("t") String token) {
		token = token.replace("Bearer ", "");
		token = StringUtils.hashString(token);
		
		Profile foundProfile = profileRepository.findById(Integer.parseInt(profileId)).get();
		Staff foundStaff = staffRepository.findOneByToken(token);
		
		if (foundStaff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		if (!RoleUtil.checkStaffProfileRole(foundStaff, foundProfile)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		
		Map<String, String> map = new HashMap<String, String>();
    	Enumeration<?> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
        }
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        format.setTimeZone(TimeZone.getTimeZone("UTC"));
        String today = format.format(new Date());
        Staff staff = staffRepository.findOneByUserName(map.get("username"));
        if (staff.getLatestDownloadDay()== null) {
        	staff.setDownloadCountToday(0);
        	staff.setLatestDownloadDay(new Date());
        } else
        if(!format.format(staff.getLatestDownloadDay()).equals(today)) {
        	staff.setDownloadCountToday(0);
        	staff.setLatestDownloadDay(new Date());
        }
    	if (staff.getDownloadCountToday() == maxDownload) {
    		return new ResponseEntity<>(
					new ApiMessage(HttpStatus.OK,
							"You have exceeded the maximum download limit today."),
					HttpStatus.OK); 
    	} else {
    		staff.setDownloadCountToday(staff.getDownloadCountToday()+1);
    		staff.setTotalDownload(staff.getTotalDownload()+1);
    	}        
        
        staffRepository.save(staff);
        
		List<TemplateProfile> listTemplateProfile = new ArrayList<TemplateProfile>();
		if (templateId <= 0) {
			listTemplateProfile = templateProfileRepository.findAll();
		} else {
			Optional<TemplateProfile> result = templateProfileRepository.findById(templateId);
			if (result.isPresent()) {
				listTemplateProfile.add(result.get());
			}
		}
		
		if (listTemplateProfile.size() == 0) {
			return new ResponseEntity<>(
					new ApiMessage(HttpStatus.OK,
							"Does not have any Profile Template. Please contact the Administrator for further assistance."),
					HttpStatus.OK);
		}
		TemplateProfile templateProfile = dowloadProfileService.getFile(listTemplateProfile.get(0).getTemplateId());

		Optional<Profile> profile = profileRepository.findById(Integer.parseInt(profileId));
		
		if (!RoleUtil.checkStaffProfileRole(staff, profile.get())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}

		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");		
		
		String birthday = profile.get().getBirthday() == null ? " " : simpleDateFormat.format(profile.get().getBirthday());

		ArrayList<String> introList = new ArrayList<String>(
				//Arrays.asList(new String[] { "• Name", "• Nationality", "• Sex", "• BOD", "• Marital status" }));
				Arrays.asList(new String[] { "fullName", "nationality", "gender", "birthday", "maritalStatus" }));

		ArrayList<String> introContentList = new ArrayList<String>();

		if (null != profile.get().getCandidate()) {
			introContentList = new ArrayList<String>(Arrays.asList(new String[] {
					profile.get().getCandidate().getFullName().split(" - ")[0], profile.get().getNationality(),
					profile.get().getGender(), birthday, profile.get().getMaritalStatus() }));
		} else {
			introContentList = new ArrayList<String>(Arrays.asList(new String[] {
					profile.get().getStaff().getFullName().split(" - ")[0], profile.get().getNationality(),
					profile.get().getGender(), birthday, profile.get().getMaritalStatus() }));
		}

		String newSummary = profile.get().getProfessionalSummary() == null ? " " : profile.get().getProfessionalSummary().replaceAll("<ul>|</ul>|</li>", "");

		ArrayList<String> summaryList = new ArrayList<String>(Arrays.asList(newSummary.split("<li>")));

		if (profile.isPresent()) {
			try {

				templateProfile = dowloadProfileService.writeProfileToWord(templateProfile, profile, introList,
						introContentList, summaryList);

				return new ResponseEntity<>(templateProfile, HttpStatus.OK);

			} catch (Exception e) {
				e.printStackTrace();
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
			}			
		} else {
			return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
		}
	}

	@RequestMapping(value = { "/api/home/getProfileList" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> getProfileList(@RequestBody String pagination) {
		try {
			JSONObject obj = new JSONObject(pagination);
			String token = obj.getString("token");
	        token = token.replace("Bearer ", "");
			token = StringUtils.hashString(token);
			Staff staff = staffRepository.findOneByToken(token);
			if (staff == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}
			
			if (!RoleUtil.canViewProfileList(staff)) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
			}
			
			int pageIndex = obj.getInt("page");
			int pageSize = obj.getInt("size");
			String column = obj.getString("column");
			String sort = obj.getString("sort");
			String fullName = obj.has("fullName") ? obj.getString("fullName") : "";
			String skill = obj.has("skill") ? obj.getString("skill") : "";
			String roleName = obj.has("roleName") ? obj.getString("roleName") : "";
			String language = obj.has("language") ? obj.getString("language") : "";
			String certificate = obj.has("certificate") ? obj.getString("certificate") : "";
			String type = obj.has("type") ? obj.getString("type") : "";
		
			String group = obj.has("group") ? obj.getString("group") : "";
			String du = obj.has("du") ? obj.getString("du") : "";				
					
	        Date availableTo = null;
	        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
	        if (!"".equals(obj.getString("availableTo"))) {            
	        	try {
					availableTo = dateFormat.parse(obj.getString("availableTo"));
				} catch (Exception e) {				
					e.printStackTrace();
				} 
	        }
	        
	        int yearsOfExperience = obj.has("yearsOfExperience") ? obj.getInt("yearsOfExperience") : 0;
			
			FindProfileParams params = new FindProfileParams();
			List<String> accounts = new ArrayList<String>();
			String[] fullInfo = fullName.split(",");
			for (int i = 0; i < fullInfo.length; i++) {
				String[] parts = fullInfo[i].split("\\|");
				if (parts.length == 2) {
					accounts.add(parts[1].trim());
				}
			}
			
			String fullNameParam = String.join(",", accounts);
			params.setPageIndex(pageIndex);
			params.setPageSize(pageSize);
			params.setColumn(column.trim());
			params.setSortAsc(!sort.toUpperCase().equals("DES"));
			params.setFullName(fullNameParam);
			params.setSkillName(skill.trim());
			params.setRoleName(roleName.trim());
			params.setLanguageName(language.trim());
			params.setCertificate(certificate.trim());
			params.setProfileType(type.trim());
			params.setUserGroup(group.trim());
			params.setUserDu(du.trim());				
			params.setAvailableTo(availableTo);
			params.setYearsOfExperience(yearsOfExperience);
			
			ProfileDto profileDto = profileService.getListOfProfilePagination(params);

			return new ResponseEntity<>(profileDto, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@RequestMapping(value = { "/api/home/getProfileListForDashboard" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> getProfileListForDashboard(@RequestBody String pagination) {
		try {
			JSONObject obj = new JSONObject(pagination);
			String token = obj.getString("token");
	        token = token.replace("Bearer ", "");
			token = StringUtils.hashString(token);
			Staff staff = staffRepository.findOneByToken(token);
			if (staff == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}
			
			if (!RoleUtil.canViewProfileList(staff)) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
			}
			
			int pageIndex = obj.getInt("page");
			int pageSize = obj.getInt("size");
			String column = obj.getString("column");
			String sort = obj.getString("sort");
			String fullName = obj.has("fullName") ? obj.getString("fullName") : "";
			String skill = obj.has("skill") ? obj.getString("skill") : "";
			String roleName = obj.has("roleName") ? obj.getString("roleName") : "";
			String language = obj.has("language") ? obj.getString("language") : "";
			String certificate = obj.has("certificate") ? obj.getString("certificate") : "";
			String type = obj.has("type") ? obj.getString("type") : "";
		
			String group = obj.has("group") ? obj.getString("group") : "";
			String du = obj.has("du") ? obj.getString("du") : "";				
					
	        Date availableTo = null;
	        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
	        if (!"".equals(obj.getString("availableTo"))) {            
	        	try {
					availableTo = dateFormat.parse(obj.getString("availableTo"));
				} catch (Exception e) {				
					e.printStackTrace();
				} 
	        }
	        
	        int yearsOfExperience = obj.has("yearsOfExperience") ? obj.getInt("yearsOfExperience") : 0;
			
			FindProfileParams params = new FindProfileParams();
			List<String> accounts = new ArrayList<String>();
			String[] fullInfo = fullName.split(",");
			for (int i = 0; i < fullInfo.length; i++) {
				String[] parts = fullInfo[i].split("\\|");
				if (parts.length == 2) {
					accounts.add(parts[1].trim());
				}
			}
			
			String fullNameParam = String.join(",", accounts);
			params.setPageIndex(pageIndex);
			params.setPageSize(pageSize);
			params.setColumn(column.trim());
			params.setSortAsc(!sort.toUpperCase().equals("DES"));
			params.setFullName(fullNameParam);
			params.setSkillName(skill.trim());
			params.setRoleName(roleName.trim());
			params.setLanguageName(language.trim());
			params.setCertificate(certificate.trim());
			params.setProfileType(type.trim());
			params.setUserGroup(group.trim());
			params.setUserDu(du.trim());				
			params.setAvailableTo(availableTo);
			params.setYearsOfExperience(yearsOfExperience);
			
			ProfileDto profileDto = profileService.getListOfProfileForDashboardPagination(params);

			return new ResponseEntity<>(profileDto, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

//	@RequestMapping(value = { "/api/profile/getListProfileId" }, method = RequestMethod.POST)
//	@ResponseBody
//	public ResponseEntity<Object> getListProfileId(@RequestBody String selectLike) {
//		JSONObject obj = new JSONObject(selectLike);
//		String skill = obj.getString("skill");
//		String roleName = obj.getString("roleName");
//		String language = obj.getString("language");
//		return new ResponseEntity<>(
//				profileService.getListProfileId("%" + skill + "%", "%" + roleName + "%", "%" + language + "%"),
//				HttpStatus.OK);
//	}

	@RequestMapping(value = { "/api/home/requestUpdate" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> requestUpdate(@RequestBody String idSelectedLst) {
		JSONObject obj = new JSONObject(idSelectedLst);
		String token = obj.getString("token");
        token = token.replace("Bearer ", "");
		token = StringUtils.hashString(token);
		Staff staff = staffRepository.findOneByToken(token);
		if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		if (!RoleUtil.canViewProfileList(staff)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		
		Map<String, String> map = new HashMap<String, String>();
    	Enumeration<?> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
        }
        
		JSONArray idList = obj.getJSONArray("idSelectedLst");
		String comment = obj.getString("comment");
        List<Profile> returnList = new ArrayList<Profile>();
        try {
            for (int i = 0; i < idList.length(); i++) {
                ProfileDto inDto = new ProfileDto();
                inDto.setSelectProfile(profileRepository.findOneById(inDto.getSelectedProfileId()));
                inDto.setSelectedProfileId(Integer.valueOf(idList.getInt(i)));
                new Thread(new Runnable() {
                    public void run() {
                        try {
                            emailService.sendUpdatedEmailToStaff(profileRepository.findOneById(inDto.getSelectedProfileId()), comment, map.get("username"));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }).start();
            }
            return new ResponseEntity<>(returnList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, Messages.ERROR),
                    HttpStatus.OK);
        }        
	}
	
	@RequestMapping(value = { "/api/home/getSuggestions" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> getSuggestions(@RequestBody String jsonParams) {
		try {
			JSONObject obj = new JSONObject(jsonParams);
			String type = obj.getString("type");
			String searchValue = obj.getString("searchValue");
			List<String> suggestions = profileService.getSuggestions(type, searchValue);
			return ResponseEntity.ok(suggestions);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
}