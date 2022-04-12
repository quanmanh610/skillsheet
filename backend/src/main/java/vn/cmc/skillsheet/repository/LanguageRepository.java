package vn.cmc.skillsheet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.Education;
import vn.cmc.skillsheet.entity.Language;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Integer> {

    @Query(value = "select * from language c where c.language_id = :language_id", nativeQuery = true)
    public Language findOneById(@Param("language_id") int language_id);

    @Query(value = "select * from language c where c.profile_id = :profile_id", nativeQuery = true)
    public List<Language> findByProfileId(@Param("profile_id") int profile_id);
    
    @Query(value = "select c.profile_id from language c where c.language_id = :language_id", nativeQuery = true)
    public int selectProfileId(@Param("language_id") int language_id);
    
    @Query(value = "select distinct name from language order by name asc", nativeQuery = true)
    public List<String> getAllLanguageNames();
}
