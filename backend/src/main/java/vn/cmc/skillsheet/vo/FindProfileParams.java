package vn.cmc.skillsheet.vo;

import java.util.Date;

import lombok.Data;

@Data
public class FindProfileParams {
	private int pageIndex;
	
	private int pageSize;
	
	private String column;
	
	private boolean sortAsc;
	
	private String fullName;
	
	private String skillName;
	
	private String roleName;
	
	private String languageName;
	
	private String certificate;
	
	private String profileType;
	
	private String userGroup;
	
	private String userDu;
	
	private Date availableTo;
	
	private int yearsOfExperience; 	
}
