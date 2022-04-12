package vn.cmc.skillsheet.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileHome {
    
    private int profileId;
    
    private String roleName;
    
    private String status;
    
    private String du;
    
    private String profileGroup;
    
    private String type;
    
    private String account;
    
    private String fullName;

    private String groupSkills;
    
    private String groupLanguages;
    
    private String groupCertificates;

    private String bestSkills;
    private String availableTime;
    private String bookedProject;
    private String bookedFromTo;    
}
