package vn.cmc.skillsheet.service.impl;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;

import vn.cmc.skillsheet.dto.ProfileDto;
import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.Certificate;
import vn.cmc.skillsheet.entity.Education;
import vn.cmc.skillsheet.entity.Language;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.ProfileCertificate;
import vn.cmc.skillsheet.entity.ProfileSkill;
import vn.cmc.skillsheet.entity.Project;
import vn.cmc.skillsheet.entity.ProjectRole;
import vn.cmc.skillsheet.entity.RequestApproval;
import vn.cmc.skillsheet.entity.School;
import vn.cmc.skillsheet.entity.Skill;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.entity.Version;
import vn.cmc.skillsheet.entity.WorkExperience;
import vn.cmc.skillsheet.logic.ProfileLogic;
import vn.cmc.skillsheet.repository.CandidateRepository;
import vn.cmc.skillsheet.repository.CertificateRepository;
import vn.cmc.skillsheet.repository.EducationRepository;
import vn.cmc.skillsheet.repository.ProfileCertificateRepository;
import vn.cmc.skillsheet.repository.ProfileRepository;
import vn.cmc.skillsheet.repository.ProfileSkillRepository;
import vn.cmc.skillsheet.repository.ProjectRoleRepository;
import vn.cmc.skillsheet.repository.RequestApprovalRepository;
import vn.cmc.skillsheet.repository.SchoolRepository;
import vn.cmc.skillsheet.repository.SkillRepository;
import vn.cmc.skillsheet.repository.StaffRepository;
import vn.cmc.skillsheet.service.DepartmentService;
import vn.cmc.skillsheet.service.EmailService;
import vn.cmc.skillsheet.service.ProfileService;
import vn.cmc.skillsheet.util.RoleUtil;
import vn.cmc.skillsheet.util.SettingItemStatus;
import vn.cmc.skillsheet.util.StringUtils;
import vn.cmc.skillsheet.vo.FindProfileParams;
import vn.cmc.skillsheet.vo.LoginUser;
import vn.cmc.skillsheet.vo.Manager;
import vn.cmc.skillsheet.vo.ProfileHome;

@Service
public class ProfileServiceImpl implements ProfileService {

	@Autowired
	private ProfileLogic profileLogic;
	
    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private ProfileCertificateRepository profileCertificateRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private ProfileSkillRepository profileSkillRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private RequestApprovalRepository requestApprovalRepository;

    @Autowired
    private ProjectRoleRepository projectRoleRepository;

    @Autowired
    private DepartmentService departmentService;
    
    @Autowired
    private HttpServletRequest request;

    @Override
    public Profile getProfileByCandidateEmail(String candidateEmail) {
//        JSONObject obj = new JSONObject(email);
//        String candidateEmail = obj.getString("candidateEmail");
        Profile foundProfile = null;
        List<Profile> candidateProfile = profileRepository.findByEmail(candidateEmail);
        if (candidateProfile.size() == 0) {
            Profile newProfile = new Profile();
            List<Candidate> candidateList = candidateRepository.findByEmail(candidateEmail);
            if (candidateList.size() == 0) {
//                Date date = new Date();
//                Candidate candidate = new Candidate();
//                // Candidate
//                newProfile.setCandidate(candidate);
//                newProfile.setEmail(candidate.getEmail());
//                newProfile.setRoleName(candidate.getRoleName());
//                // Version
//                Version version = new Version();
//                version.setCreatedDate(date);
//                version.setVersionName(candidate.getFullName());
//                version.setVersionType("Temporary");
//                newProfile.setVersion(version);
//                newProfile.setCreatedDate(date);
//                newProfile.setStatus("New");
//                return profileRepository.save(newProfile);
            	throw new IllegalArgumentException("Could not find candidate profile");
            }
            else {
            	foundProfile = candidateList.get(0).getProfiles().get(0);
            }
        }
        else {
        	foundProfile = candidateProfile.get(0);
        }
//        candidateProfile.get(0).setCandidate(candidateProfile.get(0).getCandidate());
//        candidateProfile.get(0).setVersion(candidateProfile.get(0).getVersion());
//        candidateProfile.get(0).setStaff(candidateProfile.get(0).getStaff());
//        return candidateProfile.get(0);
        return foundProfile;
    }
    
//    @Override
//    public Profile getProfileByCandidateId(int candidateId) {        
//        List<Profile> candidateProfile = profileRepository.findByCandidateId(candidateId);
//        if (candidateProfile.size() == 0) {
//            throw new IllegalArgumentException("Could not find candidate profile");
//        }        
//        return candidateProfile.get(0);
//    }

    @Override
    public Profile updateProfile(Profile profile) {
        Date date = new Date();
        profile.setUpdatedDate(date);
//        if (!profile.getStatus().equals("Submitted")) {
//        	profile.setStatus("New");
//        }
        Version version = profile.getVersion();
        version.setUpdatedDate(date);
        List<Education> eduList = profile.getEducations();
        List<WorkExperience> workExpList = profile.getWorkExperiences();
        List<Language> langList = profile.getLanguages();
        List<Project> projectList = profile.getProjects();
        List<ProfileSkill> profileSkillList = profile.getProfileSkills();
        List<ProfileCertificate> profileCertificate = profile.getProfileCertificates();
        
        for (int i = 0; i < profileSkillList.size(); i++) {
            profileSkillList.get(i).setProfile(profile);
        }
        for (int i = 0; i < profileCertificate.size(); i++) {
            profileCertificate.get(i).setProfile(profile);
        }
        for (int i = 0; i < projectList.size(); i++) {
            projectList.get(i).setProfile(profile);
            String arraySkillNames = projectList.get(i).getArraySkillNames()
                    .replaceAll(",\"isEdit\":false|,\"isAdd\":false", "");
            projectList.get(i).setArraySkillNames(arraySkillNames);
            ProjectRole projectRole = projectList.get(i).getProjectRole();
            ProjectRole checkProjectRole = projectRoleRepository
                    .findOneByName(projectRole.getName());
            if (null != checkProjectRole && checkProjectRole.getStatus() == SettingItemStatus.ACTIVE.value) {
                projectList.get(i).setProjectRole(checkProjectRole);
            } else if (null != checkProjectRole && checkProjectRole.getStatus() == SettingItemStatus.INACTIVE.value) {
//                if (!checkProjectRole.getCreateBy().contains(profile.getEmail())) {
//                    checkProjectRole
//                            .setCreateBy(checkProjectRole.getCreateBy());
//                    checkProjectRole.setUpdatedDate(date);
//                    projectList.get(i)
//                            .setProjectRole((projectRoleRepository.save(checkProjectRole)));
//                } else {
//                    projectList.get(i).setProjectRole(checkProjectRole);
//                }
            	checkProjectRole.setStatus(SettingItemStatus.NEW.value);
            	checkProjectRole.setUpdatedDate(date);
            	projectList.get(i).setProjectRole(checkProjectRole);
            } else if (null != checkProjectRole && checkProjectRole.getStatus() == SettingItemStatus.NEW.value) {
            	projectList.get(i).setProjectRole(checkProjectRole);
            } else if (null == checkProjectRole) {
            	projectRole.setStatus(SettingItemStatus.NEW.value);
                projectRole.setCreatedDate(date);
                if (profile.getStaff() != null) {
                	projectRole.setCreateBy(profile.getStaff().getUserName());
                } else {
                	projectRole.setCreateBy(profile.getCandidate().getEmail());
                }
                projectList.get(i).setProjectRole((projectRoleRepository.save(projectRole)));
            }
            // Project Skill 
            String arraySkill = projectList.get(i).getArraySkillNames();
            JSONArray arraySkillJSON = new JSONArray(arraySkill);
            for (int j = 0; j < arraySkillJSON.length(); j++) {
                JSONObject obj = (JSONObject) arraySkillJSON.get(j);
                String category = obj.getString("Category");
                JSONArray skillArray = obj.getJSONArray("Skills");
                for (int k = 0; k < skillArray.length(); k++) {
                    String skillName = skillArray.getString(k);
                    Skill checkSkill = skillRepository.findByCategoryAndName(category, skillName);
                    if (null != checkSkill && checkSkill.getStatus() == SettingItemStatus.INACTIVE.value) {
//                        if (!checkSkill.getCreateBy().contains(profile.getEmail())) {
//                            checkSkill.setCreateBy(
//                                    checkSkill.getCreateBy() + "," + profile.getEmail());
//                            checkSkill.setUpdatedDate(date);
//                            skillRepository.save(checkSkill);
//                        }
                    	checkSkill.setStatus(SettingItemStatus.NEW.value);
                    	checkSkill.setUpdatedDate(date);
                    	skillRepository.save(checkSkill);
                    }
                    if (null == checkSkill) {
                        Skill newSkill = new Skill();
                        newSkill.setStatus(SettingItemStatus.NEW.value);
                        newSkill.setCreatedDate(date);
                        if (profile.getStaff() != null) {
                        	newSkill.setCreateBy(profile.getStaff().getUserName());
                        } else {
                        	newSkill.setCreateBy(profile.getCandidate().getEmail());
                        }
                        newSkill.setCategory(category);
                        newSkill.setName(skillName);
                        skillRepository.save(newSkill);
                    }
                }
            }
        }
        for (int i = 0; i < langList.size(); i++) {
            langList.get(i).setProfile(profile);
        }
        for (int i = 0; i < workExpList.size(); i++) {
            workExpList.get(i).setProfile(profile);
        }
        for (int i = 0; i < eduList.size(); i++) {
            eduList.get(i).setProfile(profile);
            if (null == eduList.get(i).getSchool()) {
                Education edu = educationRepository.findOneById(eduList.get(i).getEducationId());
                School school = schoolRepository.findOneById(edu.getSchool().getSchoolId());
                eduList.get(i).setSchool(school);
            }
        }
        return profileRepository.save(profile);
    }

    @Override
    public Profile addProfileCertificate(String certi) throws IllegalAccessException {
        JSONObject obj = new JSONObject(certi);
        JSONArray profileCertificates = obj.getJSONArray("ProfileCertificates");
        JSONArray certificates = obj.getJSONArray("Certificates");
        int profileId = obj.getInt("ProfileId");
        String token = obj.getString("token");
        Date date = new Date();

        List<ProfileCertificate> profileCertificateList = new ArrayList<ProfileCertificate>();
        Profile profile = profileRepository.findOneById(profileId);
        
        if (!RoleUtil.checkProfileOwner(profile, token, staffRepository, candidateRepository)) {
			throw new IllegalAccessException();
		}
        
        profile.setUpdatedDate(new Date());
//        if (!profile.getStatus().equals("Submitted")) {
//        	profile.setStatus("New");
//        }
        
        Version version = profile.getVersion();
        version.setUpdatedDate(date);

        if (certificates.length() > 0) {
            for (int i = 0; i < certificates.length(); i++) {
                Object objCertificate = (Object) certificates.get(i);
                Certificate certificate = JSON.parseObject(objCertificate.toString(),
                        Certificate.class);
                JSONObject objProfileCertificate = (JSONObject)profileCertificates.get(i);
                ProfileCertificate profileCertificate = JSON
                        .parseObject(objProfileCertificate.toString(), ProfileCertificate.class);                
                DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");    	        
    	        try {
    	        	Date issuedDate = dateFormat.parse(objProfileCertificate.getString("issuedDate"));
    	        	profileCertificate.setIssuedDate(issuedDate);
				} catch (Exception e) {				
					e.printStackTrace();
				}                 
                Certificate checkCertificate = certificateRepository
                        .findByCategoryAndName(certificate.getCategory(), certificate.getName());

                if (null != checkCertificate && (checkCertificate.getStatus() == SettingItemStatus.ACTIVE.value || checkCertificate.getStatus() == SettingItemStatus.NEW.value)) {
                    profileCertificate.setCertificate(checkCertificate);
                } else if (null != checkCertificate && checkCertificate.getStatus() == SettingItemStatus.INACTIVE.value) {

//                    if (!checkCertificate.getCreateBy().contains(profile.getEmail())) {
//                        checkCertificate.setCreateBy(
//                                checkCertificate.getCreateBy() + "," + profile.getEmail());
//                        checkCertificate.setUpdatedDate(date);
//                        profileCertificate
//                                .setCertificate(certificateRepository.save(checkCertificate));
//                    } else {
//                        profileCertificate.setCertificate(checkCertificate);
//                    }
                	checkCertificate.setStatus(SettingItemStatus.NEW.value);
                	checkCertificate.setUpdatedDate(date);
                	profileCertificate.setCertificate(certificateRepository.save(checkCertificate));

                } else if (null == checkCertificate) {
                    certificate.setStatus(SettingItemStatus.NEW.value);
                    certificate.setCreatedDate(date);
                    if (profile.getStaff() != null) {
                    	certificate.setCreateBy(profile.getStaff().getUserName());
                    } else {
                    	certificate.setCreateBy(profile.getCandidate().getEmail());
                    }
                    profileCertificate.setCertificate(certificateRepository.save(certificate));
                }
                profileCertificate.setUpdatedDate(date);
                profileCertificate.setProfile(profile);
                
                profileCertificateList.add(profileCertificate);
            }
        }

        profile.setProfileCertificates(profileCertificateList);

        return profileRepository.save(profile);
    }

    @Override
    public Profile updateProfileCertificate(String certi) throws IllegalAccessException {
        JSONObject obj = new JSONObject(certi);
        JSONArray profileCertificates = obj.getJSONArray("ProfileCertificates");
        JSONArray certificates = obj.getJSONArray("Certificates");
        String category = obj.getString("Category");
        int profileId = obj.getInt("ProfileId");
        String token = obj.getString("token");
        Date date = new Date();

        List<ProfileCertificate> profileCertificateList = new ArrayList<ProfileCertificate>();

        Profile profile = profileRepository.findOneById(profileId);
        
        if (!RoleUtil.checkProfileOwner(profile, token, staffRepository, candidateRepository)) {
			throw new IllegalAccessException();
		}
        
        profile.setUpdatedDate(new Date());
//        if (!profile.getStatus().equals("Submitted")) {
//        	profile.setStatus("New");
//        }
        
        Version version = profile.getVersion();
        version.setUpdatedDate(date);

        List<Integer> profileCertificateIds = new ArrayList<Integer>();
        List<Integer> deleteprofileCertificateIds = new ArrayList<Integer>();

        if (certificates.length() > 0) {
            for (int i = 0; i < certificates.length(); i++) {
                Object objCertificate = (Object) certificates.get(i);
                Certificate certificate = JSON.parseObject(objCertificate.toString(),
                        Certificate.class);
                JSONObject objProfileCertificate = (JSONObject)profileCertificates.get(i);
//                Object objProfileCertificates = (Object) profileCertificates.get(i);
                ProfileCertificate profileCertificate = JSON
                        .parseObject(objProfileCertificate.toString(), ProfileCertificate.class);
                if (profileCertificate.getProfileCertificateId() != 0) {
                    profileCertificateIds.add(profileCertificate.getProfileCertificateId());
                }
                DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");    	        
    	        try {
    	        	Date issuedDate = dateFormat.parse(objProfileCertificate.getString("issuedDate"));
    	        	profileCertificate.setIssuedDate(issuedDate);
				} catch (Exception e) {				
					e.printStackTrace();
				}                 
                Certificate checkCertificate = certificateRepository
                        .findByCategoryAndName(certificate.getCategory(), certificate.getName());

                if (null != checkCertificate && (checkCertificate.getStatus() == SettingItemStatus.ACTIVE.value || checkCertificate.getStatus() == SettingItemStatus.NEW.value)) {
                    profileCertificate.setCertificate(checkCertificate);
                } else if (null != checkCertificate && checkCertificate.getStatus() == SettingItemStatus.INACTIVE.value) {
//                    if (!checkCertificate.getCreateBy().contains(profile.getEmail())) {
//                        checkCertificate.setCreateBy(
//                                checkCertificate.getCreateBy() + "," + profile.getEmail());
//                        checkCertificate.setUpdatedDate(date);
//                        profileCertificate
//                                .setCertificate(certificateRepository.save(checkCertificate));
//                    } else {
//                        profileCertificate.setCertificate(checkCertificate);
//                    }
                	checkCertificate.setStatus(SettingItemStatus.NEW.value);
                	checkCertificate.setUpdatedDate(date);
                	profileCertificate.setCertificate(certificateRepository.save(checkCertificate));
                } else if (null == checkCertificate) {
                    certificate.setStatus(SettingItemStatus.NEW.value);
                    certificate.setCreatedDate(date);
                    if (profile.getStaff() != null) {
                    	certificate.setCreateBy(profile.getStaff().getUserName());
                    } else {
                    	certificate.setCreateBy(profile.getCandidate().getEmail());
                    }
                    profileCertificate.setCertificate(certificateRepository.save(certificate));
                }
                profileCertificate.setUpdatedDate(date);
                profileCertificate.setProfile(profile);
                profileCertificateList.add(profileCertificate);
            }
        }

        for (int i = 0; i < profile.getProfileCertificates().size(); i++) {
            if (!profileCertificateIds
                    .contains(profile.getProfileCertificates().get(i).getProfileCertificateId())) {
                deleteprofileCertificateIds
                        .add(profile.getProfileCertificates().get(i).getProfileCertificateId());
            }
        }

        profile.setProfileCertificates(profileCertificateList);

        profileRepository.save(profile);

        for (int i = 0; i < deleteprofileCertificateIds.size(); i++) {
            ProfileCertificate profileCertificate = profileCertificateRepository
                    .findOneById(deleteprofileCertificateIds.get(i));
            if (category.equals(profileCertificate.getCertificate().getCategory())) {
                profileCertificateRepository.delete(profileCertificate);
            }
        }
        return profile;
    }

    @Override
    public Profile addProfileSkill(String skill_l) throws IllegalAccessException {
        JSONObject obj = new JSONObject(skill_l);
        JSONArray skills = obj.getJSONArray("Skills");
        JSONArray profileSkills = obj.getJSONArray("ProfileSkills");
        int profileId = obj.getInt("ProfileId");
        String token = obj.getString("token");
        Date date = new Date();

        List<ProfileSkill> profileSkillList = new ArrayList<ProfileSkill>();

        Profile profile = profileRepository.findOneById(profileId);
        
        if (!RoleUtil.checkProfileOwner(profile, token, staffRepository, candidateRepository)) {
			throw new IllegalAccessException();
		}
        
        profile.setUpdatedDate(new Date());
//        if (!profile.getStatus().equals("Submitted")) {
//        	profile.setStatus("New");
//        }
        
        Version version = profile.getVersion();
        version.setUpdatedDate(date);
        

        if (skills.length() > 0) {
            for (int i = 0; i < skills.length(); i++) {
                Object objSkill = (Object) skills.get(i);
                Skill skill = JSON.parseObject(objSkill.toString(), Skill.class);
                Object objProfileSkill = (Object) profileSkills.get(i);
                ProfileSkill profileSkill = JSON.parseObject(objProfileSkill.toString(),
                        ProfileSkill.class);
                Skill checkSkill = skillRepository.findByCategoryAndName(skill.getCategory(),
                        skill.getName());;
                if (skill.getCategory() == null) {
//                	List<Skill> checkSkillList = skillRepository.findByName(skill.getName());
                	if (skillRepository.findByName(skill.getName()).size() != 0) {
                		checkSkill = skillRepository.findByName(skill.getName()).get(0);
                	}
                } else {
                	checkSkill = skillRepository.findByCategoryAndName(skill.getCategory(),
                            skill.getName());
                }

                if (null != checkSkill && (checkSkill.getStatus() == SettingItemStatus.ACTIVE.value || checkSkill.getStatus() == SettingItemStatus.NEW.value)) {
                    profileSkill.setSkill(checkSkill);
                } else if (null != checkSkill && checkSkill.getStatus() == SettingItemStatus.INACTIVE.value) {

//                    if (!checkSkill.getCreateBy().contains(profile.getEmail())) {
//                        checkSkill.setCreateBy(checkSkill.getCreateBy());
//                        checkSkill.setUpdatedDate(date);
//                        checkSkill.setStatus(SettingItemStatus.NEW.value);
//                        profileSkill.setSkill(skillRepository.save(checkSkill));
//                    } else {
//                        profileSkill.setSkill(checkSkill);
//                    }
					checkSkill.setUpdatedDate(date);
					checkSkill.setStatus(SettingItemStatus.NEW.value);
					profileSkill.setSkill(skillRepository.save(checkSkill));
                } else if (null == checkSkill) {
                    skill.setStatus(SettingItemStatus.NEW.value);
                    skill.setCreatedDate(date);
                    if (skill.getCategory() == null) {
                    	skill.setCategory("Unknown");
                    }
                    if (profile.getStaff() != null) {
                    	skill.setCreateBy(profile.getStaff().getUserName());
                    } else {
                    	skill.setCreateBy(profile.getCandidate().getEmail());
                    }
                    profileSkill.setSkill(skillRepository.save(skill));
                }
                profileSkill.setUpdatedDate(date);
                profileSkill.setProfile(profile);
                profileSkillList.add(profileSkill);
            }

        }

        profile.setProfileSkills(profileSkillList);

        return profileRepository.save(profile);
    }

    @Override
    public Profile updateProfileSkill(String skill_l) throws IllegalAccessException {
        JSONObject obj = new JSONObject(skill_l);
        JSONArray skills = obj.getJSONArray("Skills");
        JSONArray profileSkills = obj.getJSONArray("ProfileSkills");
        String category = obj.getString("Category");
        int profileId = obj.getInt("ProfileId");
        String token = obj.getString("token");
        Date date = new Date();

        List<ProfileSkill> profileSkillList = new ArrayList<ProfileSkill>();

        Profile profile = profileRepository.findOneById(profileId);
        
        if (!RoleUtil.checkProfileOwner(profile, token, staffRepository, candidateRepository)) {
			throw new IllegalAccessException();
		}
        
        profile.setUpdatedDate(date);
//        if (!profile.getStatus().equals("Submitted")) {
//        	profile.setStatus("New");
//        }
        
        Version version = profile.getVersion();
        version.setUpdatedDate(date);

        List<Integer> profileSkillIds = new ArrayList<Integer>();
        List<Integer> deleteprofileSkillIds = new ArrayList<Integer>();
        
        if (skills.length() > 0) {
            for (int i = 0; i < skills.length(); i++) {
                Object objSkill = (Object) skills.get(i);
                Skill skill = JSON.parseObject(objSkill.toString(), Skill.class);
                Object objProfileSkill = (Object) profileSkills.get(i);
                ProfileSkill profileSkill = JSON.parseObject(objProfileSkill.toString(),
                        ProfileSkill.class);

                Skill checkSkill = skillRepository.findByCategoryAndName(skill.getCategory(),
                        skill.getName());

                if (profileSkill.getProfileSkillId() != 0) {
                    profileSkillIds.add(profileSkill.getProfileSkillId());
                }

                if (null != checkSkill && checkSkill.getStatus() == SettingItemStatus.ACTIVE.value) {
                    profileSkill.setSkill(checkSkill);
                } else if (null != checkSkill && checkSkill.getStatus() == SettingItemStatus.INACTIVE.value) {

//                    if (!checkSkill.getCreateBy().contains(profile.getEmail())) {
//                        checkSkill.setCreateBy(checkSkill.getCreateBy() + "," + profile.getEmail());
//                        checkSkill.setUpdatedDate(date);
//                        profileSkill.setSkill(skillRepository.save(checkSkill));
//                    } else {
//                        profileSkill.setSkill(checkSkill);
//                    }
                	checkSkill.setStatus(SettingItemStatus.NEW.value);;
                    checkSkill.setUpdatedDate(date);
                    profileSkill.setSkill(skillRepository.save(checkSkill));
                } else if (null != checkSkill && checkSkill.getStatus() == SettingItemStatus.NEW.value) {
                	profileSkill.setSkill(checkSkill);
                } else if (null == checkSkill) {
                    skill.setStatus(SettingItemStatus.NEW.value);
                    skill.setCreatedDate(date);
                    if (profile.getStaff() != null) {
                    	skill.setCreateBy(profile.getStaff().getUserName());
                    } else {
                    	skill.setCreateBy(profile.getCandidate().getEmail());
                    }
                    profileSkill.setSkill(skillRepository.save(skill));
                }
                profileSkill.setUpdatedDate(date);
                profileSkill.setProfile(profile);
                profileSkillList.add(profileSkill);
            }
        }

        for (int i = 0; i < profile.getProfileSkills().size(); i++) {
            if (!profileSkillIds.contains(profile.getProfileSkills().get(i).getProfileSkillId())) {
                deleteprofileSkillIds.add(profile.getProfileSkills().get(i).getProfileSkillId());
            }
        }

        profile.setProfileSkills(profileSkillList);

        profileRepository.save(profile);

        for (int i = 0; i < deleteprofileSkillIds.size(); i++) {
            ProfileSkill profileSkill = profileSkillRepository
                    .findOneById(deleteprofileSkillIds.get(i));
            if (category.equals(profileSkill.getSkill().getCategory())) {
                profileSkillRepository.delete(profileSkill);
            }
        }
        return profile;
    }

    @Override
    public Profile createFirstStaffProfile(LoginUser loginUser, String token) throws IllegalAccessException {
    	JSONObject obj = new JSONObject(loginUser);
    	token = token.replace("Bearer ", "");
		token = token.replace("FAKE-", "");
		token = StringUtils.hashString(token);
		Staff foundStaff = staffRepository.findOneByToken(token);
		if (foundStaff == null) {
			throw new IllegalAccessException();
		}
		if (!foundStaff.getUserName().equals(loginUser.getUserName())) {
			throw new IllegalAccessException();
		}
        Date date = new Date();
//        Staff foundStaff = staffRepository.findOneByUserName(loginUser.getUserName());
        Profile profile = new Profile();   
        
//        if (null == foundStaff) {
//        	Staff newStaff = new Staff();
//            newStaff.setUserName(loginUser.getUserName());
//            newStaff.setEmail(loginUser.getEmail());
//            newStaff.setFullName(loginUser.getFullName());
//            newStaff.setCreatedDate(date);            
//            Staff staffed = staffRepository.save(newStaff);
//            profile.setStaff(staffed);
//        } else {
        	List<Profile> foundProfiles = profileRepository.findByEmail(foundStaff.getEmail());
        	if (foundProfiles.size() > 0) {        		
        		return foundProfiles.get(0);
        	}
            profile.setStaff(foundStaff);
//        }

        Version version = new Version();
        version.setCreatedDate(date);
        version.setVersionName("First Version");
        profile.setEmail(loginUser.getEmail());
        if (loginUser.getDateOfBirth() != null) {
        	try {
        		profile.setBirthday(new Date(loginUser.getDateOfBirth()));
			} catch (Exception e) {
				e.printStackTrace();
			}
        	
        }
        
        profile.setVersion(version);
        profile.setCreatedDate(date);
        profile.setStatus("New");

        return profileRepository.save(profile);
    }

    @Override
    public Profile setMainVersion(String data) throws IllegalAccessException {
        JSONObject jsonData = new JSONObject(data);
        String du = jsonData.getString("du");
        String group = jsonData.has("group") ? jsonData.getString("group") : "";
        String fullName = jsonData.getString("fullName");
        String userName = jsonData.getString("userName");
        int profileId = jsonData.getInt("profileId");
        String token = jsonData.getString("token");
        token = token.replace("Bearer ", "");
		token = StringUtils.hashString(token);

        Profile profile = profileRepository.findOneById(profileId);
        Staff staff = staffRepository.findOneByToken(token);
        
        if (!RoleUtil.isStaffProfileOwner(staff, profile)) {
        	throw new IllegalAccessException();
        }

        List<Profile> profileList = profileRepository.findByEmail(profile.getEmail());
        for (int i = 0; i < profileList.size(); i++) {
            if ("Main".equals(profileList.get(i).getVersion().getVersionType())
                    && profileList.get(i).getProfileId() != profile.getProfileId()) {
                profileList.get(i).getVersion().setVersionType("Temporary");
//                profileList.get(i).setStatus("New");
                profileRepository.save(profileList.get(i));
            }
        }

        profile.getVersion().setVersionType("Main");
//        profile.setStatus("Submitted");

        profile = profileRepository.save(profile);        

//        Manager manager = departmentService
//                .getManagerByDu(departmentService.getListDepartment(), du);
        
//        if (manager == null) {
//        	throw new RuntimeException("Could not find manager: DU: " + du + "; Group: " + group);
//        }
//        
//        RequestApproval requestApproval = new RequestApproval();
//        requestApproval.setCreatedDate(new Date());
//        requestApproval.setSubmittedDate(new Date());
//        requestApproval.setGroup(group);
//        requestApproval.setDu(du);
//        requestApproval.setFullName(fullName);
//        requestApproval.setEmail(profile.getEmail());
//        requestApproval.setRoleName(profile.getRoleName());
//        requestApproval.setStatus(profile.getStatus());
//        requestApproval.setVersion(profile.getVersion());
//        requestApproval.setUserName(userName);
//        requestApproval.setPicEmail(manager.getEmail());
//        RequestApproval savedRequestApproval = requestApprovalRepository.save(requestApproval);
//        int id = savedRequestApproval.getRequestApprovalId();
        
        // for saving logs
        Map<String, String> map = new HashMap<String, String>();
        Enumeration headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
        }

//		new Thread(new Runnable() {
//			public void run() {
//				try {
////					emailService.sendRequestApproveToPIC(manager.getEmail(), manager.getFullName(),
////							requestApprovalRepository.findOneById(id));
//					// TODO: đổi thành email của manager khi go live (uat?)
//					emailService.sendRequestApproveToPIC("thlan@cmc.com.vn", manager.getFullName(),
//							requestApprovalRepository.findOneById(id), map.get("username"));
//				} catch (Exception e) {
//					e.printStackTrace();
//				}
//			}
//		}).start();

        return profile;
    }

    @Override
    public Profile requestApprove(String data) throws IllegalAccessException {
        JSONObject jsonData = new JSONObject(data);
        String du = jsonData.getString("du");
        String group = jsonData.getString("group");
        String fullName = jsonData.getString("fullName");
        String userName = jsonData.getString("userName");
        int profileId = jsonData.getInt("profileId");
        
        String token = jsonData.getString("token");
        token = token.replace("Bearer ", "");
		token = StringUtils.hashString(token);
		
        Staff staff = staffRepository.findOneByToken(token);
        Profile profile = profileRepository.findOneById(profileId);
        
        if (!RoleUtil.isStaffProfileOwner(staff, profile)) {
        	throw new IllegalAccessException();
        }
        
        // PIC LA DU LEAD ....
        Manager manager = departmentService
                .getManagerByDu(departmentService.getListDepartment(), du);

        if (manager == null) {
        	throw new RuntimeException("Could not find manager: DU: " + du + "; Group: " + group);
        }

        profile.setStatus("Submitted");

        profile = profileRepository.save(profile);

        RequestApproval requestApproval = new RequestApproval();
        requestApproval.setCreatedDate(new Date());
        requestApproval.setSubmittedDate(new Date());
        requestApproval.setGroup(group);
        requestApproval.setDu(du);
        requestApproval.setFullName(fullName);
        requestApproval.setEmail(profile.getEmail());
        requestApproval.setRoleName(profile.getRoleName());
        requestApproval.setStatus(profile.getStatus());
        requestApproval.setVersion(profile.getVersion());
        requestApproval.setUserName(userName);
        requestApproval.setPicEmail(manager.getEmail());

        RequestApproval savedRequestApproval = requestApprovalRepository.save(requestApproval);
        
        
        int id = savedRequestApproval.getRequestApprovalId();
        
        // for saving logs
        Map<String, String> map = new HashMap<String, String>();
        Enumeration<?> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
        }

		new Thread(new Runnable() {
			public void run() {
				try {
					System.out.println("Sending email to: " + manager.getFullName() + " (" + manager.getEmail() + ")" );
					emailService.sendRequestApproveToPIC(manager.getEmail(), manager.getFullName(),
							requestApprovalRepository.findOneById(id), map.get("username"));
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}).start();

        return profile;
    }

    @Override
    public Profile requestSubmitCandidateProfile(String data) throws IllegalAccessException {
    	JSONObject jsonData = new JSONObject(data);
    	int profileId = jsonData.getInt("profileId");
    	String token = jsonData.getString("token");
        token = token.replace("Bearer ", "");
        token = token.replace("FAKE-", "");
		token = StringUtils.hashString(token);
		
        Candidate candidate = candidateRepository.findOneByToken(token);
        Profile profile = profileRepository.findOneById(profileId);
        
        if (!RoleUtil.isCandidateProfileOwner(candidate, profile)) {
        	throw new IllegalAccessException();
        }
        
        profile.setStatus("Submitted");
        profile = profileRepository.save(profile);
        
        

//        RequestApproval requestApproval = new RequestApproval();
//        requestApproval.setCreatedDate(new Date());
//        requestApproval.setSubmittedDate(new Date());
//        requestApproval.setGroup("");
//        requestApproval.setDu("");
//        requestApproval.setFullName(jsonO.getString("fullName"));
//        requestApproval.setEmail(profile.getEmail());
//        requestApproval.setRoleName(profile.getRoleName());
//        requestApproval.setStatus(profile.getStatus());
//        requestApproval.setVersion(savedProfile.getVersion());
//
//        RequestApproval savedRequestApproval = requestApprovalRepository.save(requestApproval);
//
//        savedRequestApproval.setVersion(profile.getVersion());
//        savedRequestApproval = requestApprovalRepository.save(savedRequestApproval);

        // PIC LA HR ....
        List<Candidate> candiList = candidateRepository.findByEmail(profile.getEmail());
        if (candiList.size() == 0) {
        	throw new IllegalArgumentException("Invalid email: " + profile.getEmail());
        }
        
        Candidate candi = candiList.get(0);
        candi.setStatus("active");
        Candidate savedCandidate = candidateRepository.save(candi);

        String recruiterUserName = candi.getCreateBy().split(",")[0];
        Staff recruiter = staffRepository.findOneByUserName(recruiterUserName);
        String recruiterEmail = recruiter.getEmail();
        

//        int id = savedRequestApproval.getRequestApprovalId();
        
        Map<String, String> map = new HashMap<String, String>();
        Enumeration<?> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
        }

        new Thread(new Runnable() {
            public void run() {
                try {
                	emailService.notificationSubmittedToCandidate(candi.getEmail(), candi.getFullName(), map.get("username"));  
                	emailService.sendEmailNotificationForRecruiter(recruiterEmail, recruiter.getFullName(), candi.getFullName(), map.get("username"));  
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();

        return profile;
    }

    @Override
    public Profile cloneNewVersion(Profile profile, String token) throws IllegalAccessException {
    	token = token.replace("Bearer ", "");
		token = StringUtils.hashString(token);
		
        Staff staff = staffRepository.findOneByToken(token);
        
        if (!RoleUtil.isStaffProfileOwner(staff, profile)) {
        	throw new IllegalAccessException();
        }
        
        Date date = new Date();

        Version version = new Version();
        version.setCreatedDate(date);
        version.setOriginalVersion(profile.getVersion().getVersionName());
        version.setVersionName("[" + profile.getVersion().getVersionName() + "]" + " Clone");
        version.setVersionType("Temporary");

        Profile copyProfile = new Profile();
        copyProfile.setCreatedDate(date);
        copyProfile.setVersion(version);
        copyProfile.setAvatar(profile.getAvatar());
        copyProfile.setBirthday(profile.getBirthday());
        copyProfile.setEmail(profile.getEmail());
        copyProfile.setGender(profile.getGender());
        copyProfile.setRoleName(profile.getRoleName());
        copyProfile.setPhone(profile.getPhone());
        copyProfile.setMaritalStatus(profile.getMaritalStatus());
        copyProfile.setNationality(profile.getNationality());
        copyProfile.setObjective(profile.getObjective());
        copyProfile.setPersionalInteresting(profile.getPersionalInteresting());
        copyProfile.setProfessionalSummary(profile.getProfessionalSummary());
        copyProfile.setStatus("New");

        copyProfile = profileRepository.save(copyProfile);

        copyProfile.setStaff(profile.getStaff());

        copyProfile.setEducations(
                copyEducations(profile.getEducations(), new ArrayList<Education>(), copyProfile));

        copyProfile.setLanguages(
                copyLanguages(profile.getLanguages(), new ArrayList<Language>(), copyProfile));

        copyProfile.setProjects(
                copyProjects(profile.getProjects(), new ArrayList<Project>(), copyProfile));

        copyProfile.setWorkExperiences(copyWorkExperiences(profile.getWorkExperiences(),
                new ArrayList<WorkExperience>(), copyProfile));

        copyProfile.setProfileSkills(copyProfileSkills(profile.getProfileSkills(),
                new ArrayList<ProfileSkill>(), copyProfile));

        copyProfile.setProfileCertificates(copyProfileCertificates(profile.getProfileCertificates(),
                new ArrayList<ProfileCertificate>(), copyProfile));

        return profileRepository.save(copyProfile);
    }

    @Override
    public Profile copyCandidateProfile(Profile originalProfile, Date date,
            String userName, String staffEmail) {
    	List<Candidate> candidateList = candidateRepository.findByEmail(originalProfile.getEmail());
    	if (candidateList.size() != 0) {
    		candidateList.get(0).setStatus("Contracted");
    	}
        Staff staff = staffRepository.findOneByUserName(userName);
        if (staff == null) {
        	staff = new Staff();
        	staff.setCreatedDate(date);
            staff.setFullName(userName);
            staff.setUserName(userName);
            staff.setEmail(staffEmail);
        }
        
        originalProfile.setStaff(staffRepository.save(staff));
        originalProfile.setEmail(staffEmail);
        originalProfile.setStatus("New");
//        Version version = new Version();
//        version.setCreatedDate(date);
//        version.setOriginalVersion(originalProfile.getVersion().getVersionName());
//        version.setVersionName(
//                "[" + originalProfile.getVersion().getVersionName() + "]" + " Clone");
//        version.setVersionType("Temporary");
//
//        Profile copyProfile = new Profile();
//        copyProfile.setStaff(staffRepository.save(staff));
//        copyProfile.setCreatedDate(date);
//        copyProfile.setVersion(version);
//        copyProfile.setAvatar(originalProfile.getAvatar());
//        copyProfile.setBirthday(originalProfile.getBirthday());
//        copyProfile.setEmail(staffEmail);
//        copyProfile.setRoleName(originalProfile.getRoleName());
//        copyProfile.setGender(originalProfile.getGender());
//        copyProfile.setPhone(originalProfile.getPhone());
//        copyProfile.setMaritalStatus(originalProfile.getMaritalStatus());
//        copyProfile.setNationality(originalProfile.getNationality());
//        copyProfile.setObjective(originalProfile.getObjective());
//        copyProfile.setPersionalInteresting(originalProfile.getPersionalInteresting());
//        copyProfile.setProfessionalSummary(originalProfile.getProfessionalSummary());
//        copyProfile.setStatus("New");
//
//        copyProfile = profileRepository.save(copyProfile);
//
//        copyProfile.setEducations(copyEducations(originalProfile.getEducations(),
//                new ArrayList<Education>(), copyProfile));
//
//        copyProfile.setLanguages(copyLanguages(originalProfile.getLanguages(),
//                new ArrayList<Language>(), copyProfile));
//
//        copyProfile.setProjects(
//                copyProjects(originalProfile.getProjects(), new ArrayList<Project>(), copyProfile));
//
//        copyProfile.setWorkExperiences(copyWorkExperiences(originalProfile.getWorkExperiences(),
//                new ArrayList<WorkExperience>(), copyProfile));
//
//        copyProfile.setProfileSkills(copyProfileSkills(originalProfile.getProfileSkills(),
//                new ArrayList<ProfileSkill>(), copyProfile));
//
//        copyProfile.setProfileCertificates(
//                copyProfileCertificates(originalProfile.getProfileCertificates(),
//                        new ArrayList<ProfileCertificate>(), copyProfile));

        return profileRepository.save(originalProfile);
    }

    private List<Education> copyEducations(List<Education> eduList, List<Education> copyEdulist,
            Profile copyProfile) {
        for (int i = 0; i < eduList.size(); i++) {
            Education edu = new Education();
            edu.setFromMonth(eduList.get(i).getFromMonth());
            edu.setToMonth(eduList.get(i).getToMonth());
            edu.setGrade(eduList.get(i).getGrade());
            edu.setSubject(eduList.get(i).getSubject());
            edu.setQualification(eduList.get(i).getQualification());
            edu.setAchievement(eduList.get(i).getAchievement());
            edu.setCreatedDate(eduList.get(i).getCreatedDate());
            edu.setUpdatedDate(eduList.get(i).getUpdatedDate());
            edu.setSchool(eduList.get(i).getSchool());
            edu.setProfile(copyProfile);
            copyEdulist.add(edu);
        }
        return copyEdulist;
    }

    private List<Language> copyLanguages(List<Language> langList, List<Language> copyLangList,
            Profile copyProfile) {
        for (int i = 0; i < langList.size(); i++) {
            Language lang = new Language();
            lang.setName(langList.get(i).getName());
            lang.setLevel(langList.get(i).getLevel());
            lang.setNote(langList.get(i).getNote());
            lang.setCreatedDate(langList.get(i).getCreatedDate());
            lang.setUpdatedDate(langList.get(i).getUpdatedDate());
            lang.setProfile(copyProfile);
            copyLangList.add(lang);
        }
        return copyLangList;
    }

    private List<Project> copyProjects(List<Project> proList, List<Project> copyProList,
            Profile copyProfile) {
        for (int i = 0; i < proList.size(); i++) {
            Project pro = new Project();
            pro.setTitle(proList.get(i).getTitle());
            pro.setClient(proList.get(i).getClient());
            pro.setFromMonth(proList.get(i).getFromMonth());
            pro.setToMonth(proList.get(i).getToMonth());
            pro.setTeamSize(proList.get(i).getTeamSize());
            pro.setDescription(proList.get(i).getDescription());
            pro.setResponsibilities(proList.get(i).getResponsibilities());
            pro.setArraySkillNames(proList.get(i).getArraySkillNames());
            pro.setCreatedDate(proList.get(i).getCreatedDate());
            pro.setUpdatedDate(proList.get(i).getUpdatedDate());
            pro.setProjectRole(proList.get(i).getProjectRole());
            pro.setProfile(copyProfile);
            copyProList.add(pro);
        }
        return copyProList;
    }

    private List<WorkExperience> copyWorkExperiences(List<WorkExperience> weList,
            List<WorkExperience> copyWeList, Profile copyProfile) {
        for (int i = 0; i < weList.size(); i++) {
            WorkExperience we = new WorkExperience();
            we.setPosition(weList.get(i).getPosition());
            we.setFromMonth(weList.get(i).getFromMonth());
            we.setToMonth(weList.get(i).getToMonth());
            we.setDescription(weList.get(i).getDescription());
            we.setCompany(weList.get(i).getCompany());
            we.setCreatedDate(weList.get(i).getCreatedDate());
            we.setUpdatedDate(weList.get(i).getUpdatedDate());
            we.setProfile(copyProfile);
            copyWeList.add(we);
        }
        return copyWeList;
    }

    private List<ProfileSkill> copyProfileSkills(List<ProfileSkill> psList,
            List<ProfileSkill> copyPsList, Profile copyProfile) {
        for (int i = 0; i < psList.size(); i++) {
            ProfileSkill ps = new ProfileSkill();
            ps.setProject(psList.get(i).getProject());
            ps.setLevel(psList.get(i).getLevel());
            ps.setYearOfExperiences(psList.get(i).getYearOfExperiences());
            ps.setLastUsed(psList.get(i).getLastUsed());
            ps.setBestSkill(psList.get(i).getBestSkill());
            ps.setCreatedDate(psList.get(i).getCreatedDate());
            ps.setUpdatedDate(psList.get(i).getUpdatedDate());
            ps.setSkill(psList.get(i).getSkill());
            ps.setProfile(copyProfile);
            copyPsList.add(ps);
        }
        return copyPsList;
    }

    private List<ProfileCertificate> copyProfileCertificates(List<ProfileCertificate> pcList,
            List<ProfileCertificate> copyPcList, Profile copyProfile) {
        for (int i = 0; i < pcList.size(); i++) {
            ProfileCertificate pc = new ProfileCertificate();
            pc.setIssuedDate(pcList.get(i).getIssuedDate());
            pc.setAchievement(pcList.get(i).getAchievement());
            pc.setCreatedDate(pcList.get(i).getCreatedDate());
            pc.setUpdatedDate(pcList.get(i).getUpdatedDate());
            pc.setCertificate(pcList.get(i).getCertificate());
            pc.setProfile(copyProfile);
            copyPcList.add(pc);
        }
        return copyPcList;
    }

//    @Override
//    public ProfileDto getListOfProfilePagination(int page, int size, String column, String sort,
//            String skillName, String roleName, String languageName) {
//        ProfileDto profileDto = new ProfileDto();
//        String sortColumn = "profile_id";
//        if ("fullName".equals(column))
//            sortColumn = "full_name";
//        else if ("account".equals(column))
//            sortColumn = "account";
//        else if ("roleName".equals(column))
//            sortColumn = "role_name";
//        else if ("groupSkills".equals(column))
//            sortColumn = "group_skills";
//        else if ("groupLanguages".equals(column))
//            sortColumn = "group_languages";
//        else if ("groupCertificates".equals(column))
//            sortColumn = "group_certificates";
//        else if ("type".equals(column))
//            sortColumn = "type";
//        else if ("status".equals(column))
//            sortColumn = "status";
//        else if ("du".equals(column))
//            sortColumn = "du";
//        else if ("staffGroup".equals(column))
//            sortColumn = "staff_group";
//
//        String sortDirec = "ASC";
//        if ("DES".equals(sort))
//            sortDirec = "DESC";
//
//        PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by(
//                "ASC".equals(sortDirec) ? Sort.Direction.ASC : Sort.Direction.DESC, sortColumn));
//
//        Page<Object> pageCandidate = null;
//
//        pageCandidate = profileRepository.findAllProfilePegeable("%" + skillName + "%",
//                "%" + roleName + "%", "%" + languageName + "%", pageRequest);
//
//        List<Object> profiles = pageCandidate.getContent();
//
//        List<ProfileHome> profileHomes = new ArrayList<>();
//
//        for (Iterator<Object> it = profiles.iterator(); it.hasNext();) {
//            Object[] object = (Object[]) it.next();
//            try {
//                ProfileHome profileHome = new ProfileHome((int) object[0], (String) object[1],
//                        (String) object[2], (String) object[3], (String) object[4],
//                        (String) object[5], (String) object[6], (String) object[7],
//                        (String) object[8], (String) object[9], (String) object[10], (String) object[11]);
//                profileHomes.add(profileHome);
//            } catch (Exception e) {
//                System.out.println((Integer) object[0]);
//            }
//        }
//
//        profileDto.setProfileHomes(profileHomes);
//
//        profileDto.setTotalElements(pageCandidate.getTotalElements());
//
//        return profileDto;
//
//    }
    
    @Override
    public ProfileDto getListOfProfilePagination(FindProfileParams params) {
        ProfileDto profileDto = new ProfileDto();
        System.out.println("Finding params: " + params);
        DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");

        String availableTo = null;
        if (params.getAvailableTo() != null) {
        	availableTo = dateFormat.format(params.getAvailableTo());
        }
        
        List<Object> profiles = profileRepository.findProfile(
        		params.getFullName(),
        		params.getSkillName(), 
        		params.getRoleName(), 
        		params.getLanguageName(),
        		params.getCertificate(),
        		params.getProfileType(),
        		params.getUserGroup(),
        		params.getUserDu(),        		        		
        		availableTo, 
        		params.getYearsOfExperience(),
        		params.getPageIndex() - 1,
        		params.getPageSize());

        List<ProfileHome> profileHomes = new ArrayList<>();
        //SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");

        for (Iterator<Object> it = profiles.iterator(); it.hasNext();) {
            Object[] object = (Object[]) it.next();
            try {
                ProfileHome profileHome = new ProfileHome((int) object[0], (String) object[1],
                        (String) object[2], (String) object[3], (String) object[4],
                        (String) object[5], (String) object[6], (String) object[7],
                        (String) object[8], (String) object[9], (String) object[10], 
                        (String) object[11], StringUtils.formatDate(object[12]), (String) object[13],
                        StringUtils.formatDate(object[14]) + " - " + StringUtils.formatDate(object[15]));
                profileHomes.add(profileHome);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        profileDto.setProfileHomes(profileHomes);
        int total = profileRepository.countProfile(
        		params.getFullName(),
        		params.getSkillName(), 
        		params.getRoleName(), 
        		params.getLanguageName(),
        		params.getCertificate(),
        		params.getProfileType(),
        		params.getUserGroup(),
        		params.getUserDu(),        		        		
        		availableTo,
        		params.getYearsOfExperience());
        profileDto.setTotalElements(total);

        return profileDto;

    }

    @Override
    public ProfileDto getListOfProfileForDashboardPagination(FindProfileParams params) {
        ProfileDto profileDto = new ProfileDto();
        System.out.println("Finding params: " + params);
        DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");

        String availableTo = null;
        if (params.getAvailableTo() != null) {
        	availableTo = dateFormat.format(params.getAvailableTo());
        }
        
        List<Object> profiles = profileRepository.findProfileForDashboard(
        		params.getFullName(),
        		params.getSkillName(), 
        		params.getRoleName(), 
        		params.getLanguageName(),
        		params.getCertificate(),
        		params.getProfileType(),
        		params.getUserGroup(),
        		params.getUserDu(),        		        		
        		availableTo, 
        		params.getYearsOfExperience(),
        		params.getPageIndex() - 1,
        		params.getPageSize());

        List<ProfileHome> profileHomes = new ArrayList<>();
        //SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");

        for (Iterator<Object> it = profiles.iterator(); it.hasNext();) {
            Object[] object = (Object[]) it.next();
            try {
                ProfileHome profileHome = new ProfileHome((int) object[0], (String) object[1],
                        (String) object[2], (String) object[3], (String) object[4],
                        (String) object[5], (String) object[6], (String) object[7],
                        (String) object[8], (String) object[9], (String) object[10], 
                        (String) object[11], StringUtils.formatDate(object[12]), (String) object[13],
                        StringUtils.formatDate(object[14]) + " - " + StringUtils.formatDate(object[15]));
                profileHomes.add(profileHome);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        profileDto.setProfileHomes(profileHomes);
        int total = profileRepository.countProfileForDashboard(
        		params.getFullName(),
        		params.getSkillName(), 
        		params.getRoleName(), 
        		params.getLanguageName(),
        		params.getCertificate(),
        		params.getProfileType(),
        		params.getUserGroup(),
        		params.getUserDu(),        		        		
        		availableTo,
        		params.getYearsOfExperience());
        profileDto.setTotalElements(total);

        return profileDto;

    }

    
    @Override
    public List<Integer> getListProfileId(String skill, String roleName, String language) {
        return profileRepository.getListProfileId(skill, roleName, language);
    }

	@Override
	public List<String> getSuggestions(String type, String searchValue) {
		List<String> suggestions = profileLogic.getFieldSuggestions(type, searchValue);
		return suggestions;
	}

}
