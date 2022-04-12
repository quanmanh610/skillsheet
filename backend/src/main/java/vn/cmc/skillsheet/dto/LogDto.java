package vn.cmc.skillsheet.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.ChangeHistory;
import vn.cmc.skillsheet.entity.ProjectRole;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogDto {

    private List<ChangeHistory> changeHistories;

    private long totalElements;
    
}
