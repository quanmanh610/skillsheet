package vn.cmc.skillsheet.service;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.TemplateProfile;

public interface DowloadProfileService {

    public TemplateProfile storeFile(MultipartFile file, String createBy);

    public TemplateProfile getFile(int fileId);

    public TemplateProfile writeProfileToWord(TemplateProfile templateProfile,
            Optional<Profile> profile, ArrayList<String> introList,
            ArrayList<String> introContentList, ArrayList<String> summaryList) throws Exception;

}
