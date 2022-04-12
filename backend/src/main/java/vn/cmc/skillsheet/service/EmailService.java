package vn.cmc.skillsheet.service;

import java.io.IOException;

import javax.mail.MessagingException;

import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.RequestApproval;

public interface EmailService {
    public boolean sendUpdateRequestEmailToStaff() throws MessagingException, IOException;

    public boolean sendCreatedEmailToCandidate(Candidate candidate, String requestedBy)
            throws MessagingException, IOException, Exception;

    public boolean sendRequestApproveToPIC(String picEmail, String picName,
            RequestApproval savedRequestApproval, String requestedBy) throws MessagingException, IOException, Exception;

    public boolean sendApprovedOrRejectedToStaff(String email, String fullName, String status, String comment)
			throws MessagingException, IOException, Exception;
    
    public boolean sendEmailNotificationForRecruiter(String recruiterEmail, String recruiterName, String candidateName, String requestedBy);
	
	public boolean notificationSubmittedToCandidate(String candidateEmail, String candidateName, String requestedBy);
	public boolean sendUpdatedEmailToStaff(Profile profile, String comment, String username) throws MessagingException, IOException;
}
