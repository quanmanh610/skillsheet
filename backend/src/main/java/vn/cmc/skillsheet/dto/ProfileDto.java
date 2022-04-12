package vn.cmc.skillsheet.dto;

import java.util.List;

import lombok.Data;
import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.vo.ProfileHome;

@Data
public class ProfileDto {

    private List<ProfileHome> profileHomes;

    private long totalElements;

    private Profile selectProfile;
    
    private List<Profile> profileList;
    
    private int selectedProfileId;

}
