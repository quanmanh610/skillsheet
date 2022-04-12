package vn.cmc.skillsheet.service;

import java.util.Date;
import java.util.List;

import vn.cmc.skillsheet.dto.ProfileDto;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.vo.FindProfileParams;
import vn.cmc.skillsheet.vo.LoginUser;

public interface ProfileService {

    public Profile getProfileByCandidateEmail(String email);
    
    //public Profile getProfileByCandidateId(int candidateId);

    public Profile updateProfile(Profile profile);

    public Profile addProfileCertificate(String certi) throws IllegalAccessException;

    public Profile updateProfileCertificate(String certi) throws IllegalAccessException;

    public Profile addProfileSkill(String skill_l) throws IllegalAccessException;

    public Profile updateProfileSkill(String skill_l) throws IllegalAccessException;

    public Profile createFirstStaffProfile(LoginUser loginUser, String token) throws IllegalAccessException;

    public Profile setMainVersion(String data) throws IllegalAccessException;

    public Profile requestApprove(String data) throws IllegalAccessException;

    public Profile requestSubmitCandidateProfile(String data) throws IllegalAccessException;

    public Profile cloneNewVersion(Profile profile, String token) throws IllegalAccessException;

    public Profile copyCandidateProfile(Profile originalProfile, Date date, String userName, String staffEmail);

//    public ProfileDto getListOfProfilePagination(int page, int size, String column, String sort,
//            String skillName, String roleName, String languageName);
    
    public ProfileDto getListOfProfilePagination(FindProfileParams params);
    
    public ProfileDto getListOfProfileForDashboardPagination(FindProfileParams params);
    
    public List<Integer> getListProfileId(String skill, String roleName, String language);

	public List<String> getSuggestions(String type, String searchValue);

}
