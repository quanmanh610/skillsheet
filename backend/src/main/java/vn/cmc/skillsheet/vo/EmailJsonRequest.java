package vn.cmc.skillsheet.vo;

import java.util.List;

public class EmailJsonRequest {
    private String emailId;

    private List<String> idSelectedLst;

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public List<String> getIdSelectedLst() {
        return idSelectedLst;
    }

    public void setIdSelectedLst(List<String> idSelectedLst) {
        this.idSelectedLst = idSelectedLst;
    }

}
