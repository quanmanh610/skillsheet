package vn.cmc.skillsheet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.cmc.skillsheet.entity.Channel;
import vn.cmc.skillsheet.entity.Email;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Integer> {

    @Query(value = "select * from channel c where c.id = :id", nativeQuery = true)
    public Email findOneById(@Param("id") int id);

}