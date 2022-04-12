package vn.cmc.skillsheet.service;

import java.util.List;

import vn.cmc.skillsheet.dto.VersionDto;

public interface VersionService {

    public VersionDto getListOfVersionPagination(int page, int size, String column, String sort,
            String versionName, String versionType, String staffEmail);
    
    public List<Integer> getListVersionIdOfStaff(String versionName, String versionType, String staffEmail);

}
