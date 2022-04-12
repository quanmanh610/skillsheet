package vn.cmc.skillsheet.dto;

import java.util.List;

import lombok.Data;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.Version;

@Data
public class VersionDto {
    
    private List<Version> versionList;

    private Version version;

    private Profile profile;
    
    private long totalElements;


}
