package vn.cmc.skillsheet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import vn.cmc.skillsheet.entity.Education;
import vn.cmc.skillsheet.entity.ProfileCertificate;

@Repository
public interface ProfileCertificateRepository extends JpaRepository<ProfileCertificate, Integer> {

    @Query(value = "select * from profile_certificate s where s.profile_certificate_id = :profile_certificate_id", nativeQuery = true)
    public ProfileCertificate findOneById(@Param("profile_certificate_id") int profile_certificate_id);
    
    @Query(value = "select * from profile_certificate s where s.profile_id = :profile_id", nativeQuery = true)
    public List<ProfileCertificate> findByProfileId(@Param("profile_id") int profile_id);
    
    @Query(value = "select count(*) from profile_certificate s where s.certificate_id = :certificate_id", nativeQuery = true)
    public int findByCertificateId(@Param("certificate_id") int certificate_id);
    
    @Transactional
    @Modifying
    @Query(value = "delete from profile_certificate where certificate_id = :certificate_id", nativeQuery = true)
    public void deleteByCertificateId(@Param("certificate_id") int certificate_id);
}