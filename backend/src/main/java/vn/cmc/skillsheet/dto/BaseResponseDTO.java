package vn.cmc.skillsheet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class BaseResponseDTO<T> implements Serializable {
    private HttpStatus status;
    private String message;
    private T data;
}
