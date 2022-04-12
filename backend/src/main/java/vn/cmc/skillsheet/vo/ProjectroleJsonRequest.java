package vn.cmc.skillsheet.vo;

import java.util.List;

public class ProjectroleJsonRequest {
    private String projectRoleId;

    private List<String> idSelectedLst;

    public String getProjectRoleId() {
        return projectRoleId;
    }

    public void setProjectRoleId(String projectRoleId) {
        this.projectRoleId = projectRoleId;
    }

    public List<String> getIdSelectedLst() {
        return idSelectedLst;
    }

    public void setIdSelectedLst(List<String> idSelectedLst) {
        this.idSelectedLst = idSelectedLst;
    }

}
