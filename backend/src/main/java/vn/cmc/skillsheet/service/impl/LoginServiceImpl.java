package vn.cmc.skillsheet.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;

import org.apache.commons.lang3.ObjectUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import vn.cmc.skillsheet.constant.SystemConst;
import vn.cmc.skillsheet.constant.SystemRole;
import vn.cmc.skillsheet.constant.UrlConst;
import vn.cmc.skillsheet.dto.LoginDto;
import vn.cmc.skillsheet.dto.RegisterDTO;
import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.logic.CandidateLogic;
import vn.cmc.skillsheet.logic.EncryptDecryptLogic;
import vn.cmc.skillsheet.logic.LoginLogic;
import vn.cmc.skillsheet.repository.CandidateRepository;
import vn.cmc.skillsheet.repository.StaffRepository;
import vn.cmc.skillsheet.service.LoginService;
import vn.cmc.skillsheet.util.JwtUtil;
import vn.cmc.skillsheet.util.StringUtils;
import vn.cmc.skillsheet.vo.*;

/**
 *
 * @author hunghq7
 *
 */
@Service
public class LoginServiceImpl implements LoginService {

    @Value("${POA_LOGIN_URL}")
    private String POA_LOGIN_URL;

    @Value("${POA_VALID_TOKEN_URL}")
    private String POA_VALID_TOKEN_URL;

    @Autowired
    private LoginLogic logic;


    @Autowired
    private CandidateLogic candidateLogic;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EncryptDecryptLogic encryptDecryptLogic;

    @Autowired
    private CandidateRepository candidateRepository;

    /**
     *
     * @param userName
     * @param password
     * @return
     */
    private LoginRequest createLoginRequest(LoginInfo info) {
        LoginPayload payload = new LoginPayload();
        payload.setUsername(info.getUsername());
        payload.setPassword(info.getPassword());
        payload.setKey(SystemConst.SYSTEM_KEY);
        payload.setSecret(SystemConst.SYSTEM_SECRET);
        return new LoginRequest(payload);
    }

//    /**
//     * check user has role
//     *
//     * @param loginResponse
//     * @param role
//     * @return
//     */
//    private boolean hasRole(LoginResponse loginResponse, String role) {
//        List<LoginRole> roles = loginResponse.getUser().getRoles();
//
//        if (roles.size() > 0) {
//            for (LoginRole loginRole : roles) {
//                if (loginRole.getKey().equals(role)) {
//                    return true;
//                }
//            }
//        }
//        return false;
//    }

    @Override
    public LoginResponse login(LoginDto inDto) throws IOException {
        String userName = inDto.getInfo().getUsername();
        String password = inDto.getInfo().getPassword();

        // check empty
        if (userName.isEmpty() || password.isEmpty()) {
            // TODO show mess E-sxxxx
        }

        // connect POA
        RestTemplate restTemplate = new RestTemplate();
        LoginRequest loginRequest = this.createLoginRequest(inDto.getInfo());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<LoginRequest> entity = new HttpEntity<>(loginRequest, headers);
        ResponseEntity<LoginResponse> response = restTemplate.postForEntity(POA_LOGIN_URL,
                entity, LoginResponse.class);

        LoginResponse loginResponse = response.getBody();

        if (loginResponse.getErrorMessage() != null) {
            throw new RuntimeException(loginResponse.getErrorMessage());
        }

        Staff staff = staffRepository.findOneByUserName(userName);
        String roles = "";
        for (int i = 0; i < loginResponse.getUser().getRoles().size(); i++) {
            if (loginResponse.getUser().getRoles().get(i).isEnabled()) {
                if (i == 0) {
                    roles = roles + loginResponse.getUser().getRoles().get(i).getKey();
                } else {
                    roles = roles + ";" + loginResponse.getUser().getRoles().get(i).getKey();
                }
            }
        }
        if (staff == null) {
            staff = new Staff();
            staff.setUserName(userName);
            staff.setFullName(loginResponse.getUser().getFullName());
            Date now = new Date();
            staff.setCreatedDate(now);
            staff.setUpdatedDate(now);
            staff.setEmail(loginResponse.getUser().getEmail());

            try {
                String jsonResponse = restTemplate.getForObject(UrlConst.GATEWAY_GET_USER_GROUP_URI + userName, String.class);
                JSONObject jsonObject = new JSONObject(jsonResponse);
                if (jsonObject.has("groupName")) {
                    staff.setDu(jsonObject.getString("groupName"));
                }

                if (jsonObject.has("parentName")) {
                    staff.setStaffGroup(jsonObject.getString("parentName"));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (staff != null) {
            staff.setRoles(roles);
            staff.setToken(vn.cmc.skillsheet.util.StringUtils.hashString(loginResponse.getToken()));
            staffRepository.save(staff);
        }

        loginResponse.getUser().setDu(staff.getDu());
        loginResponse.getUser().setGroup(staff.getStaffGroup());

        //loginResponse.getUser().setEmail(staff.getEmail());

        loginResponse.setLoginCount(logic.getStaffLoginCount(userName));

        return loginResponse;
    }

    @Override
    public LoginResponse loginCandidate(String encodedAccessToken, String accessCode) {
        LoginResponse loginResponse = new LoginResponse();
        String accessToken = new String(Base64.getDecoder().decode(encodedAccessToken));
        String subject = jwtUtil.extractSubject(accessToken);
        String[] parts = subject.split(Pattern.quote("|"));

        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid access token");
        }

        Candidate candidate = candidateLogic.getCandidateByEmailAndRole(parts[0], parts[1]);

        if (candidate == null) {
            throw new IllegalArgumentException("Invalid access token");
        }

        if (jwtUtil.isTokenExpired(accessToken)) {
            throw new IllegalArgumentException("Token is expired");
        }

        if (!StringUtils.hashString(accessCode).equals(candidate.getAccessCode())) {
            throw new IllegalArgumentException("Invalid access code");
        }

        if (candidate.getStatus().equals("inactive")) {
            loginResponse.setStatus("inactive");
            return loginResponse;
        }

        LoginUser loginUser = new LoginUser();
        loginUser.setEmail(candidate.getEmail());
        loginUser.setFullName(candidate.getFullName());
        loginUser.setUserName(candidate.getFullName());
        loginResponse.setUser(loginUser);
        loginResponse.setToken("FAKE-" + encodedAccessToken);
        loginResponse.setIsCandidate(true);
        loginResponse.setCandidateRole(candidate.getRoleName());
        loginResponse.setStep(candidate.getStep());
//        if ("new".equals(candidate.getStatus())) {
//            candidate.setStatus("active");
//            candidateLogic.updateCandidate(candidate);
//        }
        return loginResponse;
    }

    @Override
    public ResponseEntity<Object> loginCandidateWithUsernameAndPassword(LoginInfo info) {
        LoginResponse loginResponse = new LoginResponse();
        String username = info.getUsername();
        String password = info.getPassword();
        // decode password

        try {
            password = encryptDecryptLogic.encrypt(password);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body("encrypt password failed !!!");
        }

        Candidate loginCandidate = candidateRepository.findCandidateByFullNameAndPassword(username , password);
        if(ObjectUtils.isEmpty(loginCandidate)){
            return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, "Invalid username or password"),
                    HttpStatus.OK);
        }
        String token = jwtUtil.generateToken(loginCandidate.getFullName(), loginCandidate.getRoleName());
        token = Base64.getEncoder().encodeToString(token.getBytes());
        LoginUser loginUser = new LoginUser();
        loginUser.setEmail(loginCandidate.getEmail());
        loginUser.setFullName(loginCandidate.getFullName());
        loginUser.setUserName(loginCandidate.getFullName());
        loginUser.setRoles(externalLoginRole());
        loginResponse.setUser(loginUser);
        loginResponse.setToken("FAKE-" + token);
        loginResponse.setIsCandidate(true);
        loginResponse.setCandidateRole(loginCandidate.getRoleName());
        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }

    @Override
    public RegisterResponse register(RegisterDTO registerDTO) {
        String fullName = registerDTO.getFullName();
        Candidate candidate = candidateRepository.findByFullName(fullName);
        if(!validateUsername(fullName)){
            throw new IllegalArgumentException("Invalid username !!!");
        }

        if(!ObjectUtils.isEmpty(candidate)){
            throw new IllegalArgumentException("User is already exist !!!");
        }

        Candidate registerCandidate = createCandidate(registerDTO);
        if(ObjectUtils.isEmpty(registerCandidate)){
            throw new IllegalArgumentException("Create User failed !!!");
        }

        return new RegisterResponse(HttpStatus.OK.value() , HttpStatus.OK.getReasonPhrase() , "Create User success !!!");
    }

    private boolean validateUsername(String username){
        Pattern usernamePattern = Pattern.compile("^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$");
        Pattern emailPattern = Pattern.compile("^(.+)@(.+)$");
        if(usernamePattern.matcher(username).matches()){
            return true;
        }

        if(emailPattern.matcher(username).matches()){
            return true;
        }
        return false;
    }

    private Candidate createCandidate(RegisterDTO registerDTO){
        Candidate candidate = new Candidate();
        candidate.setFullName(registerDTO.getFullName());
        candidate.setJob(registerDTO.getJob());
        candidate.setSchool(registerDTO.getSchool());
        try{
            String password = encryptDecryptLogic.encrypt(registerDTO.getPassword());
            candidate.setPassword(password);
        }
        catch (Exception e){
            throw new RuntimeException("Can not Crypt this password !!!");
        }

        candidate.setSkill(registerDTO.getSkills());
        candidate.setExperience(registerDTO.getExperience());
        candidate.setSchool(registerDTO.getSchool());
        candidate.setRoleName(SystemRole.EXTERNAL);
        candidate.setCreatedDate(new Date());
        return candidateRepository.save(candidate);
    }

//    @Override
//    public LoginResponse loginCandidate(String candidateId) {
//        LoginResponse loginResponse = new LoginResponse();
//        loginResponse.setStatus("");
//        String[] decryptsss;
//        Date now = new Date();
//        int id;
//        Date expried;
//        Calendar c = Calendar.getInstance();
//        Candidate candidate;
//        try {
//            String decryptString = encryptDecryptLogic.decrypt(candidateId);
//            decryptsss = decryptString.split("@x@Y@z@X@y@Z@");
//            id = Integer.parseInt(decryptsss[2]);
//        } catch (Exception e) {
//            loginResponse.setStatus("linknotcorrect");
//            return loginResponse;
//        }
//        try {
//            candidate = candidateLogic.getCandidate(id);
//            if (null == candidate) {
//                loginResponse.setStatus("notexisting");
//                return loginResponse;
//            }
//            if (!StringUtils.substringBetween(candidate.getLinkRequest(),
//                    "/loginCandidate?candidateId=", "&fullName=").equals(candidateId)) {
//                loginResponse.setStatus("linknotcorrect");
//                return loginResponse;
//            }
//        } catch (Exception e) {
//            loginResponse.setStatus("notexisting");
//            return loginResponse;
//        }
//        if ("inactive".equals(candidate.getStatus())) {
//            loginResponse.setStatus("inactive");
//            return loginResponse;
//        }
//        c.setTime(candidate.getSendDate());
//        c.add(Calendar.DATE, 5);
//        expried = c.getTime();
//        if (expried.compareTo(now) < 0) {
//            loginResponse.setStatus("expried");
//            return loginResponse;
//        }
//        LoginUser loginUser = new LoginUser();
//        loginUser.setEmail(candidate.getEmail());
//        loginUser.setFullName(candidate.getFullName());
//        loginUser.setUserName(candidate.getFullName());
//        loginResponse.setUser(loginUser);
//        loginResponse.setToken("FAKE-D8stt9EDDd1kgVKvCuA54nqNVbiyq_-xDdNAbDh-3dE");
//        loginResponse.setCandidate(true);
//        loginResponse.setCandidateRole(candidate.getRoleName());
//        if ("new".equals(candidate.getStatus())) {
//            candidate.setStatus("active");
//            candidateLogic.updateCandidate(candidate);
//        }
//        return loginResponse;
//    }

    @Override
    public ResponseEntity<Object> validToken(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        RestTemplate restTemp = new RestTemplate();
        JSONObject jsonRequest = new JSONObject();
        jsonRequest.put("token", token);
        JSONObject payloadInfo = new JSONObject();
        payloadInfo.put("key", SystemConst.SYSTEM_KEY);
        payloadInfo.put("secret", SystemConst.SYSTEM_SECRET);
        jsonRequest.put("payload", payloadInfo);

        HttpEntity<String> request = new HttpEntity<String>(jsonRequest.toString(), headers);

        return restTemp.postForEntity(POA_VALID_TOKEN_URL, request, Object.class);

    }

    @Override
    public int increaseLoginCount(String username) {
        Staff foundStaff = staffRepository.findOneByUserName(username);
        if (foundStaff == null) {
            throw new RuntimeException("Could not find user: " + username);
        }

        foundStaff.setLoginCount(foundStaff.getLoginCount() + 1);
        Staff staff = staffRepository.save(foundStaff);
        return staff.getLoginCount();
    }

    private List<LoginRole> externalLoginRole(){
        List<LoginRole> list = new ArrayList<>();
        list.add(createLoginRole());
        return list;
    }

    private LoginRole createLoginRole(){
        LoginRole loginRole = new LoginRole();
        loginRole.setName(SystemRole.EXTERNAL);
        loginRole.setKey(SystemRole.EXTERNAL);
        loginRole.setEnabled(true);
        return loginRole;
    }
}
