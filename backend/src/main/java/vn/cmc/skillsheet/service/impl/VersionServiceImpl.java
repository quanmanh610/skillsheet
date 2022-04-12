package vn.cmc.skillsheet.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import vn.cmc.skillsheet.dto.VersionDto;
import vn.cmc.skillsheet.entity.Version;
import vn.cmc.skillsheet.repository.VersionRepository;
import vn.cmc.skillsheet.service.VersionService;

@Service
public class VersionServiceImpl implements VersionService {

    @Autowired
    private VersionRepository versionRepository;

    @Override
    public VersionDto getListOfVersionPagination(int page, int size, String column, String sort,
            String versionName, String versionType, String staffEmail) {
        VersionDto versionDto = new VersionDto();
        String sortColumn = "version_id";
        if ("versionName".equals(column))
            sortColumn = "version_name";
        else if ("versionType".equals(column))
            sortColumn = "version_type";
        else if ("createdDate".equals(column))
            sortColumn = "created_date";
        else if ("updatedDate".equals(column))
            sortColumn = "updated_date";
        else if ("originalVersion".equals(column))
            sortColumn = "original_version";

        String sortDirec = "ASC";
        if ("DES".equals(sort))
            sortDirec = "DESC";

        PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by(
                "ASC".equals(sortDirec) ? Sort.Direction.ASC : Sort.Direction.DESC, sortColumn));

        Page<Version> pageCandidate = null;

        if (null == staffEmail || "".equals(staffEmail)) {
            pageCandidate = versionRepository.findAllVersionPegeable("%" + versionName + "%",
                    "%" + versionType + "%", pageRequest);
        } else {
            pageCandidate = versionRepository.findVersionPegeable("%" + versionName + "%",
                    "%" + versionType + "%", staffEmail, pageRequest);
        }
        
        List<Version> listVersion = pageCandidate.getContent();

        versionDto.setVersionList(listVersion);

        versionDto.setTotalElements(pageCandidate.getTotalElements());

        return versionDto;

    }
    
    @Override
    public List<Integer> getListVersionIdOfStaff(String versionName, String versionType,
            String staffEmail) {
        return versionRepository.getListVersionIdOfStaff("%" + versionName + "%",
                "%" + versionType + "%", staffEmail);
    }

}
