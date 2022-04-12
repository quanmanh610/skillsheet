package vn.cmc.skillsheet.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.ProjectRole;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidateDto {

    private Candidate selectedCandidate;

    private List<Candidate> candidateList;

    private String selectedCandidateId;

    private List<ProjectRole> projectroleList;
    
    private long totalElements;
    
}
