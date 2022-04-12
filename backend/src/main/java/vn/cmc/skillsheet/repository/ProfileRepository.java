package vn.cmc.skillsheet.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.Version;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Integer> {

    @Query(value = "select * from profile t where t.profile_id = :profile_id", nativeQuery = true)
    public Profile findOneById(@Param("profile_id") int profile_id);

    public List<Profile> findByEmail(String email);
    
    @Query(value = "select * from profile p join version v on p.version_id = v.version_id"
    		+ " where p.email = :email order by v.version_type ASC, p.updated_date DESC, p.created_date DESC limit 1;", nativeQuery = true)
    public Profile findByEmailForDashboard(@Param("email") String email);
    
    @Query(value = "select * from profile t where t.candidate_id = :candidate_id", nativeQuery = true)
    public List<Profile> findByCandidateId(@Param("candidate_id") int candidateId);

    @Transactional
    @Modifying
    @Query(value = "UPDATE profile t SET status = :status where t.profile_id = :profile_id", nativeQuery = true)
    public void updateStatus(@Param("profile_id") int profile_id, @Param("status") String status);

	@Transactional
	@Modifying
	@Query(value = "UPDATE profile t SET email = :email where t.email = :oldEmail", nativeQuery = true)
	public void updateEmail(@Param("oldEmail") String oldEmail, @Param("email") String email);

    @Query(value = "delete profile t  where t.profile_id in (:ids)", nativeQuery = true)
    public void deleteMuiltiProject(@Param("ids") List<String> ids);
    
    @Query(value = "call usp_profile_find_in_view("
    		+ ":fullName, "
    		+ ":skillName, "
    		+ ":roleName, "
    		+ ":languageName, "
    		+ ":certificate, "
    		+ ":profileType, "
    		+ ":userGroup, "
    		+ ":userDu, "    		    		
    		+ ":availableTo, "   
    		+ ":yearsOfExperience, "
    		+ ":pageIndex, "
    		+ ":pageSize)", nativeQuery = true)
    public List<Object> findProfile(
    		@Param("fullName") String fullName,
    		@Param("skillName") String skillName,
            @Param("roleName") String roleName, 
            @Param("languageName") String languageName,
            @Param("certificate") String certificate,
            @Param("profileType") String profileType,
            @Param("userGroup") String userGroup,
            @Param("userDu") String userDu,                        
            @Param("availableTo") String availableTo,
            @Param("yearsOfExperience") int yearsOfExperience,
            @Param("pageIndex") int pageIndex,
            @Param("pageSize") int pageSize);
    
    @Query(value = "call usp_profile_count("
    		+ ":fullName, "
    		+ ":skillName, "
    		+ ":roleName, "
    		+ ":languageName, "
    		+ ":certificate, "
    		+ ":profileType, "
    		+ ":userGroup, "
    		+ ":userDu, "
    		+ ":availableTo, "    		
    		+ ":yearsOfExperience)",    		
    		nativeQuery = true)
    public int countProfile(
    		@Param("fullName") String fullName,
    		@Param("skillName") String skillName,
            @Param("roleName") String roleName, 
            @Param("languageName") String languageName,
            @Param("certificate") String certificate,
            @Param("profileType") String profileType,
            @Param("userGroup") String userGroup,
            @Param("userDu") String userDu,                        
            @Param("availableTo") String availableTo,
            @Param("yearsOfExperience") int yearsOfExperience);
    
    // for dashboard
    @Query(value = "call usp_profile_find_in_view_for_dashboard("
    		+ ":fullName, "
    		+ ":skillName, "
    		+ ":roleName, "
    		+ ":languageName, "
    		+ ":certificate, "
    		+ ":profileType, "
    		+ ":userGroup, "
    		+ ":userDu, "    		    		
    		+ ":availableTo, "   
    		+ ":yearsOfExperience, "
    		+ ":pageIndex, "
    		+ ":pageSize)", nativeQuery = true)
    public List<Object> findProfileForDashboard(
    		@Param("fullName") String fullName,
    		@Param("skillName") String skillName,
            @Param("roleName") String roleName, 
            @Param("languageName") String languageName,
            @Param("certificate") String certificate,
            @Param("profileType") String profileType,
            @Param("userGroup") String userGroup,
            @Param("userDu") String userDu,                        
            @Param("availableTo") String availableTo,
            @Param("yearsOfExperience") int yearsOfExperience,
            @Param("pageIndex") int pageIndex,
            @Param("pageSize") int pageSize);
    
    @Query(value = "call usp_profile_count_for_dashboard("
    		+ ":fullName, "
    		+ ":skillName, "
    		+ ":roleName, "
    		+ ":languageName, "
    		+ ":certificate, "
    		+ ":profileType, "
    		+ ":userGroup, "
    		+ ":userDu, "
    		+ ":availableTo, "    		
    		+ ":yearsOfExperience)",    		
    		nativeQuery = true)
    public int countProfileForDashboard(
    		@Param("fullName") String fullName,
    		@Param("skillName") String skillName,
            @Param("roleName") String roleName, 
            @Param("languageName") String languageName,
            @Param("certificate") String certificate,
            @Param("profileType") String profileType,
            @Param("userGroup") String userGroup,
            @Param("userDu") String userDu,                        
            @Param("availableTo") String availableTo,
            @Param("yearsOfExperience") int yearsOfExperience);

    @Query(value = "SELECT p.profile_id \r\n" + "FROM profile p \r\n"
            + "left join profile_skill ps on ps.profile_id= p.profile_id  \r\n"
            + "left join profile_certificate pc on  pc.profile_id= p.profile_id \r\n"
            + "left join language l on  l.profile_id= p.profile_id\r\n"
            + "left join skill s on ps.skill_id = s.skill_id\r\n"
            + "left join certificate c on pc.certificate_id= c.certificate_id\r\n"
            + "where (s.name like :skillName or s.name is null) and (p.role_name like :roleName or p.role_name is null) and (l.name like :languageName or l.name is null)\r\n"
            + "GROUP BY p.profile_id", nativeQuery = true)
    public List<Integer> getListProfileId(@Param("skillName") String skillName,
            @Param("roleName") String roleName, @Param("languageName") String languageName);
    
    @Query(value = "select * from profile t where t.version_id = :versionId", nativeQuery = true)
	public Profile findByVersionId(@Param("versionId") int versionId);
   
    @Query(value = "select * from profile where staff_id = :staffId", nativeQuery = true)
    public List<Profile> findByStaffId(@Param("staffId") int staffId);
    
    @Query(value = "call usp_profile_get_summary(:startDate)", nativeQuery = true)
    public List<Object> getProfileSummary(@Param("startDate") Date startDate);
}