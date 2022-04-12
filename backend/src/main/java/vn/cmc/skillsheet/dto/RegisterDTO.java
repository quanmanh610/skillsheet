package vn.cmc.skillsheet.dto;

import lombok.Data;

@Data
public class RegisterDTO {
    private String fullName;
    private String password;
    private String job;
    private String experience;
    private String school;
    private String skills;
}
