package vn.cmc.skillsheet.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.ObjectUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import vn.cmc.skillsheet.constant.MessageConst;
import vn.cmc.skillsheet.constant.SystemConst;
import vn.cmc.skillsheet.constant.UrlConst;
import vn.cmc.skillsheet.dto.CheckPermissionDTO;
import vn.cmc.skillsheet.dto.CheckPermissionPayloadDTO;
import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.logic.CandidateLogic;
import vn.cmc.skillsheet.logic.impl.CandidateLogicImpl;
import vn.cmc.skillsheet.repository.ProfileRepository;
import vn.cmc.skillsheet.repository.StaffRepository;
import vn.cmc.skillsheet.util.JwtUtil;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Log4j2
public class CorsFilterRequest extends AbstractAuthenticationProcessingFilter implements Filter {

	public CorsFilterRequest() {
		super("/api/**");
	}

	@Value("${POA_PERMISSION_URL}")
	private String POA_PERMISSION_URL;

	@Autowired
	private StaffRepository staffRepository;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private CandidateLogic candidateLogic;

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {

		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;

		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
		response.setHeader("Access-Control-Max-Age", "3600");
		response.setHeader("Access-Control-Allow-Headers", "*");
		response.addHeader("Access-Control-Expose-Headers", "xsrf-token");
		String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		String method = request.getMethod();
		String activityKey = request.getHeader("activityKey");
		String userName = request.getHeader("userName");
		String paramUrl = "";
		String requestUri = request.getRequestURI();
		String queryString = request.getQueryString();
		String action = "";
		if (requestUri.startsWith("/api")) {
			String[] parts = requestUri.split("/");
			paramUrl = "/" + parts[2];
			if (parts.length >= 4) {
				action = parts[3];
			}
		}

		if (!(method.equals("POST") || method.equals("GET")) || paramUrl.isEmpty() ||
				(paramUrl.equals("/setting") && action.equals("downloadTemplateProfile"))) {
			chain.doFilter(request, response);
			return;
		}

		Map<String, String> mapParam = new HashMap<>();
		mapParam.put("token", authHeader);

		if (paramUrl.startsWith("/login") || paramUrl.equalsIgnoreCase("/logout") || paramUrl.equalsIgnoreCase("/register")) {
			vn.cmc.skillsheet.entity.Staff staff = staffRepository.findOneByUserName(userName);
			setStaffAuthentication(req, staff);
			chain.doFilter(request, response);
		} else if(paramUrl.startsWith("/public")){
			chain.doFilter(request, response);
		} else  {
			if (authHeader != null) {
				if (!method.equalsIgnoreCase("get")) {
					String token = authHeader.replace("Bearer ", "");
					if (token.startsWith("FAKE-")) {
						try {
							token = token.replace("FAKE-", "");
							verifyCandidateToken(token);
						} catch (Exception e) {
							response.getWriter().write(e.getMessage());
							return;
						}
						setStaffAuthentication(request, null);
						chain.doFilter(request, response);
						return;
					}

					HttpHeaders headers = new HttpHeaders();
					RestTemplate restTemplate = new RestTemplate();
					headers.setContentType(MediaType.APPLICATION_JSON);
					headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
					CheckPermissionDTO checkPermission = new CheckPermissionDTO();
					CheckPermissionPayloadDTO payload = new CheckPermissionPayloadDTO(SystemConst.SYSTEM_KEY,
							SystemConst.SYSTEM_SECRET, activityKey, paramUrl);
					checkPermission.setToken(token);
					checkPermission.setPayload(payload);
					HttpEntity<CheckPermissionDTO> entity = new HttpEntity<>(checkPermission, headers);
					String permission = ((RestTemplate) restTemplate).postForObject(POA_PERMISSION_URL, entity,
							String.class);
					JSONObject jsonObject = new JSONObject(permission);
					if (jsonObject.getBoolean("value") == false) {
						response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
						try {
							if (jsonObject.has("errorMessage")) {
								response.getWriter().write(jsonObject.getString("errorMessage"));
							} else {
								response.getWriter().write(MessageConst.MSG_NO_PERMISSION);
							}
						} catch (Exception e) {
							response.getWriter().write(MessageConst.MSG_NO_PERMISSION);
						}
						return;
					} else {
						vn.cmc.skillsheet.entity.Staff staff = staffRepository.findOneByUserName(userName);
						setStaffAuthentication(req, staff);

						chain.doFilter(request, response);
					}
				} else {
					Map<String, List<String>> allowGetActions = new HashMap<>();
					allowGetActions.put("/setting", new ArrayList<String>());
					allowGetActions.get("/setting").add("getSkillList");
					allowGetActions.get("/setting").add("getSkillNameList");
					allowGetActions.get("/setting").add("getLanguageList");
					allowGetActions.get("/setting").add("getSchoolList");
					allowGetActions.get("/setting").add("getCertificateList");
					allowGetActions.get("/setting").add("getProjectroleList");
					allowGetActions.get("/setting").add("getTemplateProfileList");
					allowGetActions.get("/setting").add("downloadTemplateProfile");

					boolean allowGet = false;
					if (allowGetActions.containsKey(paramUrl)) {
						if (allowGetActions.get(paramUrl).contains(action)) {
							allowGet = true;
						}
					}

					if (allowGet) {
						String token = authHeader.replace("Bearer ", "");
						if (token.startsWith("FAKE-")) {
							try {
								token = token.replace("FAKE-", "");
								verifyCandidateToken(token);
							} catch (Exception e) {
								response.getWriter().write(e.getMessage());
								return;
							}
							setStaffAuthentication(request, null);
							chain.doFilter(request, response);
						} else {
							vn.cmc.skillsheet.entity.Staff staff = staffRepository.findOneByUserName(userName);
							setStaffAuthentication(req, staff);
							chain.doFilter(request, response);
						}
					} else {
						response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
						response.getWriter().write(MessageConst.MSG_NO_PERMISSION);
					}
				}

			} else {
				if (method.equalsIgnoreCase("get")) {
					Map<String, List<String>> allowGetActions = new HashMap<>();
					allowGetActions.put("/setting", new ArrayList<String>());
					allowGetActions.get("/setting").add("getSkillList");
					allowGetActions.get("/setting").add("getSkillNameList");
					allowGetActions.get("/setting").add("getLanguageList");
					allowGetActions.get("/setting").add("getSchoolList");
					allowGetActions.get("/setting").add("getCertificateList");
					allowGetActions.get("/setting").add("getProjectroleList");
					boolean allowGet = false;
					if (allowGetActions.containsKey(paramUrl)) {
						if (allowGetActions.get(paramUrl).contains(action)) {
							allowGet = true;
						}
					}

					if (allowGet) {
						vn.cmc.skillsheet.entity.Staff staff = staffRepository.findOneByUserName(userName);
						setStaffAuthentication(req, staff);
						chain.doFilter(request, response);
					} else {
						response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
						response.getWriter().write(MessageConst.MSG_NO_PERMISSION);
					}
				} else {
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					response.getWriter().write(MessageConst.MSG_NO_PERMISSION);
				}
			}
		}
	}

	private void setStaffAuthentication(ServletRequest req, vn.cmc.skillsheet.entity.Staff staff)
			throws JsonProcessingException {
		// Integer groupUser = groupUserRepository.getGroupUserInTime(time.toString(),
		// time.toString(), findByUserName.getUserId());
		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		String json = ow.writeValueAsString(staff);
		UserDetails userDetail = new User(json, "", new ArrayList<>());
		UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetail, null,
				userDetail.getAuthorities());
		authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails((HttpServletRequest) req));
		SecurityContextHolder.getContext().setAuthentication(authentication);
	}

	private void verifyCandidateToken(String encodedAccessToken) {
		String accessToken = new String(Base64.getDecoder().decode(encodedAccessToken));
		String subject = jwtUtil.extractSubject(accessToken);
		String[] parts = subject.split(Pattern.quote("|"));
		if (parts.length != 2) {
			throw new IllegalArgumentException("Invalid access token");
		}

		Candidate candidate = candidateLogic.getCandidateByEmailAndRole(parts[0], parts[1]);

		if (candidate == null) {
			candidate = candidateLogic.getCandiDateByFullNameAndRole(parts[0], parts[1]);
			if(!ObjectUtils.isEmpty(candidate)) throw new IllegalArgumentException("Invalid access token");
		}

		if (jwtUtil.isTokenExpired(accessToken)) {
			throw new IllegalArgumentException("Token is expired");
		}

		if (candidate.getStatus().equals("inactive")) {
			throw new IllegalArgumentException("Profile is inactive");
		}
	}

	@Override
	public void destroy() {
	}

	public boolean checkPathvariable(String sourse) {
		String[] elemOfParam = sourse.split("/");
		for (String ele : elemOfParam) {
			if (!sourse.contains(ele)) {
				return false;
			}
		}
		return true;
	}

	@Override
	@Autowired
	public void setAuthenticationManager(AuthenticationManager authenticationManager) {
		super.setAuthenticationManager(authenticationManager);
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException, IOException, ServletException {
		// TODO Auto-generated method stub
		return null;
	}
}
