package vn.cmc.skillsheet.vo;

import lombok.Data;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.Version;

@Data
public class VersionProfileRespone {

    private Version version;

    private Profile profile;

    private long totalElements;

}
