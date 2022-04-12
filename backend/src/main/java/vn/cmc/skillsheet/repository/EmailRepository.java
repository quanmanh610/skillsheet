package vn.cmc.skillsheet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.cmc.skillsheet.entity.Email;

@Repository
public interface EmailRepository extends JpaRepository<Email, Integer> {

    @Query(value = "select * from email e where e.email_id = :email_id", nativeQuery = true)
    public Email findOneById(@Param("email_id") int email_id);
}