package vn.cmc.skillsheet.controller;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import vn.cmc.skillsheet.dto.RequestApprovalDto;
import vn.cmc.skillsheet.dto.SettingDto;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.RequestApproval;
import vn.cmc.skillsheet.entity.School;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.entity.Version;
import vn.cmc.skillsheet.repository.ProfileRepository;
import vn.cmc.skillsheet.repository.RequestApprovalRepository;
import vn.cmc.skillsheet.repository.StaffRepository;
import vn.cmc.skillsheet.service.EmailService;
import vn.cmc.skillsheet.service.RequestApprovalService;
import vn.cmc.skillsheet.util.Messages;
import vn.cmc.skillsheet.util.RoleUtil;
import vn.cmc.skillsheet.util.StringUtils;
import vn.cmc.skillsheet.vo.ApiMessage;
import vn.cmc.skillsheet.vo.FindRequestParams;

@Controller
public class RequestApprovalController {

    @Autowired
    ApplicationContext context;

    @Autowired
    private RequestApprovalService requestApprovalService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private ProfileRepository profileRepo;
    
    @Autowired
    private RequestApprovalRepository requestRepo;
    
    @Autowired
	private StaffRepository staffRepository;

    @SuppressWarnings("deprecation")
    @RequestMapping(value = {
            "/api/request/getRequestManagementList" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getRequestManagementList(@RequestBody String pagination)
            throws IOException {
        JSONObject obj = new JSONObject(pagination);
        
        String token = obj.getString("token");
        token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canViewRequestApprovalList(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        int page = obj.getInt("page");
        int size = obj.getInt("size");
        String column = obj.getString("column");
        String sort = obj.getString("sort");
        String fullName = obj.getString("fullName");
        String roleName = obj.getString("roleName");
        String status = obj.getString("status");
        String group = obj.getString("group");
        String du = obj.getString("du");
        String picEmail = obj.getString("picEmail");
        Date from;
        Date to;

        if ("".equals(obj.getString("from"))) {
            from = new Date("01/01/1976");
        } else {
            from = new Date(obj.getString("from").replaceAll(" - ", "/"));
        }
        if ("".equals(obj.getString("from"))) {
            to = new Date();
        } else {
            to = new Date(obj.getString("to").replaceAll(" - ", "/"));
        }

        FindRequestParams params = new FindRequestParams();
        params.setFullName(fullName);
        params.setRoleName(roleName);
        params.setStatus(status);
        params.setFromDate(from);
        params.setToDate(to);
        params.setPageIndex(page);
        params.setPageSize(size);
        params.setGroup(group);
        params.setDu(du);
        params.setPicEmail(picEmail);        
                
//        RequestApprovalDto requestApprovalDto = requestApprovalService.getRequestApprovalsPagination(page, size,
//                column, sort, fullName, roleName, status, from, to);
        RequestApprovalDto requestApprovalDto = requestApprovalService.getRequestApprovalsPagination(params);
        return new ResponseEntity<>(requestApprovalDto, HttpStatus.OK);
    }
    
    @RequestMapping(value = { "/api/request/updateRequestApproval" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateRequestApproval(@RequestBody RequestApproval request, @RequestParam("t") String token) throws IOException {
    	token = token.replace("Bearer ", "");
		token = StringUtils.hashString(token);
		Staff staff = staffRepository.findOneByToken(token);
		if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		if (!staff.getEmail().equals(request.getPicEmail())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		
    	RequestApprovalDto out = new RequestApprovalDto();
        try {
        	out.setSelectedRequestApproval(requestApprovalService.updateRequestApproval(request));
        	Profile profile = profileRepo.findByVersionId(request.getVersion().getVersionId());
        	String status = out.getSelectedRequestApproval().getStatus();
        	profileRepo.updateStatus(profile.getProfileId(), status);
        	new Thread(new Runnable() {
                public void run() {
                    try {
                        emailService.sendApprovedOrRejectedToStaff(out.getSelectedRequestApproval().getEmail(), out.getSelectedRequestApproval().getFullName(), status, out.getSelectedRequestApproval().getComment());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }).start();
            return new ResponseEntity<>(out, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }
    }
    
    @RequestMapping(value = { "/api/request/approveAll" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> approveAll(@RequestBody List<String> ids, @RequestParam("t") String token) throws IOException {
    	token = token.replace("Bearer ", "");
		token = StringUtils.hashString(token);
		Staff staff = staffRepository.findOneByToken(token);
		
    	RequestApprovalDto out = new RequestApprovalDto();
//    	profile.setStatus(status);
        try {
        	for (int j = 0; j < ids.size(); j++) {
//                Optional<Version> version = versionRepository.findById(Integer.parseInt(ids.get(j)));
        		RequestApproval request = requestRepo.findOneById(Integer.parseInt(ids.get(j)));
        		
        		if (!staff.getEmail().equals(request.getPicEmail())) {
        			continue;
        		}
        		
        		if (request.getStatus().equals("Submitted")) {
        			request.setStatus("Approved");
        			out.setSelectedRequestApproval(requestApprovalService.updateRequestApproval(request));
        			Profile profile = profileRepo.findByVersionId(request.getVersion().getVersionId());
                    profileRepo.updateStatus(profile.getProfileId(),"Approved");
                	new Thread(new Runnable() {
                        public void run() {
                            try {
                                emailService.sendApprovedOrRejectedToStaff(out.getSelectedRequestApproval().getEmail(), out.getSelectedRequestApproval().getFullName(), "Approved", "");
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                    }).start();
        		}
            }
            return new ResponseEntity<>(out, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, Messages.ERROR),
                    HttpStatus.BAD_REQUEST);
        }
    }
    
    @RequestMapping(value = { "/api/request/getSuggestions" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> getSuggestions(@RequestBody String jsonParams) {
		try {
			JSONObject obj = new JSONObject(jsonParams);
			String type = obj.getString("type");
			String searchValue = obj.getString("searchValue");
			List<String> suggestions = requestApprovalService.getSuggestions(type, searchValue);
			return ResponseEntity.ok(suggestions);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

}
