package vn.cmc.skillsheet.controller;

import java.io.IOException;

import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.ObjectUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import vn.cmc.skillsheet.dto.CandidateLoginDto;
import vn.cmc.skillsheet.dto.LoginDto;
import vn.cmc.skillsheet.dto.RegisterDTO;
import vn.cmc.skillsheet.service.LoginService;
import vn.cmc.skillsheet.vo.*;

@Controller
@Log4j2
public class LoginController {
	@Autowired
	private LoginService loginService;

	@RequestMapping(value = { "/api/login" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> login(@RequestBody LoginInfo loginInfo) throws IOException {
		LoginDto loginDto = new LoginDto();
		loginDto.setInfo(loginInfo);
		LoginResponse res;
		try {
			res = this.loginService.login(loginDto);
			if(ObjectUtils.isEmpty(res)){
				return loginService.loginCandidateWithUsernameAndPassword(loginInfo);
			}
			return new ResponseEntity<>(res, HttpStatus.OK);
		} catch (Exception e) {
			return loginService.loginCandidateWithUsernameAndPassword(loginInfo);
		}
	}



//	@RequestMapping(value = { "/api/loginCandidate" }, method = RequestMethod.POST)
//	@ResponseBody
//	public ResponseEntity<Object> loginCandidate(@RequestBody String candidateId) throws IOException {
//		JSONObject obj = new JSONObject(candidateId);
//		String encrp = obj.getString("candidateId").replace(" ", "+");
//		LoginResponse res = loginService.loginCandidate(encrp);
//		if ("linknotcorrect".equals(res.getStatus())) {
//			return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, "The link is not correct!"), HttpStatus.OK);
//		}
//		if ("notexisting".equals(res.getStatus())) {
//			return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, "The user is not existing!"), HttpStatus.OK);
//		}
//		if ("inactive".equals(res.getStatus())) {
//			return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, "The user is disabled!"), HttpStatus.OK);
//		}
//		if ("expried".equals(res.getStatus())) {
//			return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, "The link is expried!"), HttpStatus.OK);
//		}
//		return new ResponseEntity<>(res, HttpStatus.OK);
//	}

	@RequestMapping(value = { "/api/loginCandidate" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<?> loginCandidate(@RequestBody CandidateLoginDto candidateLoginDto) throws IOException {
		try {
			LoginResponse loginResponse = loginService.loginCandidate(candidateLoginDto.getAccessToken(), candidateLoginDto.getAccessCode());
			return ResponseEntity.ok(loginResponse);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

//	@RequestMapping(value = { "/api/login-test" }, method = RequestMethod.POST)
//	@ResponseBody
//	public ResponseEntity<Object> loginTesting(@RequestBody LoginInfo loginInfo){
//		try {
//			LoginResponse loginResponse = loginService.loginCandidateWithUsernameAndPassword(loginInfo);
//			return ResponseEntity.ok(loginResponse);
//		}
//		catch (IllegalArgumentException e) {
//			return ResponseEntity.badRequest().body(e.getMessage());
//		} catch (Exception e) {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
//		}
//	}
//
	@RequestMapping(value = { "/api/register" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO){
		try{
			RegisterResponse registerResponse = loginService.register(registerDTO);
			return ResponseEntity.ok(registerResponse);
		}
		catch (IllegalArgumentException e){
			return ResponseEntity.badRequest().body(e.getMessage());
		}
		catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
//	@RequestMapping(value = { "/api/login/validToken" }, method = RequestMethod.POST)
//	@ResponseBody
//	public ResponseEntity<Object> validToken(@RequestBody LoginRequestJson loginRequest) {
//		return this.loginService.validToken(loginRequest.getToken());
//	}

	@RequestMapping(value = { "/api/login/increaseLoginCount" })
	public ResponseEntity<?> increaseLoginCount(@RequestHeader("userName") String username) {
		try {
			int loginCount = loginService.increaseLoginCount(username);
			return ResponseEntity.ok(loginCount);
		} catch(RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
}
