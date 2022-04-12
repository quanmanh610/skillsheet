package vn.cmc.skillsheet.vo;

import java.util.Date;

import lombok.Data;

@Data
public class FindRequestParams {
	private String fullName;
	private String roleName;
	private String status;
	private Date fromDate;
	private Date toDate;
	private int pageIndex;
	private int pageSize;
	private String group;
	private String du;
	private String picEmail;
}
