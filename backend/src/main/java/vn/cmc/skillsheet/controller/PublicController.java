package vn.cmc.skillsheet.controller;

import org.apache.commons.lang3.ObjectUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.cmc.skillsheet.constant.StepRts;
import vn.cmc.skillsheet.dto.BaseResponseDTO;
import vn.cmc.skillsheet.dto.CandidateDto;
import vn.cmc.skillsheet.dto.CandidatePublicDto;
import vn.cmc.skillsheet.dto.ChannelDto;
import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.entity.Version;
import vn.cmc.skillsheet.repository.CandidateRepository;
import vn.cmc.skillsheet.repository.ProfileRepository;
import vn.cmc.skillsheet.repository.StaffRepository;
import vn.cmc.skillsheet.service.CandidateService;
import vn.cmc.skillsheet.service.ChannelService;
import vn.cmc.skillsheet.service.EmailService;
import vn.cmc.skillsheet.service.ProfileService;
import vn.cmc.skillsheet.service.impl.ExcellServiceImpl;
import vn.cmc.skillsheet.util.Messages;
import vn.cmc.skillsheet.util.RoleUtil;
import vn.cmc.skillsheet.util.StringUtils;
import vn.cmc.skillsheet.vo.ApiMessage;
import vn.cmc.skillsheet.vo.FindCandidateParams;
import vn.cmc.skillsheet.vo.LoginUser;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Controller
public class PublicController {

    public static HashMap<String,String> cacheFileInfo = new HashMap<>();
    @Autowired
    private CandidateService candidateService;

    @Autowired CandidateRepository candidateRepository;

    @Autowired
    private ChannelService channelService;

    @RequestMapping(value = { "/api/public/getCandidates" }, method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getCandidates(@RequestParam("page") int page,@RequestParam("size") int size,@RequestParam("findValue") String findValue, @RequestParam("stepRts") String stepRts,
                                                @RequestParam(value = "orderBy", required = false,defaultValue = "created_date") String orderBy, @RequestParam(value ="sort", required = false, defaultValue = "ASC") String sort) {

        CandidateDto candidateDto = candidateService.getCandidatePublicPagination(page,size,findValue,stepRts,orderBy, sort);
        return new ResponseEntity<>(candidateDto, HttpStatus.OK);
    }

    @RequestMapping(value = { "/api/public/getCandidatesByJob" }, method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getCandidatesByJob(@RequestParam("jobRtsId") String jobRtsId, @RequestParam("stepRts") String stepRts, @RequestParam(value = "assignees",required = false) String assignees,
                                                     @RequestParam("page") int page, @RequestParam("size") int size, @RequestParam(value = "findValue",required = false) String findValue,
                                                     @RequestParam(value = "orderBy", required = false,defaultValue = "created_date") String orderBy, @RequestParam(value ="sort", required = false, defaultValue = "ASC") String sort) {

        CandidatePublicDto candidateDto = candidateService.getCandidatesByJob(jobRtsId,stepRts,assignees, page,size,findValue,orderBy, sort);
        return new ResponseEntity<>(candidateDto, HttpStatus.OK);
    }

    @RequestMapping(value = { "/api/public/getCandidatesByListJob" }, method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getCandidateByListJob(@RequestParam("jobRtsId") String jobRtsId,@RequestParam("stepRts") String stepRts,@RequestParam(value = "assignees",required = false) String assignees,
                                                        @RequestParam(value = "skill" , required = false) String skills,@RequestParam(value = "experience" , required = false) String experience,
                                                        @RequestParam("page") int page,@RequestParam("size") int size,@RequestParam(value = "findValue",required = false,defaultValue = "") String findValue,
                                                        @RequestParam(value = "orderBy", required = false,defaultValue = "created_date") String orderBy, @RequestParam(value ="sort", required = false, defaultValue = "ASC") String sort){
        CandidatePublicDto candidateDto = candidateService.getCandidatesByListJob(jobRtsId,stepRts,assignees,skills ,experience, page,size,findValue,orderBy, sort);
        return new ResponseEntity<>(candidateDto, HttpStatus.OK);
    }

    @RequestMapping(value = { "/api/public/getCandidateById" }, method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getCandidateById(@RequestParam("candidateId") int candidateId) {

        Candidate candidate = candidateService.getCandidate(candidateId);

        if(candidate == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return new ResponseEntity<>(candidate, HttpStatus.OK);
    }

    @RequestMapping(value = { "/api/public/updateStepCandidate" }, method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<Object> updateStepCandidate(@RequestBody String body) {
        JSONObject obj = new JSONObject(body);

        JSONArray candidateIds = obj.getJSONArray("candidateId");

        if(candidateIds.length() <=0){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Integer> lCandidateId = new ArrayList<>();

        for(int i = 0; i <candidateIds.length(); i++){
            lCandidateId.add(candidateIds.getInt(i));
        }

        String stepRts = obj.getString("stepRts");

        String jobRtsId = obj.getString("jobRtsId");

        String assignees = obj.getString("assignees");

        List<Candidate> candidates = candidateService.getCandidates(lCandidateId);

        if(candidates == null || candidates.size() <= 0){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        StepRts newStep = StepRts.getValue(stepRts);
        for(Candidate candidate : candidates){
            StepRts oldStep = StepRts.getValue(candidate.getStepRts());

            if(oldStep == null ||  oldStep.getValue() < newStep.getValue()){
                if(candidate.getStepRts().equals("none") || candidate.getStepRts().isEmpty()){
                    candidate.setJobRtsId(jobRtsId);
                    candidate.setAssignees(assignees);
                }
            }
            candidate.setStepRts(stepRts);
        }

        candidateRepository.saveAll(candidates);

        return new ResponseEntity<>(candidates, HttpStatus.OK);
    }

    @RequestMapping(value = { "/api/public/removeCandidateFromJob" }, method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Object> removeCandidateFromJob(@RequestParam("candidateIds") List<Integer> candidateId,@RequestParam("jobRtsId") String jobRtsId) {

        List<Candidate> candidates = candidateService.getCandidateInListAndJobRtsId(candidateId,jobRtsId);

        if(candidates == null || candidates.size() <= 0){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        for(Candidate candidate : candidates){
                JSONArray removeJobRtsId = new JSONArray(candidate.getRemoveJobRtsIds());
                removeJobRtsId.put(jobRtsId);
                candidate.setRemoveJobRtsIds(removeJobRtsId.toString());
                candidate.setJobRtsId(null);
                candidate.setStepRts("none");
                candidate.setAssignees(null);
        }

        candidateRepository.saveAll(candidates);

        return new ResponseEntity<>(candidates, HttpStatus.OK);
    }

    @RequestMapping(value = { "/api/public/uploadMaster" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> uploadMaster(@RequestParam("file") MultipartFile file,@RequestParam(value = "fileInfo",required = true) String fileInfo) {
        JSONArray jFileInfo = new JSONArray(fileInfo);

        for(int i =0; i < jFileInfo.length(); i++){
            JSONObject obj = jFileInfo.getJSONObject(i);
            if(obj.has("fileName")){
                cacheFileInfo.put(obj.getString("fileName"),obj.getString("previewUrl"));
            }
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
    }

    @RequestMapping(value = { "/api/public/uploadMasterForRTS" }, method = RequestMethod.POST)
    @ResponseBody
    ResponseEntity<Object> uploadMasterWithDataParams(@RequestParam("file") MultipartFile file,@RequestParam(value = "fileInfo",required = true) String fileInfo ,
                                                      @RequestParam(value = "requestId" , required = true) String requestId , @RequestParam(value = "stepRts" , required = true) String stepRts ){
        JSONArray jFileInfo = new JSONArray(fileInfo);
        for(int i =0; i < jFileInfo.length(); i++){
            JSONObject obj = jFileInfo.getJSONObject(i);
            if(obj.has("fileName")){
                cacheFileInfo.put(obj.getString("fileName"),obj.getString("previewUrl"));
            }
        }
        if (ExcellServiceImpl.hasExcelFormat(file)) {
            try {
                CandidateDto candidateDto = candidateService.insertCv(file , requestId , stepRts);
                return new ResponseEntity<>(candidateDto, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, "Could not upload the file: " + file.getOriginalFilename() + "!"), HttpStatus.OK);
            }
        }

        return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, "Please upload an excel file!"), HttpStatus.OK);
    }

    @RequestMapping(value = { "/api/public/createCandidate" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> createCandidate(@RequestBody Candidate canData) {
        if(canData.getEmail().isEmpty() || canData.getPhone().isEmpty() || canData.getFullName().isEmpty()){
            return new ResponseEntity<>("Params error", HttpStatus.BAD_REQUEST);
        }

        if(candidateService.checkCandidateExits(canData)){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        CandidateDto inDto = new CandidateDto();
        inDto.setSelectedCandidate(canData);
        Date date = new Date();
        inDto.getSelectedCandidate().setCreatedDate(date);
        inDto.getSelectedCandidate().setSendDate(date);
        inDto.getSelectedCandidate().setStatus("new");

        try {
            Candidate addedCandi = candidateService.addCandidate(inDto);
            inDto.setSelectedCandidate(addedCandi);

            addedCandi.setRemoveJobRtsIds(new JSONArray("[]").toString());
            candidateRepository.save(addedCandi);
            return new ResponseEntity<>(inDto.getSelectedCandidate(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, Messages.ERROR),
                    HttpStatus.OK);
        }
    }

    @RequestMapping(value = { "/api/public/updateCandidate" }, method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<Object> updateCandidate(@RequestBody Candidate canData,@RequestParam("candidateId") int candidateId) {

        Candidate candidate = candidateService.getCandidate(candidateId);
        if(candidate == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if(canData.getFullName() != null){
            candidate.setFullName(canData.getFullName());
        }

        if(canData.getApplySince() != null){
            candidate.setApplySince(canData.getApplySince());
        }

        if(canData.getChannel() > 0){
            candidate.setChannel(canData.getChannel());
        }

        if(canData.getJobRtsId() != null){
            candidate.setJobRtsId(canData.getJobRtsId());
        }

        if(canData.getPhone() != null){
            candidate.setPhone(canData.getPhone());
        }
        if(canData.getLinkCv() != null){
            candidate.setLinkCv(canData.getLinkCv());
        }

        if(canData.getJob() != null){
            candidate.setJob(canData.getJob());
        }

        candidateRepository.save(candidate);

        return new ResponseEntity<>(candidate, HttpStatus.OK);
    }

    @RequestMapping(value = { "/api/public/getChannelList" }, method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getChannelList() {
        ChannelDto cvPullDto = channelService.getListChannel();
        return new ResponseEntity<>(cvPullDto, HttpStatus.OK);
    }

    @RequestMapping("/api/public/checkExistAccount")
    @ResponseBody
    public BaseResponseDTO checkExistAccount(@RequestParam String email){
        try{
            Candidate candidate = candidateRepository.findCandidateAccountByEmail(email);
            if(ObjectUtils.isEmpty(candidate)){
                return new BaseResponseDTO(HttpStatus.UNAUTHORIZED , Messages.ERROR , null);
            }
            return new BaseResponseDTO(HttpStatus.OK , Messages.SUCCESS , candidate);
        }
        catch (Exception e){
            return new BaseResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR , Messages.ERROR , null);
        }
    }
}
