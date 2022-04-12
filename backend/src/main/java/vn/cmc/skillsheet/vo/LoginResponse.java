package vn.cmc.skillsheet.vo;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

public class LoginResponse implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -2007191464721800412L;
    private String token;
    private LoginUser user;
    private String refreshToken;
    private List<Object> menuTabs;
    private String code;
    private String status;
    private String errorMessage;
    private String candidateRole;

    //private boolean isStaffLoginFirstTime;
    private int loginCount;

    private boolean isCandidate;

    private int step;

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public LoginUser getUser() {
		return user;
	}

	public void setUser(LoginUser user) {
		this.user = user;
	}

	public String getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}

	public List<Object> getMenuTabs() {
		return menuTabs;
	}

	public void setMenuTabs(List<Object> menuTabs) {
		this.menuTabs = menuTabs;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public String getCandidateRole() {
		return candidateRole;
	}

	public void setCandidateRole(String candidateRole) {
		this.candidateRole = candidateRole;
	}

	public int getLoginCount() {
		return loginCount;
	}

	public void setLoginCount(int loginCount) {
		this.loginCount = loginCount;
	}

	public boolean getIsCandidate() {
		return isCandidate;
	}

	public void setIsCandidate(boolean isCandidate) {
		this.isCandidate = isCandidate;
	}

	public int getStep() {
		return step;
	}

	public void setStep(int step) {
		this.step = step;
	}
    
    
}
