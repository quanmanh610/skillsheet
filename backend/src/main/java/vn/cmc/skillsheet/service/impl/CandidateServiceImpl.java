package vn.cmc.skillsheet.service.impl;

import java.io.IOException;
import java.util.*;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;
import vn.cmc.skillsheet.constant.UrlConst;
import vn.cmc.skillsheet.controller.PublicController;
import vn.cmc.skillsheet.dto.CandidateDto;
import vn.cmc.skillsheet.dto.CandidatePublicDto;
import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.logic.CandidateLogic;
import vn.cmc.skillsheet.logic.EncryptDecryptLogic;
import vn.cmc.skillsheet.repository.CandidateRepository;
import vn.cmc.skillsheet.service.CandidateService;
import vn.cmc.skillsheet.service.ExcellService;
import vn.cmc.skillsheet.util.CodeUtils;
import vn.cmc.skillsheet.util.JwtUtil;
import vn.cmc.skillsheet.util.StringUtils;
import vn.cmc.skillsheet.vo.FindCandidateParams;

/**
 * @author NDDUC
 *
 */
@Service
public class CandidateServiceImpl implements CandidateService {

    @Autowired
    private CandidateLogic candidateLogic;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private EncryptDecryptLogic encryptDecryptLogic;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ExcellService excellService;

//    @Override
//    public CandidateDto getListOfCandidatePagination(int page, int size, String column, String sort,
//            String fullName, String roleName, String status) {
//
//        CandidateDto outDto = new CandidateDto();
//
//        String sortColumn = "candidateId";
//        if ("roleName".equals(column))
//            sortColumn = "roleName";
//        else if ("status".equals(column))
//            sortColumn = "status";
//        else if ("fullName".equals(column))
//            sortColumn = "fullName";
//        else if ("sendDate".equals(column))
//            sortColumn = "sendDate";
//        else if ("email".equals(column))
//            sortColumn = "email";
//
//        String sortDirec = "ASC";
//        if ("DES".equals(sort))
//            sortDirec = "DESC";
//
//        PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by(
//                "ASC".equals(sortDirec) ? Sort.Direction.ASC : Sort.Direction.DESC, sortColumn));
//        Page<Candidate> pageCandidate = candidateRepository
//                .findByFullNameLikeAndRoleNameLikeAndStatusLike("%" + fullName + "%",
//                        "%" + roleName + "%", status + "%", pageRequest);
//
//        List<Candidate> listCandidate = null;
//        listCandidate = pageCandidate.getContent();
//
//        outDto.setCandidateList(listCandidate);
//        outDto.setTotalElements(pageCandidate.getTotalElements());
//
//        return outDto;
//    }

    @Override
    public CandidateDto getListOfCandidate() {
        CandidateDto candidateDto = new CandidateDto();
        List<Candidate> candiList = candidateLogic.getListofCandidate();
        candidateDto.setCandidateList(candiList);
        return candidateDto;
    }

    @Override
    public Candidate addCandidate(CandidateDto inDto) {
        if (null == inDto.getSelectedCandidate()) {
            return null;
        }
        Candidate candidate = inDto.getSelectedCandidate();
        candidate.setAccessCode(StringUtils.hashString(candidate.getAccessToken()));
        candidate.setAccessCode(StringUtils.hashString(candidate.getAccessCode()));
        
        return candidateLogic.addCandidate(candidate);
    }

    @Override
    public Candidate updateCandidate(CandidateDto inDto) {
        if (null == inDto.getSelectedCandidate()) {
            return null;
        }
        Candidate candidate = inDto.getSelectedCandidate();        
        
        return candidateLogic.updateCandidate(candidate);
    }

    @Override
    public void deleteCandidate(CandidateDto inDto) {
        if (null != inDto.getSelectedCandidateId()) {
            candidateLogic.deleteCandidate(Integer.parseInt(inDto.getSelectedCandidateId().trim()));
        }

    }

    @Override
    public CandidateDto getCandidate(CandidateDto inDto) {

        CandidateDto outDto = new CandidateDto();

        if (null != inDto.getSelectedCandidateId()) {

            Candidate candidate = candidateLogic
                    .getCandidate(Integer.parseInt(inDto.getSelectedCandidateId().trim()));

            outDto.setSelectedCandidate(candidate);

            return outDto;

        } else {

            return null;
        }

    }

    @Override
    public CandidateDto generateLinkRequest(CandidateDto inDto) throws Exception {
        String link = UrlConst.ROOT_URI;
        String token = jwtUtil.generateToken(inDto.getSelectedCandidate().getEmail(), inDto.getSelectedCandidate().getRoleName());
        token = Base64.getEncoder().encodeToString(token.getBytes());
//        Date date = new Date();
//        String en = date.toString() + inDto.getSelectedCandidate().getEmail() + "@x@Y@z@X@y@Z@"
//                + inDto.getSelectedCandidate().getFullName() + "@x@Y@z@X@y@Z@"
//                + String.valueOf(inDto.getSelectedCandidate().getCandidateId());
//        String encryptedString = encryptDecryptLogic.encrypt(en);
//        link = link + "loginCandidate?candidateId=" + encryptedString + "&fullName="
//                + inDto.getSelectedCandidate().getFullName() + "&acc="
//                + inDto.getSelectedCandidate().getEmail();
        link = link + "loginCandidate?at=" + token;
        inDto.getSelectedCandidate().setLinkRequest(link);
        inDto.getSelectedCandidate().setAccessToken(token);
        inDto.getSelectedCandidate().setAccessCode(CodeUtils.getRandomNumberString());
        return inDto;
    }

    @Override
    public List<Candidate> searchCandidate(String fullName, String roleName, String status) {
        return candidateLogic.searchCandidate(fullName, roleName, status);
    }
    
    @Override
    public CandidateDto getCandidatePagination(FindCandidateParams params) {

        CandidateDto outDto = new CandidateDto();

        List<Object> results = 
        		candidateRepository
        			.findCandidate(
        					params.getFullName(),
        					params.getRoleName(),
        					params.getStatus(),        					
        					params.getPageIndex() - 1,
        					params.getPageSize());

        List<Candidate> candidates = new ArrayList<Candidate>();
        
        for (Iterator<Object> it = results.iterator(); it.hasNext();) {
            Object[] object = (Object[]) it.next();
            try {
            	Candidate item = new Candidate();
            	item.setCandidateId((Integer) object[0]);
            	item.setFullName((String) object[1]);
            	item.setEmail((String) object[2]);
            	item.setRoleName((String) object[3]);            	
            	item.setStatus((String) object[4]);
            	item.setSendDate((Date) object[5]);
            	item.setPhone((String)object[6]);
            	item.setCreateBy((String) object[7]);
            	item.setCreatedDate((Date) object[8]);

                //AnBQ Start
                item.setLinkCv((String) object[9]);
                item.setChannel((Integer) object[10]);
                item.setApplySince((Date) object[11]);
                item.setIntroducer((String) object[12]);
                item.setLocation((String) object[13]);
                item.setDegree((String) object[14]);
                item.setSchool((String) object[15]);
                item.setSkill((String) object[16]);
                item.setLanguage((String) object[17]);
                item.setAddress((String) object[18]);
                item.setJob((String) object[19]);
                item.setLevel((String) object[20]);
                item.setExperience((String) object[21]);
                item.setSex((String) object[22]);
                item.setBirthDay((Date) object[23]);
                //AnBQ Stop
            	candidates.add(item);
            } catch (Exception e) {
                System.out.println((Integer) object[0]);
            }
        }

        outDto.setCandidateList(candidates);
        outDto.setTotalElements(
        		candidateRepository
        			.getCandidateCount(
		        		params.getFullName(),
						params.getRoleName(),
						params.getStatus()));

        return outDto;
    }

    @Override
    public boolean checkCandidateExits(Candidate candidate) {
        if(candidate.getEmail().isEmpty() || candidate.getPhone().isEmpty()){
            return true;
        }
        List<Candidate> candidates = candidateRepository.findCandidateByEmailAndPhone(candidate.getEmail(),candidate.getPhone());
        if(candidates != null && candidates.size() > 0){
            return true;
        }
        return false;
    }

    @Override
    public List<Integer> getListCandidateIdWithSatatusNew(String fullName, String roleName,
            String status) {
        return candidateRepository.getListCandidateIdWithSatatusNew(fullName, roleName, status);
    }

    @Override
    public int countEmail(String email) {
        return candidateRepository.countEmail(email);
    }
    
    @Override
    public CandidateDto getCandidateByEmailAndRole(CandidateDto inDto) {
    	CandidateDto outDto = new CandidateDto();
    	if (null != inDto) {
    		outDto.setSelectedCandidate(candidateLogic.getCandidateByEmailAndRole(inDto.getSelectedCandidate().getEmail(), inDto.getSelectedCandidate().getRoleName()));
    		return outDto;
    	} else {
    		return null;
    	}
    }
    
    @Override
    public CandidateDto getCandidateByEmail(CandidateDto inDto) {
    	CandidateDto outDto = new CandidateDto();
    	if (null != inDto) {
    		outDto.setSelectedCandidate(candidateLogic.getCandidateByEmail(inDto.getSelectedCandidate().getEmail()));
    		return outDto;
    	} else {
    		return null;
    	}
    }
    
    @Override
   	public List<String> getSuggestions(String type, String searchValue) {
   		List<String> suggestions = candidateLogic.getFieldSuggestions(type, searchValue);
   		return suggestions;
   	}

    @Override
    public CandidateDto insertCvPull(MultipartFile file) {

        CandidateDto candidateDto = new CandidateDto();
        try {
            List<Candidate> candidates = excellService.excelToCvPulls(file.getInputStream());
            if(candidates != null &&  candidates.size() > 0){
                candidateRepository.saveAll(candidates);
                candidateDto.setCandidateList(candidates);
                candidateDto.setTotalElements(candidates.size());
            }
        } catch (IOException e) {
            throw new RuntimeException("fail to store excel data: " + e.getMessage());
        }
        return candidateDto;
    }

    @Override
    public CandidateDto insertCv(MultipartFile file, String requestId, String stepRts) {
        CandidateDto candidateDto = new CandidateDto();
        try {
            List<Candidate> candidates = excellService.excelToCvPull(file.getInputStream() , requestId , stepRts);
            if(candidates != null &&  candidates.size() > 0){
                candidateRepository.saveAll(candidates);
                candidateDto.setCandidateList(candidates);
                candidateDto.setTotalElements(candidates.size());
            }
        } catch (IOException e) {
            throw new RuntimeException("fail to store excel data: " + e.getMessage());
        }
        return candidateDto;
    }

    @Override
    public CandidateDto getCandidatePublicPagination(int pageIndex, int pageSize, String findValue, String stepRts, String orderBy, String sort) {
        CandidateDto outDto = new CandidateDto();
        String sortDirec = "DESC";
        if ("ASC".equals(sort))
            sortDirec = "ASC";
        PageRequest pageRequest = PageRequest.of(pageIndex - 1, pageSize, Sort.by(
                "DESC".equals(sortDirec) ? Sort.Direction.DESC : Sort.Direction.ASC, orderBy));
        Page<Candidate> results =
                candidateRepository
                        .findCandidate(findValue,findValue,findValue,stepRts,pageRequest);


        outDto.setCandidateList(results.getContent());
        outDto.setTotalElements(results.getTotalElements());
        return outDto;
    }

    @Override
    public CandidatePublicDto getCandidatesByJob(String jobRtsId, String stepRts, String assignees, int pageIndex, int pageSize, String findValue, String orderBy, String sort) {
        String SOURCE = "none";
        String QUALIFY = "qualify";
        String CONFIRM = "confirm";
        String INTERVIEW = "interview";
        String OFFER = "offer";
        String ONBOARD = "onboard";
        String FAILED = "failed";

        String sortDirec = "DESC";
        if ("ASC".equals(sort))
            sortDirec = "ASC";

        PageRequest pageRequest = PageRequest.of(pageIndex - 1, pageSize, Sort.by(
                "DESC".equals(sortDirec) ? Sort.Direction.DESC : Sort.Direction.ASC, orderBy));
        CandidatePublicDto outDto = new CandidatePublicDto();

        Page<Candidate> results;
        List<Candidate> source;
        List<Candidate> qualify;
        List<Candidate> confirm;
        List<Candidate> interview;
        List<Candidate> offer;
        List<Candidate> onboard;
        List<Candidate> failed;
        source = candidateRepository.findByStepRts(SOURCE);

        if(assignees == null || assignees.isEmpty()){
            results = candidateRepository.findCandidateByJobRtsIdAndStepRts(findValue,jobRtsId,stepRts,pageRequest);
            qualify = candidateRepository.findCandidateByJobRtsIdAndStepRts(findValue,jobRtsId,QUALIFY);
            confirm = candidateRepository .findCandidateByJobRtsIdAndStepRts(findValue,jobRtsId,CONFIRM);
            interview = candidateRepository.findCandidateByJobRtsIdAndStepRts(findValue,jobRtsId,INTERVIEW);
            offer = candidateRepository.findCandidateByJobRtsIdAndStepRts(findValue,jobRtsId,OFFER);
            onboard = candidateRepository.findCandidateByJobRtsIdAndStepRts(findValue,jobRtsId,ONBOARD);
            failed = candidateRepository.findCandidateByJobRtsIdAndStepRts(findValue,jobRtsId,FAILED);
        }else{
            results = candidateRepository.findCandidateByJobRtsIdAndStepRtsAndAssigness(findValue,jobRtsId,stepRts,assignees,pageRequest);
            qualify = candidateRepository.findCandidateByJobRtsIdAndStepRtsAndAssigness(findValue,jobRtsId ,QUALIFY,assignees);
            confirm = candidateRepository .findCandidateByJobRtsIdAndStepRtsAndAssigness(findValue,jobRtsId ,CONFIRM,assignees);
            interview = candidateRepository.findCandidateByJobRtsIdAndStepRtsAndAssigness(findValue,jobRtsId ,INTERVIEW,assignees);
            offer = candidateRepository.findCandidateByJobRtsIdAndStepRtsAndAssigness(findValue,jobRtsId ,OFFER,assignees);
            onboard = candidateRepository.findCandidateByJobRtsIdAndStepRtsAndAssigness(findValue,jobRtsId ,ONBOARD,assignees);
            failed = candidateRepository.findCandidateByJobRtsIdAndStepRtsAndAssigness(findValue,jobRtsId ,FAILED,assignees);
        }

        if(stepRts.toUpperCase(Locale.ROOT).equals(SOURCE.toUpperCase())){
            String[] steps = {stepRts , FAILED};
            results = candidateRepository.findCandidateByListStepRTS(findValue,findValue,findValue,steps,pageRequest);
        }
        outDto.setCandidateList(results.getContent());
        outDto.setTotalElements(results.getTotalElements());
        outDto.setTotalSource(source.size());
        outDto.setTotalQualify(qualify.size());
        outDto.setTotalConfirm(confirm.size());
        outDto.setTotalInterview(interview.size());
        outDto.setTotalOffer(offer.size());
        outDto.setTotalOnboard(onboard.size());
        outDto.setTotalFailed(failed.size());
        return outDto;
    }

    @Override
    public CandidatePublicDto getCandidatesByListJob(String jobRtsId, String stepRts, String assignees ,String skills , String experience , int pageIndex, int pageSize, String findValue, String orderBy, String sort) {
        String SOURCE = "none";
        String QUALIFY = "qualify";
        String CONFIRM = "confirm";
        String INTERVIEW = "interview";
        String OFFER = "offer";
        String ONBOARD = "onboard";
        String FAILED = "failed";

        String sortDirec = "DESC";
        if ("ASC".equals(sort))
            sortDirec = "ASC";

        PageRequest pageRequest = PageRequest.of(pageIndex - 1, pageSize, Sort.by(
                "DESC".equals(sortDirec) ? Sort.Direction.DESC : Sort.Direction.ASC, orderBy));
        CandidatePublicDto outDto = new CandidatePublicDto();

        Page<Candidate> results;
        List<Candidate> source;
        List<Candidate> qualify;
        List<Candidate> confirm;
        List<Candidate> interview;
        List<Candidate> offer;
        List<Candidate> onboard;
        List<Candidate> failed;
        source = candidateRepository.findByStepRts(SOURCE);
        String[] listStepRTS = stepRts.split(",");
        if(assignees == null || assignees.isEmpty()){
            results = candidateRepository.findCandidateByJobRtsIdAndListStepRts(findValue,jobRtsId,listStepRTS,pageRequest);
            qualify = candidateRepository.findCandidateByJobRtsIdAndStepRts(findValue,jobRtsId,QUALIFY);
            confirm = candidateRepository .findCandidateByJobRtsIdAndStepRts(findValue,jobRtsId,CONFIRM);
            interview = candidateRepository.findCandidateByJobRtsIdAndStepRts(findValue,jobRtsId,INTERVIEW);
            offer = candidateRepository.findCandidateByJobRtsIdAndStepRts(findValue,jobRtsId,OFFER);
            onboard = candidateRepository.findCandidateByJobRtsIdAndStepRts(findValue,jobRtsId,ONBOARD);
            failed = candidateRepository.findCandidateByJobRtsIdAndStepRts(findValue,jobRtsId,FAILED);
        }else{
            results = candidateRepository.findCandidateByJobRtsIdAndListStepRtsAndAssigness(findValue,jobRtsId,listStepRTS,assignees,pageRequest);
            qualify = candidateRepository.findCandidateByJobRtsIdAndStepRtsAndAssigness(findValue,jobRtsId ,QUALIFY,assignees);
            confirm = candidateRepository .findCandidateByJobRtsIdAndStepRtsAndAssigness(findValue,jobRtsId ,CONFIRM,assignees);
            interview = candidateRepository.findCandidateByJobRtsIdAndStepRtsAndAssigness(findValue,jobRtsId ,INTERVIEW,assignees);
            offer = candidateRepository.findCandidateByJobRtsIdAndStepRtsAndAssigness(findValue,jobRtsId ,OFFER,assignees);
            onboard = candidateRepository.findCandidateByJobRtsIdAndStepRtsAndAssigness(findValue,jobRtsId ,ONBOARD,assignees);
            failed = candidateRepository.findCandidateByJobRtsIdAndStepRtsAndAssigness(findValue,jobRtsId ,FAILED,assignees);
        }

        if(stepRts.toUpperCase(Locale.ROOT).equals(SOURCE.toUpperCase())){
            String[] steps = {stepRts , FAILED};
            results = candidateRepository.findCandidateByListStepRTS(findValue,findValue,findValue,steps,pageRequest);

        }
        outDto.setCandidateList(results.getContent());
        outDto.setTotalElements(results.getTotalElements());
        outDto.setTotalSource(source.size());
        outDto.setTotalQualify(qualify.size());
        outDto.setTotalConfirm(confirm.size());
        outDto.setTotalInterview(interview.size());
        outDto.setTotalOffer(offer.size());
        outDto.setTotalOnboard(onboard.size());
        outDto.setTotalFailed(failed.size());
        return outDto;
    }

    @Override
    public Candidate getCandidate(int candidateId) {
        Candidate candidate = candidateRepository.findByCandidateId(candidateId);
        return candidate;
    }

    @Override
    public Candidate getCandidateByEmailAndPhone(String email, String phone) {
        Candidate candidate = candidateRepository.findByEmailAndPhone(email, phone);
        return candidate;

    }

    @Override
    public List<Candidate> getCandidates(List<Integer> candidateIds) {
        List<Candidate> candidates = candidateRepository.findByCandidateIdIn(candidateIds);
        return candidates;
    }

    @Override
    public List<Candidate> getCandidateInListAndJobRtsId(List<Integer> candidateIds, String jobRtsId) {
        List<Candidate> candidates = candidateRepository.findByCandidateIdInAndJobRtsId(candidateIds,jobRtsId);
        return candidates;
    }

    @Override
    public Candidate deleteCadidateByAccessCode(String accessCode) {
        Candidate candidate = candidateRepository.findAllByAccessCode(accessCode);
        if(!ObjectUtils.isEmpty(candidate)){
            candidateRepository.deleteCandidateByAccessCode(accessCode);
            return candidate;
        }
        return null;
    }
}
