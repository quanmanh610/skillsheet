package vn.cmc.skillsheet.logic.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.logic.CandidateLogic;
import vn.cmc.skillsheet.repository.CandidateRepository;

@Component
public class CandidateLogicImpl implements CandidateLogic {
    @Autowired
    private CandidateRepository candidateRepository;

    @Override
    public List<Candidate> getListofCandidate() {
        return candidateRepository.findAll();
    }

    @Override
    public Candidate updateCandidate(Candidate candidate) {
        return candidateRepository.save(candidate);

    }

    @Override
    public Candidate addCandidate(Candidate candidate) {
        return candidateRepository.save(candidate);

    }

    @Override
    public void deleteCandidate(int candidateId) {
        candidateRepository.deleteById(candidateId);

    }

    @Override
    public Candidate getCandidate(int candidateId) {
        return candidateRepository.findOneById(candidateId);
    }

    @Override
    public Candidate getCandiDateByFullNameAndRole(String fullName, String roleName) {
        return candidateRepository.findByFullNameAndRole(fullName , roleName);
    }

    @Override
    public List<Candidate> searchCandidate(String fullName, String roleName, String status) {
        return candidateRepository.searchCandidate(fullName, roleName, status);
    }
    
    @Override
    public Candidate getCandidateByEmailAndRole(String email, String roleName) {
        return candidateRepository.findByEmailAndRole(email, roleName);
    }
    
    @Override
    public Candidate getCandidateByEmail(String email) {
        return candidateRepository.findCandidateByEmail(email);
    }

    @Override
    public List<String> getFieldSuggestions(String type, String searchValue) {
		List<String> suggestions = new ArrayList<String>();
		if (type == null) {
			return suggestions;
		}
		type = type.toUpperCase();
		if (type.equals("ROLE")) {
			suggestions = candidateRepository.getAllRoleNames();
		} else if (type.equals("FULLNAME")) {
			suggestions = candidateRepository.getNameSuggestions(searchValue, 20);
		}
		
		return suggestions;
	}
}
