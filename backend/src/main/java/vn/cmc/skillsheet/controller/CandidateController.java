package vn.cmc.skillsheet.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import vn.cmc.skillsheet.dto.CandidateDto;
import vn.cmc.skillsheet.entity.*;
import vn.cmc.skillsheet.repository.CandidateRepository;
import vn.cmc.skillsheet.repository.CvLinkRepository;
import vn.cmc.skillsheet.repository.ProfileRepository;
import vn.cmc.skillsheet.repository.StaffRepository;
import vn.cmc.skillsheet.service.CandidateService;
import vn.cmc.skillsheet.service.EmailService;
import vn.cmc.skillsheet.service.ProfileService;
import vn.cmc.skillsheet.service.impl.ExcellServiceImpl;
import vn.cmc.skillsheet.util.Messages;
import vn.cmc.skillsheet.util.RoleUtil;
import vn.cmc.skillsheet.util.StringUtils;
import vn.cmc.skillsheet.vo.ApiMessage;
import vn.cmc.skillsheet.vo.FindCandidateParams;

@Controller
public class CandidateController {
    @Autowired
    private CandidateService candidateService;

    @Autowired
    private EmailService emailService;
    
    @Autowired
    private ProfileService profileService;
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private HttpServletRequest request;
    
    @Autowired
	private StaffRepository staffRepository;
    
    @Autowired
	private CandidateRepository candidateRepository;

    @Autowired
    private CvLinkRepository cvLinkRepository;

    @RequestMapping(value = { "/api/candidate/getCandidateList" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getCandidateList(@RequestBody String pagination,@RequestHeader (HttpHeaders.AUTHORIZATION) String token) {
        JSONObject obj = new JSONObject(pagination);
        token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        if (!RoleUtil.canViewCandidateList(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        int page = obj.getInt("page");
        int size = obj.getInt("size");
        String column = obj.getString("column");
        String sort = obj.getString("sort");
        String fullName = obj.getString("fullName");
        String roleName = obj.getString("roleName");
        String status = obj.getString("status");              
        
        FindCandidateParams params = new FindCandidateParams();
        params.setFullName(fullName);
        if (!(fullName == null || fullName.trim().isEmpty())) {        	
            String[] names = fullName.split(",");
            for (int i = 0; i < names.length; i++) {
				int index = names[i].indexOf("_");
				if (index >= 0) {
					names[i] = names[i].substring(index + 1);
				}
			}
            params.setFullName(String.join(",", names));
        }
        
        params.setRoleName(roleName);
        params.setStatus(status);
        params.setPageIndex(page);
        params.setPageSize(size);
        
        CandidateDto candidateDto = candidateService.getCandidatePagination(params);
//        CandidateDto candidateDto = candidateService.getListOfCandidatePagination(page, size, column, sort,
//                fullName, roleName, status);
        return new ResponseEntity<>(candidateDto, HttpStatus.OK);
    }

//    @RequestMapping(value = { "/api/candidate/getListCandidateId" }, method = RequestMethod.POST)
//    @ResponseBody
//    public ResponseEntity<Object> getListCandidateId(@RequestBody String selectLike) {
//        JSONObject obj = new JSONObject(selectLike);
//        String fullName = obj.getString("fullName");
//        String roleName = obj.getString("roleName");
//        String status = obj.getString("status");
//        return new ResponseEntity<>(
//                candidateService.getListCandidateIdWithSatatusNew(fullName, roleName, status),
//                HttpStatus.OK);
//    }

//    @RequestMapping(value = { "/api/candidate/countEmail" }, method = RequestMethod.POST)
//    @ResponseBody
//    public ResponseEntity<Object> countEmail(@RequestBody String countEmail) {
//        JSONObject obj = new JSONObject(countEmail);
//        String email = obj.getString("email");
//        return new ResponseEntity<>(candidateService.countEmail(email), HttpStatus.OK);
//    }

    @RequestMapping(value = { "/api/candidate/updateCandidate" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateCandidate(@RequestBody Candidate candidate, @RequestParam("t") String token) {
    	token = token.replace("Bearer ", "");
    	token = token.replace("FAKE-", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        Profile profile = profileService.getProfileByCandidateEmail(candidate.getEmail());
        if(!candidateService.checkCandidateExits(candidate)){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        if (staff == null) {
        	Candidate candidateByToken = candidateRepository.findOneByToken(token);
        	if (candidateByToken == null) {
    			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    		}
        	
        	if (!RoleUtil.isCandidateProfileOwner(candidateByToken, profile)) {
            	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        
        if (staff != null) {
        	if (!RoleUtil.canViewCandidateList(staff)) {
        		return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        	}
        }
        
        CandidateDto inDto = new CandidateDto();
        inDto.setSelectedCandidate(candidate);
        Date date = new Date();
        inDto.getSelectedCandidate().setUpdatedDate(date);
        profile.setEmail(candidate.getEmail());
        
        
        try {
            return new ResponseEntity<>(candidateService.updateCandidate(inDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, Messages.ERROR),
                    HttpStatus.OK);
        }
    }

    @PostMapping(value = { "/api/candidate/activeCandidate" })
    @ResponseBody
    public ResponseEntity<Object> activeCandidate(@RequestBody String idSelectedLst) {
        JSONObject obj = new JSONObject(idSelectedLst);
        
        String token = obj.getString("token");
        token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        
        if (staff == null) {
        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        if (!RoleUtil.canViewCandidateList(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        JSONArray idList = obj.getJSONArray("idSelectedLst");
        List<String> idl = new ArrayList<String>();
        Map<String, String> map = new HashMap<String, String>();
        Enumeration<?> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
        }
        try {
            for (int i = 0; i < idList.length(); i++) {
                CandidateDto inDto = new CandidateDto();
                inDto.setSelectedCandidateId(String.valueOf(idList.getInt(i)));
                CandidateDto upDto = candidateService.getCandidate(inDto);
                upDto.getSelectedCandidate().setStatus("new");
                candidateService.generateLinkRequest(upDto);
                Date date = new Date();
                upDto.getSelectedCandidate().setSendDate(date);                
                candidateService.updateCandidate(upDto);
                new Thread(new Runnable() {
                    public void run() {
                        try {
                            emailService.sendCreatedEmailToCandidate(upDto.getSelectedCandidate(), map.get("username"));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }).start();
                idl.add(String.valueOf(upDto.getSelectedCandidate().getCandidateId()));
            }
            return new ResponseEntity<>(idl, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, Messages.ERROR),
                    HttpStatus.OK);
        }
    }

    @PostMapping(value = { "/api/candidate/inactiveCandidate" })
    @ResponseBody
    public ResponseEntity<Object> inactiveCandidate(@RequestBody String idSelectedLst) {
        JSONObject obj = new JSONObject(idSelectedLst);
        
        String token = obj.getString("token");
        token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canViewCandidateList(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        JSONArray idList = obj.getJSONArray("idSelectedLst");
        List<String> idl = new ArrayList<String>();
        try {
            for (int i = 0; i < idList.length(); i++) {
                CandidateDto inDto = new CandidateDto();
                inDto.setSelectedCandidateId(String.valueOf(idList.getInt(i)));
                CandidateDto upDto = candidateService.getCandidate(inDto);
                upDto.getSelectedCandidate().setStatus("inactive");
                candidateService.updateCandidate(upDto);
                idl.add(String.valueOf(upDto.getSelectedCandidate().getCandidateId()));
            }
            return new ResponseEntity<>(idl, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, Messages.ERROR),
                    HttpStatus.OK);
        }
    }

    @PostMapping(value = { "/api/candidate/activeAllCandidate" })
    @ResponseBody
    public ResponseEntity<Object> activeAllCandidate(@RequestBody String idSelectedLst) {
        JSONObject obj = new JSONObject(idSelectedLst);
        
        String token = obj.getString("token");
        token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        if (!RoleUtil.canViewCandidateList(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        JSONArray idList = obj.getJSONArray("idSelectedLst");
        Date date = new Date();
        try {
            ArrayList<Candidate> candidate = new ArrayList<Candidate>();
            CandidateDto dto = candidateService.getListOfCandidate();
            for (int i = 0; i < dto.getCandidateList().size(); i++) {
                if ("inactive".equals(dto.getCandidateList().get(i).getStatus())) {
                    for (int j = 0; j < idList.length(); j++) {
                        if (idList.get(j).equals(
                                String.valueOf(dto.getCandidateList().get(i).getCandidateId()))) {
                            dto.getCandidateList().get(i).setStatus("active");
                            CandidateDto updateDto = new CandidateDto();
                            updateDto.setSelectedCandidate(dto.getCandidateList().get(i));
                            updateDto.getSelectedCandidate().setUpdatedDate(date);
                            candidateService.updateCandidate(updateDto);
                            candidate.add(dto.getCandidateList().get(i));
                        }
                    }
                }
            }
            return new ResponseEntity<>(candidate, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, Messages.ERROR),
                    HttpStatus.OK);
        }
    }

//    @RequestMapping(value = { "/api/candidate/deleteCandidate" }, method = RequestMethod.POST)
//    @ResponseBody
//    public ResponseEntity<Object> deleteCandidate(@RequestBody String idSelectedLst) {
//        JSONObject obj = new JSONObject(idSelectedLst);
//        
//        String token = obj.getString("token");
//        token = token.replace("Bearer ", "");
//        token = StringUtils.hashString(token);
//        
//        Staff staff = staffRepository.findOneByToken(token);
//        
//        if (!RoleUtil.canViewCandidateList(staff)) {
//        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//        
//        JSONArray idList = obj.getJSONArray("idSelectedLst");
//        List<String> idl = new ArrayList<String>();
//        try {
//            for (int i = 0; i < idList.length(); i++) {
//                CandidateDto inDto = new CandidateDto();
//                inDto.setSelectedCandidateId(String.valueOf(idList.getInt(i)));
//                idl.add(String.valueOf(idList.getInt(i)));
//                candidateService.deleteCandidate(inDto);
//            }
//            return new ResponseEntity<>(idl, HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, Messages.ERROR),
//                    HttpStatus.OK);
//        }
//    }

    @RequestMapping(value = { "/api/candidate/addCandidate" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> addCandidate(@RequestBody Candidate candidate, @RequestParam("t") String token) {
    	token = token.replace("Bearer ", "");
		token = StringUtils.hashString(token);
		Staff staff = staffRepository.findOneByToken(token);
		
		if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		if (!RoleUtil.canViewCandidateList(staff)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
        if(candidateService.checkCandidateExits(candidate)){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        CandidateDto inDto = new CandidateDto();
        inDto.setSelectedCandidate(candidate);
        Date date = new Date();
        inDto.getSelectedCandidate().setCreatedDate(date);
        inDto.getSelectedCandidate().setSendDate(date);
        inDto.getSelectedCandidate().setStatus("new");
        Map<String, String> map = new HashMap<String, String>();
        Enumeration<?> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
        }
        try {
            Candidate addedCandi = candidateService.addCandidate(inDto);
            inDto.setSelectedCandidate(addedCandi);
            candidateService.generateLinkRequest(inDto);
            candidateService.updateCandidate(inDto);            
            Profile newProfile = new Profile();
            newProfile.setCandidate(addedCandi);
            newProfile.setEmail(addedCandi.getEmail());
            newProfile.setRoleName(addedCandi.getRoleName());
            // Version
            Version version = new Version();
            version.setCreatedDate(date);
            version.setVersionName(addedCandi.getFullName());
            version.setVersionType("Temporary");
            newProfile.setVersion(version);
            newProfile.setCreatedDate(date);
            newProfile.setStatus("New");
            profileRepository.save(newProfile);
            
//            new Thread(new Runnable() {
//                public void run() {
//                    try {
//                        emailService.sendCreatedEmailToCandidate(inDto.getSelectedCandidate(), map.get("username"));
//                    } catch (Exception e) {
//                        e.printStackTrace();
//                    }
//                }
//            }).start();
            
            try {
                emailService.sendCreatedEmailToCandidate(inDto.getSelectedCandidate(), map.get("username"));
            } catch (Exception e) {
                e.printStackTrace();
            }
            
            addedCandi.setAccessToken(StringUtils.hashString(addedCandi.getAccessToken()));
            addedCandi.setAccessCode(StringUtils.hashString(addedCandi.getAccessCode()));
            addedCandi.setStepRts("none");
            addedCandi.setRemoveJobRtsIds(new JSONArray("[]").toString());
            candidateRepository.save(addedCandi);
            return new ResponseEntity<>(inDto.getSelectedCandidate(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, Messages.ERROR),
                    HttpStatus.OK);
        }
    }

    @RequestMapping(value = { "/api/candidate/resendRequest" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> resendRequest(@RequestBody String idSelectedLst) {
        JSONObject obj = new JSONObject(idSelectedLst);
        
        String token = obj.getString("token");
        token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canViewCandidateList(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        JSONArray idList = obj.getJSONArray("idSelectedLst");
        List<Candidate> returnList = new ArrayList<Candidate>();
        Map<String, String> map = new HashMap<String, String>();
        Enumeration<?> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
        }
        try {
            for (int i = 0; i < idList.length(); i++) {
                CandidateDto inDto = new CandidateDto();
                inDto.setSelectedCandidateId(String.valueOf(idList.getInt(i)));
                Candidate outCandi = candidateService.getCandidate(inDto).getSelectedCandidate();
                inDto.setSelectedCandidate(outCandi);
                candidateService.generateLinkRequest(inDto);
                Date date = new Date();
                inDto.getSelectedCandidate().setSendDate(date);
                
//                Candidate candidate = inDto.getSelectedCandidate();
//                candidate.setAccessToken(StringUtils.hashString(candidate.getAccessToken()));
//                candidate.setAccessCode(StringUtils.hashString(candidate.getAccessCode()));
                
                Candidate newCandi = candidateService.updateCandidate(inDto);
                returnList.add(newCandi);
//                new Thread(new Runnable() {
//                    public void run() {
//                        try {
//                            emailService.sendCreatedEmailToCandidate(inDto.getSelectedCandidate(), map.get("username"));
//                        } catch (Exception e) {
//                            e.printStackTrace();
//                        }
//                    }
//                }).start();
                
                try {
                    emailService.sendCreatedEmailToCandidate(inDto.getSelectedCandidate(), map.get("username"));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                
                outCandi.setAccessToken(StringUtils.hashString(outCandi.getAccessToken()));
                outCandi.setAccessCode(StringUtils.hashString(outCandi.getAccessCode()));
                candidateRepository.save(outCandi);
            }
            return new ResponseEntity<>(returnList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, Messages.ERROR),
                    HttpStatus.OK);
        }
    }

//    @RequestMapping(value = { "/api/candidate/getCandidate" }, method = RequestMethod.POST)
//    @ResponseBody
//    public ResponseEntity<Object> getCandidate(@RequestBody String candidateId) {
//        JSONObject obj = new JSONObject(candidateId);
//        String idList = obj.getString("candidateId");
//        CandidateDto inDto = new CandidateDto();
//        inDto.setSelectedCandidateId(idList);
//        return new ResponseEntity<>(candidateService.getCandidate(inDto).getSelectedCandidate(),
//                HttpStatus.OK);
//    }

//    @RequestMapping(value = { "/api/candidate/searchCandidate" }, method = RequestMethod.POST)
//    @ResponseBody
//    public ResponseEntity<Object> searchCandidate(@RequestBody String search) {
//        JSONObject obj = new JSONObject(search);
//        String fullName = obj.getString("fullName");
//        String roleName = obj.getString("roleName");
//        String status = obj.getString("status");
//        int page = obj.getInt("page");
//        int size = obj.getInt("size");
//        
//        FindCandidateParams params = new FindCandidateParams();
//        params.setFullName(fullName);
//        params.setRoleName(roleName);
//        params.setStatus(status);
//        params.setPageIndex(page);
//        params.setPageSize(size);
//        
//        //CandidateDto candidateDto = candidateService.getCandidatePagination(params);
//        
//        return new ResponseEntity<>(candidateService.searchCandidate(fullName, roleName, status),
//                HttpStatus.OK);
//        //return ResponseEntity.ok(candidateDto);
//    }
    
//    @RequestMapping(value = { "/api/candidate/getCandidateByEmailAndRole" }, method = RequestMethod.POST)
//    @ResponseBody
//    public ResponseEntity<Object> getCandidateByEmailAndRole(@RequestBody Candidate candidate) {
////        JSONObject obj = new JSONObject(candidateId);
////        String idList = obj.getString("candidateId");
//        CandidateDto inDto = new CandidateDto();
////        Candidate candidate = new Candidate();
////        candidate.setEmail(email);
////        candidate.setRoleName(roleName);
//        inDto.setSelectedCandidate(candidate);
//        return new ResponseEntity<>(candidateService.getCandidateByEmailAndRole(inDto).getSelectedCandidate(),
//                HttpStatus.OK);
//    }
 
    @RequestMapping(value = { "/api/candidate/getCandidateByEmail" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getCandidateByEmail(@RequestBody Candidate candidate, @RequestParam("t") String token) {
    	token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canViewCandidateList(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        CandidateDto inDto = new CandidateDto();
        inDto.setSelectedCandidate(candidate);
        return new ResponseEntity<>(candidateService.getCandidateByEmail(inDto).getSelectedCandidate(),
                HttpStatus.OK);
    }
    
    @RequestMapping(value = { "/api/candidate/getSuggestions" }, method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> getSuggestions(@RequestBody String jsonParams) {
		try {
			JSONObject obj = new JSONObject(jsonParams);
			String type = obj.getString("type");
			String searchValue = obj.getString("searchValue");
			List<String> suggestions = candidateService.getSuggestions(type, searchValue);
			return ResponseEntity.ok(suggestions);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

    /*@RequestMapping(value = { "/api/candidate/uploadMaster" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> uploadMaster(@RequestParam("file") MultipartFile file,  @RequestHeader (HttpHeaders.AUTHORIZATION) String token) {
        token = token.replace("Bearer ", "");
        token = token.replace("FAKE-", "");
        token = StringUtils.hashString(token);
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!RoleUtil.canViewProfileList(staff)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (ExcellServiceImpl.hasExcelFormat(file)) {
            try {
                CandidateDto candidateDto = candidateService.insertCvPull(file);
                return new ResponseEntity<>(candidateDto, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, "Could not upload the file: " + file.getOriginalFilename() + "!"), HttpStatus.OK);
            }
        }

        return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, "Please upload an excel file!"), HttpStatus.OK);
    }*/

    @RequestMapping(value = { "/api/candidate/updateLinkCv" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateLinkCv(@RequestBody String body) {
        List<CvLink> cvLinks = new ArrayList<>();
        try {
            JSONArray obj = new JSONArray(body);
            for(int i =0; i < obj.length(); i++){
                JSONObject jsonObject = obj.getJSONObject(i);
                if(jsonObject.has("fileName") && jsonObject.has("previewUrl")){
                    CvLink cvLink = new CvLink();
                    cvLink.setFileName(jsonObject.getString("fileName"));
                    cvLink.setPreviewUrl(jsonObject.getString("previewUrl"));
                    cvLink.setCreatedAt(LocalDateTime.now());
                    cvLinks.add(cvLink);
                }
            }
            cvLinkRepository.saveAll(cvLinks);
            return ResponseEntity.ok(cvLinks);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @RequestMapping(value = { "/api/candidate/deleteByAccessCode" }, method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteCandidateByAccessCode(@RequestParam String id){
        try {
            Candidate candidate = candidateService.deleteCadidateByAccessCode(id);
            return ResponseEntity.ok(candidate);
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
