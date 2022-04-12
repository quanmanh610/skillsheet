package vn.cmc.skillsheet.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.cmc.skillsheet.entity.RequestApproval;

@Repository
public interface RequestApprovalRepository extends JpaRepository<RequestApproval, Integer> {

    @Query(value = "select * from request_approval s where s.request_approval_id = :request_approval_id", nativeQuery = true)
    public RequestApproval findOneById(@Param("request_approval_id") int request_approval_id);

    @Query(value = "select * from request_approval s where s.status = :status", nativeQuery = true)
    public List<RequestApproval> findAll(@Param("status") String status);

    @Query(value = "select * from request_approval s where s.version_id = :version_id", nativeQuery = true)
    public List<RequestApproval> findByVersionId(@Param("version_id") int version_id);

    public Page<RequestApproval> findByFullNameLikeAndRoleNameLikeAndStatusLikeAndCreatedDateAfterAndCreatedDateBefore(
            String fullName, String roleName, String status, Date from, Date to, Pageable pageable);
    
    @Query(value = "call usp_request_approval_get_user_names("
    		+ ":search, "    		
    		+ ":limit)", nativeQuery = true)
    public List<String> getNameSuggestions(@Param("search") String search, @Param("limit") int limit);
    
    @Query(value = "select distinct(role_name) from request_approval", nativeQuery = true)
    public List<String> getAllRoleNames();
    
    @Query(value = "call usp_request_approval_find("
    		+ ":fullName, " 
    		+ ":roleName, " 
    		+ ":requestStatus, "
    		+ ":fromDate, "
    		+ ":toDate, "
    		+ ":staffGroup, "
    		+ ":staffDu, "
    		+ ":picEmail, "
    		+ ":pageIndex, "
    		+ ":pageSize)", nativeQuery = true)
    public List<Object> findRequestApproval(
    		@Param("fullName") String fullName,    		
            @Param("roleName") String roleName,             
            @Param("requestStatus") String requestStatus,
            @Param("fromDate") Date fromDate,
            @Param("toDate") Date toDate,
            @Param("staffGroup") String group,
            @Param("staffDu") String du,
            @Param("picEmail") String picEmail,
            @Param("pageIndex") int pageIndex,
            @Param("pageSize") int pageSize);
    
    @Query(value = "call usp_request_approval_count("
    		+ ":fullName, " 
    		+ ":roleName, " 
    		+ ":requestStatus, "    		
    		+ ":fromDate, "
    		+ ":toDate, "
    		+ ":staffGroup, "
    		+ ":staffDu, " 
    		+ ":picEmail)",
    		nativeQuery = true)
    public int getRequestApprovalCount(
    		@Param("fullName") String fullName,    		
            @Param("roleName") String roleName,             
            @Param("requestStatus") String requestStatus,
            @Param("fromDate") Date fromDate,
            @Param("toDate") Date toDate,
            @Param("staffGroup") String group,
            @Param("staffDu") String du,
    		@Param("picEmail") String picEmail);
}