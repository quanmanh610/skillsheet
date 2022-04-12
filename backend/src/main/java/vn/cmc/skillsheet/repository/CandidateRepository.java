package vn.cmc.skillsheet.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.transaction.annotation.Transactional;
import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.ChangeHistory;

/**
 * @author NDDUC
 *
 */
@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Integer> {

    @Query(value = "select * from candidate c where c.candidate_id = :candidate_id", nativeQuery = true)
    public Candidate findOneById(@Param("candidate_id") int candidate_id);
    
    @Query(value = "select * from candidate c where c.access_token = :token", nativeQuery = true)
    public Candidate findOneByToken(@Param("token") String token);

    @Query(value = "select * from candidate c where c.full_name LIKE %:full_name% and c.role_name LIKE %:role_name% and c.status LIKE %:status% ", nativeQuery = true)
    public List<Candidate> searchCandidate(@Param("full_name") String full_name,
            @Param("role_name") String role_name, @Param("status") String status);

    @Query(value = "select candidate_id from candidate where status = 'new' and full_name LIKE %:full_name% and role_name LIKE %:role_name% and status LIKE %:status% \r\n", nativeQuery = true)
    public List<Integer> getListCandidateIdWithSatatusNew(@Param("full_name") String full_name,
            @Param("role_name") String role_name, @Param("status") String status);
    
    public Page<Candidate> findByFullNameLikeAndRoleNameLikeAndStatusLike(String fullName, String roleName, String status, Pageable pageable);

    @Query(value = "select count(*) from candidate c where c.email = :email", nativeQuery = true)
    public int countEmail(@Param("email") String email);
    
    public  List<Candidate> findByEmail(String email);

    @Query(value = "SELECT c from Candidate c where c.fullName = :full_name")
    public Candidate findByFullName(@Param("full_name") String fullName);

    @Query(value = "select c from Candidate c where c.fullName = :full_name and c.roleName = :role_name")
    public Candidate findByFullNameAndRole(@Param("full_name")String fullName,@Param("role_name") String role_name);

    @Query(value = "select * from candidate c where c.email = :email and c.role_name = :role_name", nativeQuery = true)
    public Candidate findByEmailAndRole(@Param("email")String email,@Param("role_name") String role_name);
    
    @Query(value = "select * from candidate c where c.email = :email", nativeQuery = true)
    public Candidate findCandidateByEmail(@Param("email")String email);

    @Query(value = "select * from candidate c where c.email = :email and c.phone = :phone", nativeQuery = true)
    public List<Candidate> findCandidateByEmailAndPhone(@Param("email")String email, @Param("phone")String phone);
    
    @Query(value = "call usp_candidate_get_user_names("
    		+ ":search, "    		
    		+ ":limit)", nativeQuery = true)
    public List<String> getNameSuggestions(@Param("search") String search, @Param("limit") int limit);
    
    @Query(value = "select distinct(role_name) from candidate", nativeQuery = true)
    public List<String> getAllRoleNames();
    
    @Query(value = "call usp_candidate_find("
    		+ ":fullName, " 
    		+ ":roleName, " 
    		+ ":requestStatus, "    		
    		+ ":pageIndex, "
    		+ ":pageSize)", nativeQuery = true)
    public List<Object> findCandidate(
    		@Param("fullName") String fullName,    		
            @Param("roleName") String roleName,             
            @Param("requestStatus") String requestStatus,            
            @Param("pageIndex") int pageIndex,
            @Param("pageSize") int pageSize);
    
    @Query(value = "call usp_candidate_count("
    		+ ":fullName, " 
    		+ ":roleName, " 
    		+ ":requestStatus)", nativeQuery = true)
    public int getCandidateCount(
    		@Param("fullName") String fullName,    		
            @Param("roleName") String roleName,             
            @Param("requestStatus") String requestStatus);



    @Query(value = "select * from candidate c where (c.full_name LIKE %:full_name% or c.email LIKE %:email% or c.phone LIKE %:phone%) AND step_rts =:stepRts", nativeQuery = true)
    public Page<Candidate> findCandidate(@Param("full_name") String full_name, @Param("email") String email, @Param("phone") String phone,@Param("stepRts") String stepRts, Pageable pageable);

    @Query(value = "select * from candidate c where (c.full_name LIKE %:full_name% or c.email LIKE %:email% or c.phone LIKE %:phone%) AND step_rts In :stepRts", nativeQuery = true)
    Page<Candidate> findCandidateByListStepRTS(@Param("full_name") String full_name, @Param("email") String email, @Param("phone") String phone,@Param("stepRts") String[] stepRts, Pageable pageable);

    @Query(value = "select * from candidate c where ((experience LIKE %:findValue% or experience is null) or (skill LIKE %:findValue% or skill is null) or (full_name LIKE %:findValue% or full_name is null) or (email LIKE %:findValue% or email is null) or (phone LIKE %:findValue% or phone is null)) AND step_rts =:stepRts AND job_rts_id =:jobRtsId" , nativeQuery = true)
    public Page<Candidate> findCandidateByJobRtsIdAndStepRts(@Param("findValue") String findValue, @Param("jobRtsId") String jobRtsId,@Param("stepRts") String stepRts, Pageable pageable);

    @Query(value = "select * from candidate c where ((experience LIKE %:findValue%) or (skill LIKE %:findValue%) or (full_name LIKE %:findValue% or full_name is null) or (email LIKE %:findValue% or email is null) or (phone LIKE %:findValue% or phone is null)) AND step_rts =:stepRts AND job_rts_id =:jobRtsId AND assignees =:assignees", nativeQuery = true)
    public Page<Candidate> findCandidateByJobRtsIdAndStepRtsAndAssigness(@Param("findValue") String findValue, @Param("jobRtsId") String jobRtsId,@Param("stepRts") String stepRts,@Param("assignees") String assignees , Pageable pageable);

    @Query(value = "select * from candidate c where ((experience LIKE %:findValue%) or (skill LIKE %:findValue%) or (full_name LIKE %:findValue% or full_name is null) or (email LIKE %:findValue% or email is null) or (phone LIKE %:findValue% or phone is null)) AND step_rts =:stepRts AND job_rts_id =:jobRtsId AND assignees =:assignees", nativeQuery = true)
    List<Candidate> findCandidateByJobRtsIdAndStepRtsAndAssigness(@Param("findValue") String findValue, @Param("jobRtsId") String jobRtsId,@Param("stepRts") String stepRts,@Param("assignees") String assignees);

    @Query(value = "select * from candidate c where ((full_name LIKE %:findValue% or full_name is null) or (email LIKE %:findValue% or email is null) or (phone LIKE %:findValue% or phone is null)) AND step_rts IN :stepRts AND job_rts_id =:jobRtsId", nativeQuery = true)
    public Page<Candidate> findCandidateByJobRtsIdAndListStepRts(@Param("findValue") String findValue, @Param("jobRtsId") String jobRtsId,@Param("stepRts") String[] stepRts,Pageable pageable);

    @Query(value = "select * from candidate c where ((full_name LIKE %:findValue% or full_name is null) or (email LIKE %:findValue% or email is null) or (phone LIKE %:findValue% or phone is null)) AND step_rts IN :stepRts AND job_rts_id =:jobRtsId", nativeQuery = true)
    List<Candidate> findCandidateByJobRtsIdAndListStepRts(@Param("findValue") String findValue, @Param("jobRtsId") String jobRtsId,@Param("stepRts") String[] stepRts);

    @Query(value = "select * from candidate c where ((full_name LIKE %:findValue% or full_name is null) or (email LIKE %:findValue% or email is null) or (phone LIKE %:findValue% or phone is null)) AND step_rts IN :stepRts AND job_rts_id =:jobRtsId AND assignees =:assignees", nativeQuery = true)
    public Page<Candidate> findCandidateByJobRtsIdAndListStepRtsAndAssigness(@Param("findValue") String findValue, @Param("jobRtsId") String jobRtsId,@Param("stepRts") String[] stepRts,@Param("assignees") String assignees, Pageable pageable);

    @Query(value = "select * from candidate c where ((experience LIKE %:findValue%) or (skill LIKE %:findValue%) or (full_name LIKE %:findValue%) or (email LIKE %:findValue%) or (phone LIKE %:findValue%)) AND step_rts =:stepRts AND job_rts_id =:jobRtsId" , nativeQuery = true)
    List<Candidate> findCandidateByJobRtsIdAndStepRts(@Param("findValue") String findValue, @Param("jobRtsId") String jobRtsId,@Param("stepRts") String stepRts);


    @Query(value = "select * from Candidate c where c.jobRtsId =:jobRtsId and c.stepRts IN :stepRts" , nativeQuery = true)
    public List<Candidate> findByJobRtsIdAndListStepRts(String jobRtsId, String[] stepRts);

    @Query(value = "select c from Candidate c where c.jobRtsId =:jobRtsId and c.stepRts IN :stepRts and c.assignees = :assignees" , nativeQuery = true)
    public  List<Candidate> findByJobRtsIdAndListStepRtsAndAssignees(String jobRtsId, String[] stepRts,String assignees);

    public  List<Candidate> findByStepRts(String stepRts);

    @Query(value = "select * from candidate c where  step_rts =:stepRts", nativeQuery = true)
    public  Page<Candidate> findByStepRtsPageable(@Param("stepRts")String stepRts,Pageable pageable);

    public  List<Candidate> findByJobRtsIdAndStepRtsAndAssignees(String jobRtsId, String stepRts,String assignees);

    public Candidate findByCandidateId(int candidateId);
    public Candidate findByEmailAndPhone(String email, String phone);

    public  List<Candidate> findByCandidateIdIn(List<Integer> candidateIds);
    public  List<Candidate> findByCandidateIdInAndJobRtsId(List<Integer> candidateIds, String jobRts);

    @Query(value = "select c from Candidate c where c.fullName = :fullName and c.password = :password")
    public Candidate findCandidateByFullNameAndPassword(@Param("fullName") String fullName ,@Param("password") String password);

    @Transactional
    @Modifying
    @Query("delete from Candidate u where u.accessCode = :access_code")
    public void deleteCandidateByAccessCode(@Param("access_code") String access_code);

    @Query("select c from Candidate c where c.accessCode = :access_code")
    public Candidate findAllByAccessCode(@Param("access_code")String access_code);

    @Query("select c from Candidate c where c.fullName =:email")
    public Candidate findCandidateAccountByEmail(@Param("email") String email);
}
 