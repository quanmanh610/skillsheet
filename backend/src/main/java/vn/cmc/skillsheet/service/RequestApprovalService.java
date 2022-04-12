package vn.cmc.skillsheet.service;

import java.util.Date;
import java.util.List;

import vn.cmc.skillsheet.dto.RequestApprovalDto;
import vn.cmc.skillsheet.entity.RequestApproval;
import vn.cmc.skillsheet.vo.FindRequestParams;

public interface RequestApprovalService {

//    public RequestApprovalDto getRequestApprovalsPagination(int page, int size, String column,
//            String sort, String fullName, String roleName, String status, Date from, Date to);
    
    public RequestApprovalDto getRequestApprovalsPagination(FindRequestParams params);
    
    public RequestApproval updateRequestApproval(RequestApproval req);
    
    public List<String> getSuggestions(String type, String searchValue);
}
