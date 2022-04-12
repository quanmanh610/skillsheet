package vn.cmc.skillsheet.util;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;

import vn.cmc.skillsheet.entity.Staff;

public class EmailUtils {
	
	public static final int UPDATE_STAFF_PROFILE_EMAIL_TYPE = 0;
	public static final int REMIND_DU_LEAD_EMAIL_TYPE = 1;
	public static final int REMIND_STAFF_EMAIL_TYPE = 2;
	
	public String getContentFromHtmlTemplateForStaff(String staffFullName, String linkHtmlTemplate) {
		String content = "";
		try {
			URL res = getClass().getClassLoader().getResource(linkHtmlTemplate);
			BufferedReader in = new BufferedReader(new FileReader(res.getPath()));

			String str;
			while ((str = in.readLine()) != null) {
				if (str.compareTo("@staffFullname") == 0) {
					str = staffFullName;
				} 
				content += str;
			}
			in.close();
		} catch (IOException e) {
		}
		
		return content;
	}
	
	public String getContentFromHtmlTemplateToRemindDULead(
			String duLeadName, 
			int notSubmittedProfiles, 
			int submittedProfiles, 
			int approvedProfiles, 
			int totalMembers, 
			String linkHtmlTemplate) {
		
		String content = "";
		try {
			URL res = getClass().getClassLoader().getResource(linkHtmlTemplate);
			BufferedReader in = new BufferedReader(new FileReader(res.getPath()));

			String str;
			while ((str = in.readLine()) != null) {
				if (str.compareTo("@staffFullname") == 0) {
					str = duLeadName;
				} else if (str.compareTo("@notSubmittedProfiles") == 0) {
					str = String.valueOf(notSubmittedProfiles);
				} else if (str.compareTo("@submittedProfiles") == 0) {
					str = String.valueOf(submittedProfiles);
				} else if (str.compareTo("@approvedProfiles") == 0) {
					str = String.valueOf(approvedProfiles);
				} else if (str.compareTo("@totalMembers") == 0) {
					str = String.valueOf(totalMembers);
				}
				content += str;
			}
			in.close();
		} catch (IOException e) {
		}
		
		return content;
	}
	
	public String getProfileSummaryTemplate(String staffFullName, String tableBody, String header, String footer, String linkHtmlTemplate) {
		String content = "";
		try {
			URL res = getClass().getClassLoader().getResource(linkHtmlTemplate);
			BufferedReader in = new BufferedReader(new FileReader(res.getPath()));

			String str;
			while ((str = in.readLine()) != null) {
				str = str.replaceAll("@header", header);
				str = str.replaceAll("@staffFullname", staffFullName);
				str = str.replaceAll("@tableBody", tableBody);				
				str = str.replaceAll("@footer", footer);
				content += str;
			}
			in.close();
		} catch (IOException e) {
		}
		
		return content;
	}
}
