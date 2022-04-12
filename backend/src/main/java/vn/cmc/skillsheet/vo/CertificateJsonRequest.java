package vn.cmc.skillsheet.vo;

import java.util.List;

public class CertificateJsonRequest {
    private String certificationId;

    private List<String> idSelectedLst;

    public String getCertificationId() {
        return certificationId;
    }

    public void setCertificationId(String certificationId) {
        this.certificationId = certificationId;
    }

    public List<String> getIdSelectedLst() {
        return idSelectedLst;
    }

    public void setIdSelectedLst(List<String> idSelectedLst) {
        this.idSelectedLst = idSelectedLst;
    }

}
