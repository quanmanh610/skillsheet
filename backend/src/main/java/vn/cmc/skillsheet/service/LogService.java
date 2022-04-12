package vn.cmc.skillsheet.service;

import java.util.Date;

import vn.cmc.skillsheet.dto.LogDto;

public interface LogService {

    public LogDto getListOfLogPagination(int page, int size, String column, String sort,
            String editor, String tableName, Date from, Date to);

}
