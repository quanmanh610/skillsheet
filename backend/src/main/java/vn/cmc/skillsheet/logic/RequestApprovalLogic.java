package vn.cmc.skillsheet.logic;

import java.util.List;

import vn.cmc.skillsheet.entity.RequestApproval;

public interface RequestApprovalLogic {

    /**
     * 
     */
    public List<RequestApproval> getRequestApprovalList();

    /**
     * 
     * @param requestApproval
     */
    public RequestApproval updateRequestApproval(RequestApproval requestApproval);

    /**
     * 
     * @param requestApproval
     */
    public RequestApproval addRequestApproval(RequestApproval requestApproval);

    /**
     * 
     * @param requestApprovalId
     */
    public void deleteRequestApproval(int requestApprovalId);
    
    public List<String> getFieldSuggestions(String type, String searchValue);
}
