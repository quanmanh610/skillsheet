package vn.cmc.skillsheet.service.impl;

import java.io.IOException;
import java.util.List;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.RequestApproval;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.logic.EmailLogic;
import vn.cmc.skillsheet.logic.StaffLogic;
import vn.cmc.skillsheet.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {
    @Autowired
    private EmailLogic emailLogic;

    @Autowired
    private StaffLogic staffLogic;

    @Override
    public boolean sendUpdateRequestEmailToStaff() throws MessagingException, IOException {
        List<Staff> staffList = staffLogic.getStaffList();
        boolean success = true;
        for (int i = 0; i < staffList.size(); i++) {
            if (null != staffList.get(i).getEmail() && !"".equals(staffList.get(i).getEmail()))
                success = emailLogic.sendUpdateRequestEmail(staffList.get(i).getEmail(),
                        staffList.get(i));
            if (success == false) {
                break;
            }            
        }
        return success;
    }

    @Override
    public boolean sendCreatedEmailToCandidate(Candidate candidate, String requestedBy)
            throws MessagingException, IOException {
        try {
            emailLogic.sendCreatedEmailToCandidate(candidate, requestedBy);
            return true;
        } catch (Exception e) {
            return false;
        }

    }
            
    @Override
    public boolean sendEmailNotificationForRecruiter(String recruiterEmail, String recruiterName, String candidateName, String requestedBy) {
        try {
            emailLogic.sendEmailNotificationForRecruiter(recruiterEmail, recruiterName, candidateName, requestedBy);
            return true;
        } catch (Exception e) {
            return false;
        }

    }
    
    @Override
    public boolean notificationSubmittedToCandidate(String candidateEmail, String candidateName, String requestedBy) {
        try {
            emailLogic.notificationSubmittedToCandidate(candidateEmail, candidateName, requestedBy);
            return true;
        } catch (Exception e) {
            return false;
        }

    }
    
	@Override
    public boolean sendUpdatedEmailToStaff(Profile profile, String comment, String username)
            throws MessagingException, IOException {
        try {
            emailLogic.sendUpdatedEmailToStaff(profile, comment, username);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean sendRequestApproveToPIC(String picEmail, String picName,
            RequestApproval savedRequestApproval, String requestedBy)
            throws MessagingException, IOException, Exception {
        try {
            emailLogic.sendRequestApproveToPIC(picEmail, picName, savedRequestApproval, requestedBy);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    @Override
    public boolean sendApprovedOrRejectedToStaff(String email, String fullName, String status, String comment)
            throws MessagingException, IOException, Exception {
        try {
            emailLogic.sendApprovedOrRejectedToStaff(email, fullName, status, comment);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
