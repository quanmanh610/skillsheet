package vn.cmc.skillsheet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import vn.cmc.skillsheet.entity.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {

    @Query(value = "select * from project s where s.project_id = :project_id", nativeQuery = true)
    public Project findOneById(@Param("project_id") int project_id);
    
    @Query(value = "select * from project s where s.profile_id = :profile_id", nativeQuery = true)
    public List<Project> findByProfileId(@Param("profile_id") int profile_id);
    
    @Query(value = "select s.profile_id from project s where s.project_id = :project_id", nativeQuery = true)
    public int selectProfileId(@Param("project_id") int project_id);
    
    @Query(value = "select count(*) from project s where s.project_role_id = :role_id", nativeQuery = true)
    public int findByRoleId(@Param("role_id") int role_id);
    
    @Transactional
    @Modifying
    @Query(value = "delete from project where project_role_id = :role_id", nativeQuery = true)
    public void deleteByRoleId(@Param("role_id") int role_id);
}