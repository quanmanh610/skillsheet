package vn.cmc.skillsheet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import vn.cmc.skillsheet.entity.ProfileSkill;

@Repository
public interface ProfileSkillRepository extends JpaRepository<ProfileSkill, Integer> {

    @Query(value = "select * from profile_skill s where s.profile_skill_id = :profile_skill_id", nativeQuery = true)
    public ProfileSkill findOneById(@Param("profile_skill_id") int profile_skill_id);
    
    @Query(value = "select * from profile_skill s where s.profile_id = :profile_id", nativeQuery = true)
    public List<ProfileSkill> findByProfileId(@Param("profile_id") int profile_id);
    
    @Query(value = "select count(*) from profile_skill s where s.skill_id = :skill_id", nativeQuery = true)
    public int findBySkillId(@Param("skill_id") int skill_id);
    
    @Transactional
    @Modifying
    @Query(value = "delete from profile_skill where skill_id = :skill_id", nativeQuery = true)
    public void deleteBySkillId(@Param("skill_id") int skill_id);
}