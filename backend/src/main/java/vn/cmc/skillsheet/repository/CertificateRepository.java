package vn.cmc.skillsheet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.cmc.skillsheet.entity.Certificate;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Integer> {

    @Query(value = "select * from certificate c where c.certificate_id = :certificate_id", nativeQuery = true)
    public Certificate findOneById(@Param("certificate_id") int certificate_id);

    @Query(value = "select * from certificate c where c.category = :category and c.name = :name", nativeQuery = true)
    public Certificate findByCategoryAndName(@Param("category") String category,
            @Param("name") String name);
    
    @Query(value = "select distinct name from certificate order by name asc", nativeQuery = true)
    public List<String> getAllCertificateNames();
}