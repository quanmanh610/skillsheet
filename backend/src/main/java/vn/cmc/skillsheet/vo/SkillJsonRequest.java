package vn.cmc.skillsheet.vo;

import java.util.List;

public class SkillJsonRequest {
    private String skillId;

    private List<String> idSelectedLst;

    public String getSkillId() {
        return skillId;
    }

    public void setSkillId(String skillId) {
        this.skillId = skillId;
    }

    public List<String> getIdSelectedLst() {
        return idSelectedLst;
    }

    public void setIdSelectedLst(List<String> idSelectedLst) {
        this.idSelectedLst = idSelectedLst;
    }

}
