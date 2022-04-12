package vn.cmc.skillsheet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import vn.cmc.skillsheet.entity.Education;

@Repository
public interface EducationRepository extends JpaRepository<Education, Integer> {

    @Query(value = "select * from education c where c.education_id = :education_id", nativeQuery = true)
    public Education findOneById(@Param("education_id") int education_id);

    @Query(value = "select * from education c where c.profile_id = :profile_id", nativeQuery = true)
    public List<Education> findByProfileId(@Param("profile_id") int profile_id);
    
    @Query(value = "select c.profile_id from education c where c.education_id = :education_id", nativeQuery = true)
    public int selectProfileId(@Param("education_id") int education_id);
    
    @Query(value = "select count(*) from education s where s.school_id = :school_id", nativeQuery = true)
    public int findBySchoolId(@Param("school_id") int school_id);
    
    @Transactional
    @Modifying
    @Query(value = "delete from education where school_id = :school_id", nativeQuery = true)
    public void deleteBySchoolId(@Param("school_id") int school_id);
}
