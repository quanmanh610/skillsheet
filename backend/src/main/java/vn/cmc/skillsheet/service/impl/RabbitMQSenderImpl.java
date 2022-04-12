package vn.cmc.skillsheet.service.impl;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import vn.cmc.skillsheet.service.RabbitMQSender;
import vn.cmc.skillsheet.vo.StaffEmail;

@Service
public class RabbitMQSenderImpl implements RabbitMQSender {
	
	@Autowired
	private AmqpTemplate rabbitTemplate;
	
	@Value("${skillset.rabbitmq.exchange}")
	private String exchange;
	
	@Value("${skillset.rabbitmq.routingkey}")
	private String routingkey;	

	@Override
	public void sendEmailToStaff(StaffEmail email) {
		System.out.print("Sending message to RabbitMQ: " + email);
		rabbitTemplate.convertAndSend(exchange, routingkey, email);		
	}

}
