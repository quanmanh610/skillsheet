package vn.cmc.skillsheet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.cmc.skillsheet.entity.School;

@Repository
public interface SchoolRepository extends JpaRepository<School, Integer> {

    @Query(value = "select * from school t where t.school_id = :school_id", nativeQuery = true)
    public School findOneById(@Param("school_id") int school_id);
}