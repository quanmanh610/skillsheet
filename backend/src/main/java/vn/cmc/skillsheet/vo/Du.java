package vn.cmc.skillsheet.vo;

import java.util.List;

import lombok.Data;

@Data
public class Du {

    String name;
    String description;
    List<Manager> manager;

}
