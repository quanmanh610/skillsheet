package vn.cmc.skillsheet.service;

import vn.cmc.skillsheet.vo.StaffEmail;

public interface RabbitMQSender {
	public void sendEmailToStaff(StaffEmail email);
}
