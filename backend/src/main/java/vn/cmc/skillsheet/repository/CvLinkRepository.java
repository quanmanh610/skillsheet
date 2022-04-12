package vn.cmc.skillsheet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.cmc.skillsheet.entity.Channel;
import vn.cmc.skillsheet.entity.CvLink;
import vn.cmc.skillsheet.entity.Email;

@Repository
public interface CvLinkRepository extends JpaRepository<CvLink, String> {


}