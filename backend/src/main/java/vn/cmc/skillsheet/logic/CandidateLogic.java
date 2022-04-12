package vn.cmc.skillsheet.logic;

import java.util.List;

import vn.cmc.skillsheet.entity.Candidate;

public interface CandidateLogic {
	   /**
     * 
     */
    public List<Candidate> getListofCandidate();

    /** 
     * 
     * @param candidate
     */
    public Candidate updateCandidate(Candidate candidate);

    /**
     * 
     * @param candidate
     */
    public Candidate addCandidate(Candidate candidate);

    /**
     * 
     * @param candidate
     */
    public void deleteCandidate(int candidateId);
    
    /**
     * 
     * @param candidateId
     */
    public Candidate getCandidate(int candidateId);

    public Candidate getCandiDateByFullNameAndRole(String fullName , String roleName);
    
    /**
     * 
     * @param 
     */
    public List<Candidate> searchCandidate(String fullName,String roleName,String status);
    
    /**
     * 
     * @param 
     */
    public Candidate getCandidateByEmailAndRole(String email, String roleName);
    
    public Candidate getCandidateByEmail(String email);
    
    public List<String> getFieldSuggestions(String type, String searchValue);
}
