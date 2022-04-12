package vn.cmc.skillsheet.vo;

import java.util.List;

public class RequestApprovalJson {

	    private String requestApprovalId;

	    private List<String> idSelectedLst;

	    public String getRequestApprovalId() {
			return requestApprovalId;
		}

		public void setRequestApprovalId(String requestApprovalId) {
			this.requestApprovalId = requestApprovalId;
		}

		public List<String> getIdSelectedLst() {
	        return idSelectedLst;
	    }

	    public void setIdSelectedLst(List<String> idSelectedLst) {
	        this.idSelectedLst = idSelectedLst;
	    }

}
