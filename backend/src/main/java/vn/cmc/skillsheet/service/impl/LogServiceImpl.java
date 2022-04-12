package vn.cmc.skillsheet.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import vn.cmc.skillsheet.constant.UrlConst;
import vn.cmc.skillsheet.dto.CandidateDto;
import vn.cmc.skillsheet.dto.LogDto;
import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.ChangeHistory;
import vn.cmc.skillsheet.logic.CandidateLogic;
import vn.cmc.skillsheet.logic.EncryptDecryptLogic;
import vn.cmc.skillsheet.repository.CandidateRepository;
import vn.cmc.skillsheet.repository.ChangeHistoryRepository;
import vn.cmc.skillsheet.service.CandidateService;
import vn.cmc.skillsheet.service.LogService;

/**
 * @author NDDUC
 *
 */
@Service
public class LogServiceImpl implements LogService {

    @Autowired
    private ChangeHistoryRepository changeHistoryRepository;

    @Override
    public LogDto getListOfLogPagination(int page, int size, String column, String sort,
            String editor, String tableName, Date from, Date to) {

        LogDto outDto = new LogDto();

        String sortColumn = "change_history_id";
         if ("editor".equals(column))
         sortColumn = "editor";
         else if ("action".equals(column))
         sortColumn = "action";
         else if ("time".equals(column))
         sortColumn = "time";
         else if ("table".equals(column))
         sortColumn = "table";
         else if ("field".equals(column))
         sortColumn = "field";

        String sortDirec = "DESC";
        if ("ASC".equals(sort))
            sortDirec = "ASC";

        PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by(
                "DESC".equals(sortDirec) ? Sort.Direction.DESC : Sort.Direction.ASC, sortColumn));
//        Page<ChangeHistory> pageCandidate = changeHistoryRepository.findByEditorLikeAndTableLikeAndCreatedDateAfterAndCreatedDateBefore(
//                "%" + editor + "%", "%" + tableName + "%", from, to, pageRequest);
        
        Page<ChangeHistory> pageCandidate = changeHistoryRepository.searchInLogs(
                "%" + editor + "%", "%" + tableName + "%", from, to, pageRequest);

        List<ChangeHistory> changeHistories = null;
        changeHistories = pageCandidate.getContent();

        outDto.setChangeHistories(changeHistories);
        outDto.setTotalElements(pageCandidate.getTotalElements());

        return outDto;
    }

}
