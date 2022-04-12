package vn.cmc.skillsheet.logic;

import java.io.IOException;
import java.security.InvalidKeyException;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.mail.MessagingException;

import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.RequestApproval;
import vn.cmc.skillsheet.entity.Staff;

public interface EmailLogic {
    /**
     * 
     * @param
     * @return
     * @throws IOException
     * @throws MessagingException
     */
    public boolean sendUpdateRequestEmail(String email, Staff staff)
            throws MessagingException, IOException;

    /**
     * 
     * @param
     * @return
     * @throws IOException
     * @throws MessagingException
     * @throws NoSuchPaddingException
     * @throws InvalidKeyException
     * @throws BadPaddingException
     * @throws IllegalBlockSizeException
     * @throws Exception
     */
    public boolean sendCreatedEmailToCandidate(Candidate candidate, String requestedBy)
            throws MessagingException, IOException;
    
    public boolean  sendRequestApproveToPIC(String picEmail, String picName, RequestApproval savedRequestApproval, String requestedBy)
            throws MessagingException, IOException;

    public boolean sendApprovedOrRejectedToStaff(String email, String fullName, String status, String comment)
		    throws MessagingException, IOException;
    public boolean sendUpdatedEmailToStaff(Profile profile, String comment, String username)
            throws MessagingException, IOException;
    
    public boolean sendEmailNotificationForRecruiter(String recruiterEmail, String recruiterName, String candidateName, String requestedBy) throws MessagingException, IOException;
    
    public boolean notificationSubmittedToCandidate(String candidateEmail, String candidateName, String requestedBy) throws MessagingException, IOException;
}
