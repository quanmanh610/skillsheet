package vn.cmc.skillsheet.vo;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateCvPull {
    private Integer id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private String level;
    private String job;
    private String sex;
    private String language;
    private int experience;
    private int channel;
    private String introducer;
    private String school;
    private String degree;
    private String linkCv;
    private String skills;
    private String location;
    private LocalDate applySince;
    private LocalDate birthDay;
    private String note;
}
