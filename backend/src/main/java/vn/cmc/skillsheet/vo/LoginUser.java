package vn.cmc.skillsheet.vo;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class LoginUser implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 5141230919245600030L;
    private int id;
    private String fullName;
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private String phone;
    private String dateOfBirth;
    private List<LoginRole> roles;
    private String du;
    private String group;
    private String availableTime;
    private String bookedProject;
    private String bookedFromTo;
}
