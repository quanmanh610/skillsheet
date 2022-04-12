package vn.cmc.skillsheet.service;

import java.io.IOException;

import org.springframework.http.ResponseEntity;

import vn.cmc.skillsheet.dto.LoginDto;
import vn.cmc.skillsheet.dto.RegisterDTO;
import vn.cmc.skillsheet.vo.LoginInfo;
import vn.cmc.skillsheet.vo.LoginResponse;
import vn.cmc.skillsheet.vo.RegisterResponse;

public interface LoginService {
    /**
     *
     * @param inDto
     * @return
     * @throws IOException
     */
    public LoginResponse login(LoginDto inDto) throws IOException;

    /**
     *
     * @param inDto
     */
    //public LoginResponse loginCandidate(String inDto);

    public LoginResponse loginCandidate(String accessToken, String accessCode);

    public ResponseEntity<Object> loginCandidateWithUsernameAndPassword(LoginInfo info);

    public RegisterResponse register(RegisterDTO registerDTO);

    /**
     *
     * @param token
     * @return
     */
    public ResponseEntity<Object> validToken(String token);

    public int increaseLoginCount(String username);
}
