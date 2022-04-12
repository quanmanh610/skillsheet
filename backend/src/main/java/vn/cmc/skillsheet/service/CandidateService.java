package vn.cmc.skillsheet.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;
import vn.cmc.skillsheet.dto.CandidateDto;
import vn.cmc.skillsheet.dto.CandidatePublicDto;
import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.vo.FindCandidateParams;

public interface CandidateService {
//    public CandidateDto getListOfCandidatePagination(int page, int size, String column, String sort,
//            String fullName, String roletName, String status); 
    
    public CandidateDto getListOfCandidate();

    public Candidate addCandidate(CandidateDto inDto);

    public Candidate updateCandidate(CandidateDto inDto);

    public void deleteCandidate(CandidateDto inDto);

    public CandidateDto getCandidate(CandidateDto inDto);
    
    public CandidateDto generateLinkRequest(CandidateDto inDto) throws Exception;
    
    public List<Candidate> searchCandidate(String fullName,String roleName,String status);
    
    public List<Integer> getListCandidateIdWithSatatusNew(String fullName, String roleName, String status);
    
    public int countEmail(String email);
    
    public CandidateDto getCandidateByEmailAndRole(CandidateDto inDto);
    
    public CandidateDto getCandidateByEmail(CandidateDto inDto);
    
    public List<String> getSuggestions(String type, String searchValue);
    
    public CandidateDto getCandidatePagination(FindCandidateParams params);

    public boolean checkCandidateExits(Candidate candidate);

    public CandidateDto insertCvPull(MultipartFile file);


    public CandidateDto insertCv(MultipartFile file , String requestId , String stepRts);

    public CandidateDto getCandidatePublicPagination(int pageIndex, int pageSize, String findValue,String stepRts, String orderBy, String sort);

    public CandidatePublicDto getCandidatesByJob(String jobRtsId, String stepRts,String assignees, int pageIndex, int pageSize, String findValue, String orderBy, String sort);

    public CandidatePublicDto getCandidatesByListJob(String jobRtsId, String stepRts,String assignees,String skills , String experience , int pageIndex, int pageSize, String findValue, String orderBy, String sort);

    public Candidate getCandidate(int candidateId);

    public Candidate getCandidateByEmailAndPhone(String email, String phone);

    public List<Candidate> getCandidates(List<Integer> candidateIds);

    public List<Candidate> getCandidateInListAndJobRtsId(List<Integer> candidateIds, String jobRtsId);

    public Candidate deleteCadidateByAccessCode(String accessCode);
}
