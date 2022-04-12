package vn.cmc.skillsheet.util;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import vn.cmc.skillsheet.constant.EmailTemplateConst;
import vn.cmc.skillsheet.constant.ProfileStatusConst;
import vn.cmc.skillsheet.constant.SystemConst;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.repository.ProfileRepository;
import vn.cmc.skillsheet.repository.StaffRepository;
import vn.cmc.skillsheet.service.RabbitMQSender;
import vn.cmc.skillsheet.vo.ProfileStat;
import vn.cmc.skillsheet.vo.StaffEmail;

/**
 * Temporary email utilities
 */
@Service
public class TempEmailUtils {

	@Value("${dummyemail}")
	private String dummyemail;
	
	@Value("${environment}")
	private String environment;
	
	@Autowired
	private StaffRepository staffRepository;
	
	@Autowired
	private ProfileRepository profileRepository;
	
	@Autowired
	private RabbitMQSender rabbitMQSender;
	
	@Autowired
	private JavaMailSender javaMailSender;
	
	public void sendWeeklySummaryToGleadAndRec() {
		if (environment.toLowerCase().equals("dev")) {
			return;
		}
		
		List<StaffEmail> receivers = new ArrayList<StaffEmail>();
		List<Staff> duLeads = staffRepository.getDuLeads();
		
		StaffEmail staffEmail;
		HashMap<String, String> managers = new HashMap<String, String>();
		managers.put("dnbao@cmc.com.vn", "Đặng Ngọc Bảo - CMC Global Acting CEO");
		managers.put("nvbach@cmc.com.vn", "Nguyễn Việt Bách - CMC Global CDO");
		managers.put("dtanh@cmc.com.vn", "Đào Tuấn Anh - CMC Global G1");
		managers.put("ntthang1@cmc.com.vn", "Nguyễn Thị Thu Hằng - CMC Japan");		
		
		String managerEmail = "ptvan1@cmc.com.vn";
		for (String email : managers.keySet()) {
			if (!(dummyemail == null || dummyemail.trim().isEmpty())) {
				managerEmail = dummyemail;
			} else {
				managerEmail = email;
			}
			
			staffEmail = new StaffEmail();
			staffEmail.setEmailTo(managerEmail);
			staffEmail.setFullName(managers.get(email));
			receivers.add(staffEmail);					
		}
		
		for (int i = 0; i < duLeads.size(); i++) {
			Staff duLead = duLeads.get(i);
			if (!(duLead.getDu().startsWith("DU") || duLead.getDu().equals("TDX"))) {
				continue;
			}
			
			if (!(dummyemail == null || dummyemail.trim().isEmpty())) {
				managerEmail = dummyemail;
			} else {
				managerEmail = duLead.getEmail();
			}

			staffEmail = new StaffEmail();
			staffEmail.setEmailTo(managerEmail);
			staffEmail.setFullName(duLead.getFullName());
			receivers.add(staffEmail);
		}
		
		staffEmail = new StaffEmail();
		staffEmail.setEmailTo("ptvan1@cmc.com.vn");
		staffEmail.setFullName("Phạm Thành Vân - CMC Global TDX");
		receivers.add(staffEmail);
		
		staffEmail = new StaffEmail();
		staffEmail.setEmailTo("thlan@cmc.com.vn");
		staffEmail.setFullName("Tô Hương Lan - CMC Global TDX");
		receivers.add(staffEmail);	
		
//		staffEmail = new StaffEmail();
//		staffEmail.setEmailTo("bnchau@cmc.com.vn");
//		staffEmail.setFullName("Bùi Ngọc Châu - CMC Global TDX");
//		receivers.add(staffEmail);	
		
		String header = "Dưới đây là bảng tóm tắt số lượng profile đã hoàn thành ở các đơn vị trên hệ thống";
		String footer = "Rất mong anh/chị đốc thúc, nhắc nhở các thành viên hoàn thành profile trên hệ thống để sớm đưa vào khai thác, không để lãng phí tài nguyên của công ty.";
		sendWeeklySummaryToGleadAndRec(null, receivers, header, footer);
		try {
			Thread.sleep(500);
		} catch (InterruptedException e) {			
			e.printStackTrace();
		}
		
		receivers.clear();				
		managers.clear();
		managers.put("dnbao@cmc.com.vn", "Đặng Ngọc Bảo - CMC Global Acting CEO");
		managers.put("ntnhan@cmc.com.vn", "Nguyễn Thanh Nhàn - CMC Global HR");
		managers.put("Hr-cmcglobal@cmc.com.vn", "Anh/Chị");
		for (String email : managers.keySet()) {
			if (!(dummyemail == null || dummyemail.trim().isEmpty())) {
				managerEmail = dummyemail;
			} else {
				managerEmail = email;
			}

			staffEmail = new StaffEmail();
			staffEmail.setEmailTo(managerEmail);
			staffEmail.setFullName(managers.get(email));
			receivers.add(staffEmail);
		}
		
		staffEmail = new StaffEmail();
		staffEmail.setEmailTo("ptvan1@cmc.com.vn");
		staffEmail.setFullName("Phạm Thành Vân - CMC Global TDX");
		receivers.add(staffEmail);
		
		staffEmail = new StaffEmail();
		staffEmail.setEmailTo("thlan@cmc.com.vn");
		staffEmail.setFullName("Tô Hương Lan - CMC Global TDX");
		receivers.add(staffEmail);	
		
		staffEmail = new StaffEmail();
		staffEmail.setEmailTo("bnchau@cmc.com.vn");
		staffEmail.setFullName("Bùi Ngọc Châu - CMC Global TDX");
		receivers.add(staffEmail);
		
		header = "Dưới đây là thông tin số lượng profile đã hoàn thành của nhân viên onboard từ ngày 01/03/2021 trên hệ thống";
		Calendar cal = Calendar.getInstance();
		cal.set(2021, 1, 28);
		footer = "";
		sendWeeklySummaryToGleadAndRec(cal.getTime(), receivers, header, footer);	
	}
	
	private void sendWeeklySummaryToGleadAndRec(Date startDate, List<StaffEmail> receivers, String header, String footer) {
		if (environment.toLowerCase().equals("dev")) {
			return;
		}
		
		List<Object> results = profileRepository.getProfileSummary(startDate);		
		StringBuilder tableBody = new StringBuilder();
		for (int i = 0; i < results.size(); i++) {
			int totalMembers = 0;
			Object[] row = (Object[])results.get(i);
			String rowTag = "<tr>";
			
			if (row[0] == null) {
				continue;
			}
			
			if (!(row[0].toString().startsWith("DU") || row[0].toString().startsWith("DJ") || row[0].toString().equals("TDX"))) {
				continue;
			}
			
			StringBuilder colElements = new StringBuilder();			
			for (int j = 0; j < row.length; j++) {
				if (j > 0) {
					totalMembers += (int)row[j];
				}
			}
			
			if (totalMembers == 0) {
				continue;
			}
			
			int[] indices = new int[] {0, 4};
			for (int j = 0; j < indices.length; j++) {
				int idx = indices[j];
				colElements.append("<td style='text-align: center;'>");
				colElements.append(row[idx].toString());
				colElements.append("</td>");
				
			}
			colElements.append("<td style='text-align: center;'>");
			colElements.append(totalMembers);
			colElements.append("</td>");
			if (totalMembers != 0) {
				int rate = ((int)row[4] * 100)/totalMembers;
				colElements.append("<td style='text-align: center;'>");
				colElements.append(rate);				
				colElements.append("</td>");
				if (rate < 30) {
					rowTag = "<tr style='color: red'>";
				} else if (rate >= 30 && rate <= 70) {
					rowTag = "<tr style='color: #FFC000'>";
				} else {
					rowTag = "<tr style='color: green'>";
				}
			}
			
			tableBody.append(rowTag);
			tableBody.append(colElements.toString());
			tableBody.append("</tr>");
		}
			
		int retryTimes = 5;
		for (int retryTime = 0; retryTime < retryTimes; retryTime++) {
			try {
				EmailUtils emailUtils = new EmailUtils();
				MimeMessage msg = javaMailSender.createMimeMessage();
				msg.setFrom(SystemConst.EMAIL_SENDER_NAME);

				MimeMessageHelper helper = new MimeMessageHelper(msg, true);
				
				helper.setSubject("[Skills System] Profile report");
				helper.setText(emailUtils.getProfileSummaryTemplate(
						"Anh/Chị", tableBody.toString(), header, footer, "templates/ProfileSummary.html"), true);	
				String[] emails = new String[receivers.size()];
				for (int i = 0; i < receivers.size(); i++) {
					StaffEmail staffEmail = receivers.get(i);
					emails[i] = staffEmail.getEmailTo();				
				}
				
				helper.setTo(emails);
				System.out.println("Sending email to: " + String.join(", ", emails));
				javaMailSender.send(msg);
				break;
			} catch (Exception e) {
				e.printStackTrace();
				try {
					System.out.println("Retrying " + (retryTime + 1) + " time(s)...");
					Thread.sleep(5 * 1000);
				} catch (Exception e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			}		
		}
	}
	
//	@Scheduled(fixedRate = 3000000)
//	@Scheduled(cron = "0 0 12 * * MON-FRI")
	public void sendWarningEmailToStaffAndDuLead() {
//		if (environment.toLowerCase().equals("dev")) {
//			return;
//		}
		
		try {
			List<Staff> allStaff = staffRepository.findAll();
			Map<String, ProfileStat> report = new HashMap<>();
			for (int i = 0; i < allStaff.size(); i++) {
				Staff staff = allStaff.get(i);
				String du = staff.getDu();
				if (du == null || du.isEmpty()) {
					continue;
				}

				du = du.toUpperCase();
				if (!(du.startsWith("DU") || du.startsWith("TDX") || du.startsWith("DJ"))) {
					continue;
				}				

				if (!report.containsKey(staff.getDu())) {
					report.put(du, new ProfileStat());
				}

				if (staff.getIsDuLead() > 0) {
					report.get(du).setDuLeadEmail(staff.getEmail());
					report.get(du).setDuLeadName(staff.getFullName());
				}

				if (staff.getIsDuLead() > 0 || staff.getIsGroupLead() > 0) {
					continue;
				}

				boolean completed = false;
				boolean submitted = false;
				report.get(du).setTotal(report.get(du).getTotal() + 1);
				List<Profile> profiles = profileRepository.findByStaffId(staff.getStaffId());
				for (int j = 0; j < profiles.size(); j++) {
					Profile profile = profiles.get(j);
					if (profile.getStatus().toUpperCase().equals(ProfileStatusConst.APPROVED)) {
						completed = true;
						break;
					} else if (profile.getStatus().toUpperCase().equals(ProfileStatusConst.SUBMITTED)) {
						submitted = true;
					}
				}

				if (!completed) {
					StaffEmail staffEmail = new StaffEmail();
					staffEmail.setFullName(staff.getFullName());
					staffEmail.setEmailTo(staff.getEmail());
					report.get(du).getIncompleteAccounts().add(staffEmail);
					if (submitted) {
						report.get(du).getAccountsHavingAProfileIsSubmitted().add(staffEmail);
					} else {
						report.get(du).getAccountsHavingProfilesAreNew().add(staffEmail);
					}
				}
			}

			for (Map.Entry<String, ProfileStat> entry : report.entrySet()) {
				try {
					String du = entry.getKey();
					ProfileStat profileStat = entry.getValue();
					if (profileStat.getDuLeadEmail().isEmpty()) {
						continue;
					}

					if (profileStat.getIncompleteAccounts().size() == 0) {
						continue;
					}

					// Send email to DU lead
					String managerEmail = profileStat.getDuLeadEmail();
					if (!(dummyemail == null || dummyemail.trim().isEmpty())) {
						managerEmail = dummyemail;
					}
					StaffEmail staffEmail = new StaffEmail();
					staffEmail.setFullName(profileStat.getDuLeadName());
					staffEmail.setEmailType(1);
					staffEmail.setEmailTo(managerEmail);
					staffEmail.setAdditionalData(profileStat.getIncompleteAccounts().size() + "/" + profileStat.getTotal());
					staffEmail.setNotSubmittedProfiles(profileStat.getAccountsHavingProfilesAreNew().size());
					staffEmail.setSubmittedProfiles(profileStat.getAccountsHavingAProfileIsSubmitted().size());
					staffEmail.setTotalMembers(profileStat.getTotal());
					staffEmail.setApprovedProfiles(profileStat.getTotal() - profileStat.getAccountsHavingAProfileIsSubmitted().size() - profileStat.getAccountsHavingProfilesAreNew().size());
					rabbitMQSender.sendEmailToStaff(staffEmail);
					Thread.sleep(500);
					
					// Send email to staff
					for (int i = 0; i < profileStat.getAccountsHavingProfilesAreNew().size(); i++) {
						StaffEmail incompleteAcc = profileStat.getAccountsHavingProfilesAreNew().get(i);
						String mailTo = incompleteAcc.getEmailTo();
						if (!(dummyemail == null || dummyemail.trim().isEmpty())) {
							mailTo = dummyemail;
						}
						staffEmail = new StaffEmail();
						staffEmail.setFullName(incompleteAcc.getFullName());
						staffEmail.setEmailType(EmailUtils.REMIND_STAFF_EMAIL_TYPE);
						staffEmail.setEmailTo(mailTo);
						rabbitMQSender.sendEmailToStaff(staffEmail);
						System.out.println("Sent " + (i + 1) + "/" + profileStat.getAccountsHavingProfilesAreNew().size());
						Thread.sleep(500);						
					}
					//return;
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
