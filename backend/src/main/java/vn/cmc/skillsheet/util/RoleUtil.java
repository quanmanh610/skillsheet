package vn.cmc.skillsheet.util;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import vn.cmc.skillsheet.constant.POARoles;
import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.repository.CandidateRepository;
import vn.cmc.skillsheet.repository.StaffRepository;

public class RoleUtil {	
	
	public static boolean checkStaffProfileRole(Staff staff, Profile profile) {
		if (profile.getStaff().getStaffId() == staff.getStaffId()) {
			return true;
		}
		
		String[] parts = staff.getRoles().split(";");
		List<String> roles = Arrays.asList(parts);
		if (roles.contains(POARoles.RECRUITER) || roles.contains(POARoles.SALE)) {
			return true;
		}
		
		if (roles.contains(POARoles.G_LEAD)) {
			if (staff.getStaffGroup().equals(profile.getStaff().getStaffGroup())) {
				return true;
			}
		}
		
		if (roles.contains(POARoles.DU_LEAD)) {
			if (staff.getDu().equals(profile.getStaff().getDu())) {
				return true;
			}
		}
		
		if (roles.contains(POARoles.PIC)) {
			if (staff.getStaffGroup().equals(profile.getStaff().getStaffGroup()) ||
					staff.getDu().equals(profile.getStaff().getDu())) {
				return true;
			}
		}
		
		return false;
	}
	
	public static boolean checkCandidateProfileRole(Staff staff, Profile profile) {
		if (profile.getStaff().getStaffId() == staff.getStaffId()) {
			return true;
		}
		
		String[] parts = staff.getRoles().split(";");
		List<String> roles = Arrays.asList(parts);
		if (roles.contains(POARoles.RECRUITER)) {
			return true;
		}
		
		if (roles.contains(POARoles.G_LEAD)) {
			if (staff.getStaffGroup().equals(profile.getStaff().getStaffGroup())) {
				return true;
			}
		}
		
		if (roles.contains(POARoles.DU_LEAD)) {
			if (staff.getDu().equals(profile.getStaff().getDu())) {
				return true;
			}
		}
		
		if (roles.contains(POARoles.PIC)) {
			if (staff.getStaffGroup().equals(profile.getStaff().getStaffGroup()) ||
					staff.getDu().equals(profile.getStaff().getDu())) {
				return true;
			}
		}
		
		return false;
	}
	
	public static boolean isStaffProfileOwner(Staff staff, Profile profile) {
		if (profile.getStaff().getStaffId() == staff.getStaffId()) {
			return true;
		}
		
		return false;
	}
	
	public static boolean isCandidateProfileOwner(Candidate candidate, Profile profile) {
		if (profile.getCandidate().getCandidateId() == candidate.getCandidateId()) {
			return true;
		}
		
		return false;
	}
	
	public static boolean checkProfileOwner(Profile profile, String token, StaffRepository staffRepository, CandidateRepository candidateRepository) {
		token = token.replace("Bearer ", "");
		token = token.replace("FAKE-", "");
		token = StringUtils.hashString(token);
		Staff staff = staffRepository.findOneByToken(token);
		if (staff == null) {
			Candidate candidate = candidateRepository.findOneByToken(token);
			if (candidate == null) {
				return false;
			}
			if (!RoleUtil.isCandidateProfileOwner(candidate, profile)) {
				return false;
			}
			
			return true;
		}
		
		if (!RoleUtil.isStaffProfileOwner(staff, profile)) {
			return false;
		}
		
		return true;
	}
	
	public static boolean canViewProfileList(Staff staff) {
		String[] parts = staff.getRoles().split(";");
		List<String> roles = Arrays.asList(parts);
		
		if (roles.contains(POARoles.RECRUITER) || roles.contains(POARoles.SALE) || roles.contains(POARoles.G_LEAD) || roles.contains(POARoles.DU_LEAD) || roles.contains(POARoles.PIC)) {
			return true;
		}
		
		return false;
	}
	
	public static boolean canViewCandidateList(Staff staff) {
		String[] parts = staff.getRoles().split(";");
		List<String> roles = Arrays.asList(parts);
		
		if (roles.contains(POARoles.RECRUITER)) {
			return true;
		}
		
		return false;
	}
	
	public static boolean canViewLogList(Staff staff) {
		String[] parts = staff.getRoles().split(";");
		List<String> roles = Arrays.asList(parts);
		
		if (roles.contains(POARoles.ADMIN) || roles.contains(POARoles.ADMIN_TEST)) {
			return true;
		}
		
		return false;
	}
	
	public static boolean canViewRequestApprovalList(Staff staff) {
		String[] parts = staff.getRoles().split(";");
		List<String> roles = Arrays.asList(parts);
		
		if (roles.contains(POARoles.G_LEAD) || roles.contains(POARoles.DU_LEAD) || roles.contains(POARoles.PIC)) {
			return true;
		}
		
		return false;
	}
	
	public static boolean canUpdateAndDeleteSettings(Staff staff) {
		String[] parts = staff.getRoles().split(";");
		List<String> roles = Arrays.asList(parts);
		
		if (roles.contains(POARoles.ADMIN) || roles.contains(POARoles.ADMIN_TEST)) {
			return true;
		}
		
		return false;
	}
}
