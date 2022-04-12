package vn.cmc.skillsheet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.cmc.skillsheet.entity.ProjectRole;

@Repository
public interface ProjectRoleRepository extends JpaRepository<ProjectRole, Integer> {

    @Query(value = "select * from project_role p where p.project_role_id = :project_role_id", nativeQuery = true)
    public ProjectRole findOneById(@Param("project_role_id") int projectRoleId);
    
    @Query(value = "select * from project_role p where p.name = :name", nativeQuery = true)
    public ProjectRole findOneByName(@Param("name") String names);
    
    @Query(value = "select distinct name from project_role order by name asc", nativeQuery = true)
    public List<String> getAllRoleNames();
    
}