package vn.cmc.skillsheet.vo;

import java.util.List;

public class SchoolJsonRequest {
    private String schoolId;

    private List<String> idSelectedLst;

    public String getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(String schoolId) {
        this.schoolId = schoolId;
    }

    public List<String> getIdSelectedLst() {
        return idSelectedLst;
    }

    public void setIdSelectedLst(List<String> idSelectedLst) {
        this.idSelectedLst = idSelectedLst;
    }

}
