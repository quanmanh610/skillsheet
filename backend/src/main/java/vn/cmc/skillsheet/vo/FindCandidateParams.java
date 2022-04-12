package vn.cmc.skillsheet.vo;

import lombok.Data;

@Data
public class FindCandidateParams {
	private String fullName;
	private String roleName;
	private String status;	
	private int pageIndex;
	private int pageSize;
}
