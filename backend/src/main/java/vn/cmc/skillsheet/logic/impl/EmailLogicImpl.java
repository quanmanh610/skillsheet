package vn.cmc.skillsheet.logic.impl;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;

import org.apache.tomcat.util.bcel.classfile.Constant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import vn.cmc.skillsheet.constant.EmailTemplateConst;
import vn.cmc.skillsheet.constant.SystemConst;
import vn.cmc.skillsheet.constant.UrlConst;
import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.ChangeHistory;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.RequestApproval;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.logic.EmailLogic;
import vn.cmc.skillsheet.repository.ChangeHistoryRepository;
import vn.cmc.skillsheet.repository.StaffRepository;
import vn.cmc.skillsheet.service.DepartmentService;
import vn.cmc.skillsheet.service.RabbitMQSender;
import vn.cmc.skillsheet.vo.Manager;
import vn.cmc.skillsheet.vo.StaffEmail;

/**
 * @author NDDUC
 *
 */
@Component
public class EmailLogicImpl implements EmailLogic {

	@Autowired
	private JavaMailSender javaMailSender;

	@Autowired
	private ChangeHistoryRepository changeHistoryRepository;

	@Autowired
	private StaffRepository staffRepository;

	@Autowired
	private DepartmentService departmentService;

	@Value("${dummyemail}")
	private String dummyemail;

	@Autowired
	RabbitMQSender rabbitMQSender;
	

	@Override
	public boolean sendUpdateRequestEmail(String email, Staff staff) throws MessagingException, IOException {
		String fullName = "Staff";
		if (null != staff.getFullName() && !"".equals(staff.getFullName())) {
			fullName = staff.getFullName();
		}
		
		String sendTo = email;
		if (!(dummyemail == null || dummyemail.trim().isEmpty())) {
			sendTo = dummyemail;
		}
		
		StaffEmail staffEmail = new StaffEmail();
		staffEmail.setEmailTo(sendTo);
		staffEmail.setFullName(fullName);
		rabbitMQSender.sendEmailToStaff(staffEmail);
		return true;
//        String fullName = "Staff";
//        if (null != staff.getFullName() && !"".equals(staff.getFullName())) {
//            fullName = staff.getFullName();
//        }
//        MimeMessage msg = javaMailSender.createMimeMessage();
//
//        MimeMessageHelper helper = new MimeMessageHelper(msg, true);
//
//        helper.setTo(email);
//
//        helper.setSubject("Request update " + fullName + " profile");
//
//        helper.setText(EmailTemplateConst.getUpdateRequestToStaffTemplate(staff.getFullName()),
//                true);
//        try {
//            javaMailSender.send(msg);
//            return true;
//        } catch (Exception e) {
//            return false;
//        }

	}

	@Override
	public boolean sendUpdatedEmailToStaff(Profile profile, String comment, String username)
			throws MessagingException, IOException {

		Staff staff = staffRepository.findByEmail(profile.getEmail());
		String sender = staffRepository.findOneByUserName(username).getEmail();
		String fullName = staff.getFullName();
		String du = staff.getDu();
		String group = staff.getStaffGroup();

		MimeMessage msg = javaMailSender.createMimeMessage();
		msg.setFrom(SystemConst.EMAIL_SENDER_NAME);

		MimeMessageHelper helper = new MimeMessageHelper(msg, true);

		Manager manager = departmentService.getManagerByDu(departmentService.getListDepartment(), du);

		if (manager == null) {
			throw new RuntimeException("Could not find manager: DU: " + du + "; Group: " + group);
		}

		if (!(dummyemail == null || dummyemail.trim().isEmpty())) {
			String[] ar = { dummyemail, dummyemail };
			helper.setTo(dummyemail);
			helper.setCc(ar);
		} else {
			helper.setTo(profile.getEmail());
			String[] array = { manager.getEmail(), sender };
			helper.setCc(array);
//			String[] ar = { "thlan@cmc.com.vn", "thlan@cmc.com.vn" };
//			helper.setTo("thlan@cmc.com.vn");
//			helper.setCc(ar);
		}

		helper.setSubject("Request update " + fullName + " profile");
//
//        helper.setText(EmailTemplateConst.getUpdateRequestToStaffTemplate(profile.getEmail()), true);
		String content = "";
		try {
			URL res = getClass().getClassLoader().getResource("templates/UpdateRequestToStaffTemplate.html");
			BufferedReader in = new BufferedReader(new FileReader(res.getPath()));

			String str;
			while ((str = in.readLine()) != null) {
				if (str.compareTo("@staffFullname") == 0) {
					str = fullName;
				} else if (str.compareTo("@comment") == 0) {
					str = comment;
				}
				content += str;
			}
			in.close();
		} catch (IOException e) {
		}

//        helper.setText(EmailTemplateConst.getApprovedOrRejectedTemplate(fullName, status),true);
		helper.setText(content, true);

		try {			
			javaMailSender.send(msg);
			return true;
		} catch (Exception e) {
			return false;

		}
	}

	@Override
	public boolean sendEmailNotificationForRecruiter(String recruiterEmail, String recruiterName, String candidateName,
			String requestedBy) throws MessagingException, IOException {

		MimeMessage msg = javaMailSender.createMimeMessage();
		msg.setFrom(SystemConst.EMAIL_SENDER_NAME);

		MimeMessageHelper helper = new MimeMessageHelper(msg, true);

		if (!(dummyemail == null || dummyemail.trim().isEmpty())) {
			helper.setTo(dummyemail);
		} else {
			helper.setTo(recruiterEmail);
//			helper.setTo("thlan@cmc.com.vn");
		}

		helper.setSubject("Activate " + candidateName + " profile");
//
//        helper.setText(EmailTemplateConst.getUpdateRequestToStaffTemplate(profile.getEmail()), true);
		String content = "";
		try {
			URL res = getClass().getClassLoader().getResource("templates/SendEmailNotificationForRecruiter.html");
			BufferedReader in = new BufferedReader(new FileReader(res.getPath()));

			String str;
			while ((str = in.readLine()) != null) {
				if (str.compareTo("@recruiterName") == 0) {
					str = recruiterName;
				} else if (str.compareTo("@candidateName") == 0) {
					str = candidateName;
				}
				content += str;
			}
			in.close();
		} catch (IOException e) {
		}

//        helper.setText(EmailTemplateConst.getApprovedOrRejectedTemplate(fullName, status),true);
		helper.setText(content, true);

		try {
			javaMailSender.send(msg);
			return true;
		} catch (Exception e) {
			return false;

		}
	}

	@Override
	public boolean notificationSubmittedToCandidate(String candidateEmail, String candidateName, String requestedBy)
			throws MessagingException, IOException {

		MimeMessage msg = javaMailSender.createMimeMessage();
		msg.setFrom(SystemConst.EMAIL_SENDER_NAME);

		MimeMessageHelper helper = new MimeMessageHelper(msg, true);

		if (!(dummyemail == null || dummyemail.trim().isEmpty())) {
			helper.setTo(dummyemail);
		} else {
			helper.setTo(candidateEmail);
			// helper.setTo("thlan@cmc.com.vn");
		}

		helper.setSubject("Submit Profile successfully");
//
//        helper.setText(EmailTemplateConst.getUpdateRequestToStaffTemplate(profile.getEmail()), true);
		String content = "";
		try {
			URL res = getClass().getClassLoader().getResource("templates/NotificationSubmittedToCandidate.html");
			BufferedReader in = new BufferedReader(new FileReader(res.getPath()));

			String str;
			while ((str = in.readLine()) != null) {
				if (str.compareTo("@candidateName") == 0) {
					str = candidateName;
				}
				content += str;
			}
			in.close();
		} catch (IOException e) {
		}

//        helper.setText(EmailTemplateConst.getApprovedOrRejectedTemplate(fullName, status),true);
		helper.setText(content, true);

		try {
			javaMailSender.send(msg);
			return true;
		} catch (Exception e) {
			return false;

		}
	}

	@Override
	public boolean sendCreatedEmailToCandidate(Candidate candidate, String requestedBy)
			throws MessagingException, IOException {
		String fullName = "Candiate";

		String date = "";
//		if (null != candidate.getCreatedDate()) {
			Date expried;
			Calendar c = Calendar.getInstance();
			c.setTime(candidate.getSendDate());
			c.add(Calendar.DATE, 2);
			expried = c.getTime();
			date = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss a").format(expried);
//		}

		if (null != candidate.getFullName() && !"".equals(candidate.getFullName())) {
			fullName = candidate.getFullName();
		}

		MimeMessage msg = javaMailSender.createMimeMessage();
		msg.setFrom(SystemConst.EMAIL_SENDER_NAME);

		MimeMessageHelper helper = new MimeMessageHelper(msg, true);

		helper.setTo(candidate.getEmail());

		helper.setSubject("Account " + fullName + " has been created");

		String content = "";
		try {
			URL res = getClass().getClassLoader().getResource("templates/CreateCandidate.html");
			BufferedReader in = new BufferedReader(new FileReader(res.getPath()));
			String str;
			while ((str = in.readLine()) != null) {
				if (str.compareTo("@staffFullname") == 0) {
					str = fullName;
				} else if (str.compareTo("@getLinkRequest") == 0) {
					str = candidate.getLinkRequest();
				} else if (str.compareTo("@getAccessCode") == 0) {
					str = candidate.getAccessCode();
				} else if (str.compareTo("@date") == 0) {
					str = date;
				}
				content += str;
			}
			in.close();
		} catch (IOException e) {
		}

		helper.setText(content, true);
//        helper.setText(EmailTemplateConst.getCreatedToCandiateTemplate(candidate.getFullName(),
//                candidate.getLinkRequest(), date, candidate.getAccessCode()), true);

		ChangeHistory odVo = new ChangeHistory();
		Date dates = new Date();
//        String strDateFormat = "dd/MM/yyyy hh:mm:ss a";
//        DateFormat dateFormat = new SimpleDateFormat(strDateFormat);
//        String time = dateFormat.format(dates);
		try {
			javaMailSender.send(msg);
			odVo.setTable("Send Email to Candidate Succucessfully");
			odVo.setEditor(requestedBy);
			odVo.setTime(dates);
			odVo.setCreatedDate(dates);
			odVo.setAction("Send Email");
			odVo.setField("");
			odVo.setOldValue("");
			odVo.setNewValue("To: " + fullName + ", email:" + candidate.getEmail());
			changeHistoryRepository.save(odVo);
			return true;
		} catch (Exception e) {
			odVo.setTable("Send Email FAILED!");
			odVo.setEditor(requestedBy);
			odVo.setTime(dates);
			odVo.setCreatedDate(dates);
			odVo.setAction("Send Email");
			odVo.setField("");
			odVo.setOldValue("");
			odVo.setNewValue("To: " + fullName + ", email:" + candidate.getEmail());
			changeHistoryRepository.save(odVo);
			return false;
		}
	}

	@Override
	public boolean sendRequestApproveToPIC(String picEmail, String picName, RequestApproval savedRequestApproval,
			String requestedBy) throws MessagingException, IOException {

		MimeMessage msg = javaMailSender.createMimeMessage();
		msg.setFrom(SystemConst.EMAIL_SENDER_NAME);

		MimeMessageHelper helper = new MimeMessageHelper(msg, true);

		if (!(dummyemail == null || dummyemail.trim().isEmpty())) {
			helper.setTo(dummyemail);
			helper.setCc(dummyemail);
		} else {
			helper.setTo(picEmail);
			helper.setCc(savedRequestApproval.getEmail());
//			 helper.setTo("thlan@cmc.com.vn");
		}

		helper.setSubject("Request approval " + savedRequestApproval.getFullName() + " profile");

		String linkApprove = UrlConst.ROOT_URI + "request";
		// + "\\" + savedRequestApproval.getRequestApprovalId();

		helper.setText(
				EmailTemplateConst.getCreateRequestApproveToPICTemplate(picName, savedRequestApproval.getFullName()
						+ " - Profile Version: " + savedRequestApproval.getVersion().getVersionName(), linkApprove),
				true);

		ChangeHistory odVo = new ChangeHistory();
		Date dates = new Date();
//        String strDateFormat = "dd/MM/yyyy hh:mm:ss a";
//        DateFormat dateFormat = new SimpleDateFormat(strDateFormat);
//        String time = dateFormat.format(dates);
		try {
			javaMailSender.send(msg);
			odVo.setTable("Send Email to PIC for RequestApproval Succucessfully");
			odVo.setEditor(requestedBy);
			odVo.setTime(dates);
			odVo.setCreatedDate(dates);
			odVo.setAction("Send Email");
			odVo.setField("");
			odVo.setOldValue("");
			odVo.setNewValue("To: " + picName + ", email:" + picEmail + "for RequestApproval ");
			changeHistoryRepository.save(odVo);
			return true;
		} catch (Exception e) {
			odVo.setTable("Send Email to PIC for RequestApproval FAILED!");
			odVo.setEditor(requestedBy);
			odVo.setTime(dates);
			odVo.setCreatedDate(dates);
			odVo.setAction("Send Email");
			odVo.setField("");
			odVo.setOldValue("");
			odVo.setNewValue("To: " + picName + ", email:" + picEmail + "for RequestApproval: "
					+ savedRequestApproval.toString());
			changeHistoryRepository.save(odVo);
			return false;
		}
	}

	@Override
	public boolean sendApprovedOrRejectedToStaff(String email, String fullName, String status, String comment)
			throws MessagingException, IOException {
		MimeMessage msg = javaMailSender.createMimeMessage();
		msg.setFrom(SystemConst.EMAIL_SENDER_NAME);
		
		MimeMessageHelper helper = new MimeMessageHelper(msg, true);

		if (!(dummyemail == null || dummyemail.trim().isEmpty())) {
			helper.setTo(dummyemail);
		} else {
			helper.setTo(email);
			// helper.setTo("thlan@cmc.com.vn");
		}

		helper.setSubject("Your profile has been " + status.toLowerCase());

		String content = "";

		try {
			if (status.equals("Approved")) {
				URL res = getClass().getClassLoader().getResource("templates/ApprovedToStaff.html");
				BufferedReader in = new BufferedReader(new FileReader(res.getPath()));
				String str;
				while ((str = in.readLine()) != null) {
					if (str.compareTo("@staffFullname") == 0) {
						str = fullName;
					} else if (str.compareTo("@status") == 0) {
						str = status.toLowerCase();
					}
					content += str;
				}
				in.close();
			} else {
				URL res = getClass().getClassLoader().getResource("templates/RejectedToStaff.html");
				BufferedReader in = new BufferedReader(new FileReader(res.getPath()));
				String str;
				while ((str = in.readLine()) != null) {
					if (str.compareTo("@staffFullname") == 0) {
						str = fullName;
					} else if (str.compareTo("@status") == 0) {
						str = status.toLowerCase();
					} else if (str.compareTo("@comment") == 0) {
						str = comment;
					}
					content += str;
				}
				in.close();
			}

		} catch (IOException e) {
		}

//        helper.setText(EmailTemplateConst.getApprovedOrRejectedTemplate(fullName, status),true);
		helper.setText(content, true);

		ChangeHistory odVo = new ChangeHistory();
		Date dates = new Date();
//        String strDateFormat = "hh:mm:ss a";
//        DateFormat dateFormat = new SimpleDateFormat(strDateFormat);
//        Date time = dateFormat.format(dates);
		try {
			javaMailSender.send(msg);
			odVo.setTable("Send Email to Candidate Succucessfully");
			odVo.setEditor("editor");
			odVo.setTime(dates);
			odVo.setCreatedDate(dates);
			odVo.setAction("Send Email");
			odVo.setField("");
			odVo.setOldValue("");
			odVo.setNewValue("To: " + fullName + ", email:" + fullName);
			changeHistoryRepository.save(odVo);
			return true;
		} catch (Exception e) {
			odVo.setTable("Send Email FAILED!");
			odVo.setEditor("editor");
			odVo.setTime(dates);
			odVo.setCreatedDate(dates);
			odVo.setAction("Send Email");
			odVo.setField("");
			odVo.setOldValue("");
			odVo.setNewValue("To: " + fullName + ", email:" + fullName);
			changeHistoryRepository.save(odVo);
			return false;
		}
	}

}
