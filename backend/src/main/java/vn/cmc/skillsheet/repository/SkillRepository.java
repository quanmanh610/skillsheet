package vn.cmc.skillsheet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.cmc.skillsheet.entity.Skill;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Integer> {

    @Query(value = "select * from skill s where s.skill_id = :skill_id", nativeQuery = true)
    public Skill findOneById(@Param("skill_id") int skill_id);

    @Query(value = "select * from skill c where c.category = :category and c.name = :name", nativeQuery = true)
    public Skill findByCategoryAndName(@Param("category") String category,
            @Param("name") String name);
    
    @Query(value = "select * from skill c where c.name = :name", nativeQuery = true)
    public List<Skill> findByName(@Param("name") String name);
    
    @Query(value = "select distinct name from skill order by name asc", nativeQuery = true)
    public List<String> getAllSkillNames();
}