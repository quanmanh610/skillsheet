package vn.cmc.skillsheet.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse implements Serializable {
    private int code;
    private String status;
    private String message;
}
