package vn.cmc.skillsheet.vo;

import java.util.List;

public class TemplateProfileJsonRequest {
    private String templateProfileId;

    private List<String> idSelectedLst;

	public String getTemplateProfileId() {
		return templateProfileId;
	}

	public void setTemplateProfileId(String templateProfileId) {
		this.templateProfileId = templateProfileId;
	}

	public List<String> getIdSelectedLst() {
		return idSelectedLst;
	}

	public void setIdSelectedLst(List<String> idSelectedLst) {
		this.idSelectedLst = idSelectedLst;
	}

}
