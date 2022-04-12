package vn.cmc.skillsheet.service;

import vn.cmc.skillsheet.entity.Candidate;

import java.io.InputStream;
import java.util.List;

public interface ExcellService {

    List<Candidate> excelToCvPulls(InputStream is);

    List<Candidate> excelToCvPull(InputStream is , String requestId , String stepRts);
}
