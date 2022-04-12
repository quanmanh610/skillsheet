package vn.cmc.skillsheet.vo;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class ProfileStat {
	private int total = 0;	
	private String duLeadEmail = "";
	private String duLeadName = "";
	private List<StaffEmail> incompleteAccounts = new ArrayList<StaffEmail>();
	private List<StaffEmail> accountsHavingProfilesAreNew = new ArrayList<StaffEmail>();
	private List<StaffEmail> accountsHavingAProfileIsSubmitted = new ArrayList<StaffEmail>();
}
