package vn.cmc.skillsheet.repository;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.ChangeHistory;

@Repository
public interface ChangeHistoryRepository extends JpaRepository<ChangeHistory, Integer> {

    @Query(value = "select * from change_history c where c.change_history_id = :change_history_id", nativeQuery = true)
    public Candidate findOneById(@Param("change_history_id") int change_history_id);

//    public Page<ChangeHistory> findByEditorLikeAndTableLikeAndCreatedDateAfterAndCreatedDateBefore(
//            String editor, String table, Date from, Date to, Pageable pageable);

    @Query(value = "select * from change_history c where (c.editor like :editor && c.ch_table like :table && c.time >= :from && c.time <= :to)", nativeQuery = true)
    public Page<ChangeHistory> searchInLogs(@Param("editor") String editor, @Param("table") String table, @Param("from") Date from, @Param("to") Date to, Pageable pageable);
}
