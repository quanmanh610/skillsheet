package vn.cmc.skillsheet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.cmc.skillsheet.entity.Education;
import vn.cmc.skillsheet.entity.TemplateProfile;
import vn.cmc.skillsheet.entity.WorkExperience;

@Repository
public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Integer> {

    @Query(value = "select * from work_experience t where t.work_experience_id = :work_experience_id", nativeQuery = true)
    public WorkExperience findOneById(@Param("work_experience_id") int work_experience_id);
    
    @Query(value = "select * from work_experience t where t.profile_id = :profile_id", nativeQuery = true)
    public List<WorkExperience> findByProfileId(@Param("profile_id") int profile_id);
    
    @Query(value = "select t.profile_id from work_experience t where t.work_experience_id = :work_experience_id", nativeQuery = true)
    public int selectProfileId(@Param("work_experience_id") int work_experience_id);
}