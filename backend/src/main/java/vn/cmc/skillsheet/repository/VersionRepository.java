package vn.cmc.skillsheet.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.Version;

@Repository
public interface VersionRepository extends JpaRepository<Version, Integer> {

    @Query(value = "select * from version s where s.version_id = :version_id", nativeQuery = true)
    public Version findOneById(@Param("version_id") int version_id);

    @Query(value = "select s.* from version s inner join profile p on s.version_id = p.version_id\r\n"
            + "where s.version_name like :version_name and s.version_type like :version_type\r\n"
            + " and p.email = :email\r\n"
            , countQuery = "select count(*) from version s inner join profile p on s.version_id=p.version_id\r\n"
                    + "where s.version_name like :version_name and s.version_type like :version_type\r\n"
                    + " and p.email = :email\r\n"
                    , nativeQuery = true)
    public Page<Version> findVersionPegeable(@Param("version_name") String version_name,
            @Param("version_type") String version_type, @Param("email") String email,
            Pageable pageable);

    @Query(value = "SELECT s.* FROM profile p left join version s on p.version_id = s.version_id \r\n"
            + "where s.version_name LIKE :version_name and s.version_type LIKE :version_type \r\n"
            , countQuery = "SELECT count(*) FROM profile p left join version s on p.version_id=s.version_id \r\n"
                    + "where s.version_name LIKE :version_name and s.version_type LIKE :version_type \r\n", nativeQuery = true)
    public Page<Version> findAllVersionPegeable(@Param("version_name") String version_name,
            @Param("version_type") String version_type, Pageable pageable);

    public Page<Version> findByVersionNameLikeAndVersionTypeLike(String versionName, String versionType, Pageable pageable);
    
    
    
    @Query(value = "select s.version_id from version s inner join profile p on s.version_id = p.version_id\r\n"
            + "where s.version_name like :version_name and s.version_type like :version_type\r\n"
            + " and p.email = :email\r\n"
            , nativeQuery = true)
    public List<Integer> getListVersionIdOfStaff(@Param("version_name") String version_name,
            @Param("version_type") String version_type, @Param("email") String email);

}