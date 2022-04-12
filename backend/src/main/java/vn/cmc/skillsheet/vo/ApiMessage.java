package vn.cmc.skillsheet.vo;

import org.springframework.http.HttpStatus;

public class ApiMessage {
    private HttpStatus status;
    private String errorMessage;

    public ApiMessage(HttpStatus status, String message) {
        this.status = status;
        this.errorMessage = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}
