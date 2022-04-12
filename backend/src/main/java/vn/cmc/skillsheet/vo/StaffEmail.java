package vn.cmc.skillsheet.vo;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import lombok.AllArgsConstructor;
import lombok.Data;

@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class, property = "@id", scope = StaffEmail.class)
@Data
public class StaffEmail {
	private String emailTo;
	private String fullName;
	private int emailType = 0;
	private String additionalData = "";
	private int notSubmittedProfiles = 0;
	private int submittedProfiles = 0;
	private int approvedProfiles = 0;
	private int totalMembers = 0;
//	private String subject;
//	private String content;
}
