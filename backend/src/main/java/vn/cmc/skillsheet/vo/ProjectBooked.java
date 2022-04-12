package vn.cmc.skillsheet.vo;

import java.util.Date;

import lombok.Data;

@Data
public class ProjectBooked {
	Date endDate;
	Date startDate;
	String projectName;

}
