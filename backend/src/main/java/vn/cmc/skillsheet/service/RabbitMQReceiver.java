package vn.cmc.skillsheet.service;

import vn.cmc.skillsheet.vo.StaffEmail;

public interface RabbitMQReceiver {
	public void receviedMessage(StaffEmail email);
}
