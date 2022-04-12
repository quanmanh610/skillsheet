package vn.cmc.skillsheet.vo;
import java.util.Date;

import lombok.Data;

@Data
public class TimeAndProject {

    Date availableTime;
    ProjectBooked projectBooked;
}
