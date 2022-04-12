package vn.cmc.skillsheet.vo;

public final class LoginRequest {
    
    public LoginRequest(LoginPayload payload) {
        this.payload = payload;
    }

    private LoginPayload payload;

    public LoginPayload getPayload() {
        return payload;
    }

    public void setPayload(LoginPayload payload) {
        this.payload = payload;
    }

}
