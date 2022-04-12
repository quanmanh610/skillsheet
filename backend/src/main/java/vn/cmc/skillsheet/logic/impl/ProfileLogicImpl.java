package vn.cmc.skillsheet.logic.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.math3.exception.NullArgumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import vn.cmc.skillsheet.logic.ProfileLogic;
import vn.cmc.skillsheet.repository.CandidateRepository;
import vn.cmc.skillsheet.repository.CertificateRepository;
import vn.cmc.skillsheet.repository.EducationRepository;
import vn.cmc.skillsheet.repository.LanguageRepository;
import vn.cmc.skillsheet.repository.ProfileCertificateRepository;
import vn.cmc.skillsheet.repository.ProfileRepository;
import vn.cmc.skillsheet.repository.ProfileSkillRepository;
import vn.cmc.skillsheet.repository.ProjectRoleRepository;
import vn.cmc.skillsheet.repository.SchoolRepository;
import vn.cmc.skillsheet.repository.SkillRepository;
import vn.cmc.skillsheet.repository.StaffRepository;

@Component
public class ProfileLogicImpl implements ProfileLogic {

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
    private ProjectRoleRepository projectRoleRepository;
    
    @Autowired
    private LanguageRepository languageRepository;
    
	public List<String> getFieldSuggestions(String type, String searchValue) {
		List<String> suggestions = new ArrayList<String>();
		if (type == null) {
			return suggestions;
		}
		type = type.toUpperCase();
		if (type.equals("SKILL")) {
			suggestions = skillRepository.getAllSkillNames();
		} else if (type.equals("ROLE")) {
			suggestions = projectRoleRepository.getAllRoleNames();
		} else if (type.equals("LANGUAGE")) {
			suggestions = languageRepository.getAllLanguageNames();
		} else if (type.equals("CERTIFICATE")) {
			suggestions = certificateRepository.getAllCertificateNames();
		} else if (type.equals("GROUP")) {
			suggestions = staffRepository.getAllGroupNames();
		} else if (type.equals("DU")) {
			suggestions = staffRepository.getAllDuNames();
		} else if (type.equals("FULLNAME")) {
			suggestions = staffRepository.getNameSuggestions(searchValue, 20);
		}
		
		return suggestions;
	}
}
