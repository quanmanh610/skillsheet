package vn.cmc.skillsheet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CheckPermissionPayloadDTO {
	private String key;
	private String secret;
	private String activityKey;
	private String permissionKey;
}
