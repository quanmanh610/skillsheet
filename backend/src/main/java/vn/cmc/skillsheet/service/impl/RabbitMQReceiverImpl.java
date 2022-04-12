package vn.cmc.skillsheet.service.impl;

import javax.mail.internet.MimeMessage;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import vn.cmc.skillsheet.constant.EmailTemplateConst;
import vn.cmc.skillsheet.constant.SystemConst;
import vn.cmc.skillsheet.service.RabbitMQReceiver;
import vn.cmc.skillsheet.util.EmailUtils;
import vn.cmc.skillsheet.vo.StaffEmail;

@Service
public class RabbitMQReceiverImpl implements RabbitMQReceiver {

	@Autowired
	private JavaMailSender javaMailSender;

	@RabbitListener(queues = "${skillset.rabbitmq.queue}")
	@Override
	public void receviedMessage(StaffEmail email) {
		System.out.println("Received Message From RabbitMQ: " + email);
		int retryTimes = 10;
		EmailUtils emailUtils = new EmailUtils();
		for (int i = 0; i < retryTimes; i++) {
			try {
				MimeMessage msg = javaMailSender.createMimeMessage();
				msg.setFrom(SystemConst.EMAIL_SENDER_NAME);

				MimeMessageHelper helper = new MimeMessageHelper(msg, true);

				helper.setTo(email.getEmailTo());
				if (email.getEmailType() == EmailUtils.UPDATE_STAFF_PROFILE_EMAIL_TYPE) {
					helper.setSubject("Request update " + email.getFullName() + " profile");
					helper.setText(EmailTemplateConst.getUpdateRequestToStaffTemplate(email.getFullName()), true);
				} else if (email.getEmailType() == EmailUtils.REMIND_DU_LEAD_EMAIL_TYPE) {
					// Profile report
					helper.setSubject("[Skills System] Profile report");
//					helper.setText("Dear " + email.getFullName() + ",<br/> Incompleted profiles: " + email.getAdditionalData(), true);
					helper.setText(emailUtils.getContentFromHtmlTemplateToRemindDULead(
							email.getFullName(), 
							email.getNotSubmittedProfiles(), 
							email.getSubmittedProfiles(), 
							email.getApprovedProfiles(), 
							email.getTotalMembers(), 
							"templates/RemindDULeadAboutProfilesStatus.html"), 
							true);
				} else if (email.getEmailType() == EmailUtils.REMIND_STAFF_EMAIL_TYPE) {
					// Staff notification email
					helper.setSubject("[Skills System] Request: Complete Profile " + email.getFullName());
//					helper.setText("Dear " + email.getFullName() + ",<br/> Update your profile, please.", true);
					helper.setText(emailUtils.getContentFromHtmlTemplateForStaff(email.getFullName(), "templates/RemindStaffToCompleteProfile.html"), true);
				} else {
					return;
				}

				javaMailSender.send(msg);
				break;
			} catch (Exception e) {
				e.printStackTrace();
				try {
					System.out.println("Retrying " + (i + 1) + " time(s)...");
					Thread.sleep(5 * 1000);
				} catch (Exception e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			}
		}
	}

}
