package vn.cmc.skillsheet.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import vn.cmc.skillsheet.dto.VersionDto;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.RequestApproval;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.entity.Version;
import vn.cmc.skillsheet.repository.ProfileRepository;
import vn.cmc.skillsheet.repository.RequestApprovalRepository;
import vn.cmc.skillsheet.repository.StaffRepository;
import vn.cmc.skillsheet.repository.VersionRepository;
import vn.cmc.skillsheet.service.VersionService;
import vn.cmc.skillsheet.util.RoleUtil;
import vn.cmc.skillsheet.util.StringUtils;
import vn.cmc.skillsheet.vo.VersionProfileRespone;

@Controller
public class VersionController {

    @Autowired
    private VersionService service;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private VersionRepository versionRepository;
    
    @Autowired
    private StaffRepository staffRepository;

    @RequestMapping(value = {
            "/api/profile/getProfileVersionListByEmail" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getProfileVersionListByEmail(@RequestBody String pagination) {
        JSONObject obj = new JSONObject(pagination);

        String staffEmail = obj.getString("staffEmail");
        String token = obj.getString("token");
        token = token.replace("Bearer ", "");
		token = StringUtils.hashString(token);
		Staff staff = staffRepository.findOneByToken(token);
		if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		
		if (!staff.getEmail().equals(staffEmail)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		
        int page = obj.getInt("page");
        int size = obj.getInt("size");
        String column = obj.getString("column");
        String sort = obj.getString("sort");
        String versionName = obj.getString("versionName");
        String versionType = obj.getString("versionType");
        VersionDto versionDTo = service.getListOfVersionPagination(page, size, column, sort,
                versionName, versionType, staffEmail);

        List<VersionProfileRespone> versionProfileList = new ArrayList<>();

        for (int i = 0; i < versionDTo.getVersionList().size(); i++) {
            VersionProfileRespone versionP = new VersionProfileRespone();
            versionP.setVersion(versionDTo.getVersionList().get(i));
            versionP.setProfile(versionDTo.getVersionList().get(i).getProfile());
            versionP.setTotalElements(versionDTo.getTotalElements());
            versionProfileList.add(versionP);

        }

        return new ResponseEntity<>(versionProfileList, HttpStatus.OK);
    }

//    @RequestMapping(value = { "/api/version/getListVersionIdOfStaff" }, method = RequestMethod.POST)
//    @ResponseBody
//    public ResponseEntity<Object> getListVersionIdOfStaff(@RequestBody String selectLike) {
//        JSONObject obj = new JSONObject(selectLike);
//        String versionName = obj.getString("versionName");
//        String versionType = obj.getString("versionType");
//        String staffEmail = obj.getString("staffEmail");
//        return new ResponseEntity<>(
//                service.getListVersionIdOfStaff(versionName, versionType, staffEmail),
//                HttpStatus.OK);
//    }

    @RequestMapping(value = "/api/version/deleteMultiProfiles/{ids}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteByIds(@PathVariable("ids") List<String> ids, @RequestParam("t") String token) {
    	token = token.replace("Bearer ", "");
		token = StringUtils.hashString(token);
		Staff staff = staffRepository.findOneByToken(token);

        for (int j = 0; j < ids.size(); j++) {
            Optional<Version> version = versionRepository.findById(Integer.parseInt(ids.get(j)));
            
            if (!version.get().getProfile().getEmail().equals(staff.getEmail())) {
            	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            if (version.isPresent()) {
//                List<RequestApproval> listRequestApproval = requestApprovalRepository
//                        .findByVersionId(profile.get().getVersion().getVersionId());
//                for (int i = 0; i < listRequestApproval.size(); i++) {
//                    requestApprovalRepository.delete(listRequestApproval.get(i));
//                }
//                profileRepository.delete(profile.get());
//                versionRepository.delete(version.get());
            	profileRepository.delete(version.get().getProfile());
            }
        }
        return new ResponseEntity<>("DELETED", HttpStatus.OK);
    }

}
