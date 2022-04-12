package vn.cmc.skillsheet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.cmc.skillsheet.entity.TemplateProfile;

@Repository
public interface TemplateProfileRepository extends JpaRepository<TemplateProfile, Integer> {

    @Query(value = "select * from template_profile t where t.template_id = :template_id", nativeQuery = true)
    public TemplateProfile findOneById(@Param("template_id") int template_id);
    
}