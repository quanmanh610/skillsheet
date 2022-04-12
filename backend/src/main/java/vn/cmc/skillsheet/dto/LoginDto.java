package vn.cmc.skillsheet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.cmc.skillsheet.vo.LoginInfo;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginDto {

    private LoginInfo info;

}
