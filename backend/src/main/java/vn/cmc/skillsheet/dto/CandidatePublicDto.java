package vn.cmc.skillsheet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.ProjectRole;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidatePublicDto {

    private Candidate selectedCandidate;

    private List<Candidate> candidateList;

    private long totalElements;

    private long totalSource;

    private long totalQualify;

    private long totalConfirm;

    private long totalInterview;

    private long totalOffer;

    private long totalOnboard;

    private long totalFailed;
    
}
