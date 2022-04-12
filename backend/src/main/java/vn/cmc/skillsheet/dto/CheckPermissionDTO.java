package vn.cmc.skillsheet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CheckPermissionDTO {
	private String token;
	private CheckPermissionPayloadDTO payload;
}
