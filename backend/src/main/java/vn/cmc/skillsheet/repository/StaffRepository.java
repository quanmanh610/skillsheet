package vn.cmc.skillsheet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.cmc.skillsheet.entity.Staff;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {

    @Query(value = "select * from staff s where s.staff_id = :staff_id", nativeQuery = true)
    public Staff findOneById(@Param("staff_id") int staff_id);

    @Query(value = "select * from staff s where s.user_name = :user_name", nativeQuery = true)
    public Staff findOneByUserName(@Param("user_name") String user_name);

    public Staff findByEmail(String email);
    
    @Query(value = "select distinct staff_group from staff order by staff_group asc", nativeQuery = true)
    public List<String> getAllGroupNames();
    
    @Query(value = "select distinct du from staff order by du asc", nativeQuery = true)
    public List<String> getAllDuNames();
    
    @Query(value = "call usp_profile_get_user_names("
    		+ ":search, "    		
    		+ ":limit)", nativeQuery = true)
    public List<String> getNameSuggestions(@Param("search") String search, @Param("limit") int limit);
    
    @Query(value = "select * from staff s where s.token = :token", nativeQuery = true)
    public Staff findOneByToken(@Param("token") String token);
    
    @Query(value = "select * from skillset.staff s where s.is_du_lead = 1 and s.is_group_lead = 0", nativeQuery = true)
    public List<Staff> getDuLeads();
}