package vn.cmc.skillsheet.vo;

import java.util.List;

import lombok.Data;

@Data
public class Department {
    
    String name;
    String desciption;
    List<Manager> manager;
    List<Du> listChild;


}
