package vn.cmc.skillsheet.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.cmc.skillsheet.entity.RequestApproval;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestApprovalDto {

    private List<RequestApproval> requestApprovals;
    
    private RequestApproval selectedRequestApproval;

    private long totalElements;
}
