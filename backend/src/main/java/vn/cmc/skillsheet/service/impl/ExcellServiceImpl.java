package vn.cmc.skillsheet.service.impl;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.cmc.skillsheet.controller.PublicController;
import vn.cmc.skillsheet.entity.Candidate;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import vn.cmc.skillsheet.service.CandidateService;
import vn.cmc.skillsheet.service.ExcellService;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class ExcellServiceImpl implements ExcellService {
    public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    static String[] HEADERs = { "Id", "Title", "Description", "Published" };
    static String SHEET = "CV_PULL";

    public  static HashMap<String,String> cvLinks = new HashMap<>();

    @Autowired
    CandidateService candidateService;

        public static boolean hasExcelFormat(MultipartFile file) {

            if (!TYPE.equals(file.getContentType())) {
                return false;
            }

            return true;
        }

        public  List<Candidate> excelToCvPulls(InputStream is) {
            try {
                Workbook workbook = new XSSFWorkbook(is);

                Sheet sheet = workbook.getSheet(SHEET);
                Iterator<Row> rows = sheet.iterator();

                List<Candidate> candidates = new ArrayList<Candidate>();

                int rowNumber = 0;
                while (rows.hasNext()) {
                    Row currentRow = rows.next();

                    // skip header
                    if (rowNumber == 0) {
                        rowNumber++;
                        continue;
                    }

                    Iterator<Cell> cellsInRow = currentRow.iterator();

                    Candidate candidate = new Candidate();
                    String cvFileName = "";
                    int cellIdx = 0;
                    while (cellsInRow.hasNext()) {
                        Cell currentCell = cellsInRow.next();

                        switch (cellIdx) {
                            case 0:
                                candidate.setFullName(currentCell.getStringCellValue());
                                break;

                            case 1:
                                candidate.setEmail(currentCell.getStringCellValue());
                                break;

                            case 2:
                                candidate.setPhone(currentCell.getStringCellValue());
                                break;

                            case 3:
                                candidate.setSex(currentCell.getStringCellValue());
                                break;

                            case 4:
                                candidate.setAddress(currentCell.getStringCellValue());
                                break;

                            case 5:
                                candidate.setBirthDay(currentCell.getDateCellValue());
                                break;

                            case 6:
                                candidate.setExperience(currentCell.getStringCellValue());
                                break;

                            case 7:
                                candidate.setIntroducer(currentCell.getStringCellValue());
                                break;

                            case 8:
                                candidate.setSchool(currentCell.getStringCellValue());
                                break;

                            case 9:
                                candidate.setDegree(currentCell.getStringCellValue());
                                break;
                            case 10:
                                candidate.setApplySince(currentCell.getDateCellValue());
                                break;
                            case 11:
                                candidate.setLevel(currentCell.getStringCellValue());
                                break;
                            case 12:
                                candidate.setSkill(currentCell.getStringCellValue());
                                break;
                            case 13:
                                candidate.setJob(currentCell.getStringCellValue());
                                break;
                            case 14:
                                candidate.setRoleName(currentCell.getStringCellValue());
                                break;
                            case 15:
                                candidate.setLanguage(currentCell.getStringCellValue());
                                break;
                            case 16:
                                candidate.setLocation(currentCell.getStringCellValue());
                                break;
                            case 17:
                                candidate.setChannel((int)currentCell.getNumericCellValue());
                                break;
                            case 18:
                                cvFileName = currentCell.getStringCellValue();
                                candidate.setLinkCv(PublicController.cacheFileInfo.get(cvFileName));
                                break;
                            case 19:
                                candidate.setSource(currentCell.getStringCellValue());
                                break;
                            case 20:
                                candidate.setLastCompany(currentCell.getStringCellValue());
                                break;
                            case 21:
                                candidate.setCandidateType(currentCell.getStringCellValue());
                                break;

                            default:
                                break;
                        }

                        cellIdx++;
                    }
                    if(!candidateService.checkCandidateExits(candidate)){
                        candidate.setStatus("New");
                        candidate.setStepRts("none");
                        candidate.setCreatedDate(new Date());
                        candidate.setSendDate(new Date());
                        candidate.setRemoveJobRtsIds(new JSONArray("[]").toString());
                        candidates.add(candidate);
                    }
                }

                workbook.close();

                return candidates;
            } catch (IOException e) {
                throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
            }
        }

    @Override
    public List<Candidate> excelToCvPull(InputStream is, String requestId, String stepRts) {
        try {
            Workbook workbook = new XSSFWorkbook(is);

            Sheet sheet = workbook.getSheet(SHEET);
            Iterator<Row> rows = sheet.iterator();

            List<Candidate> candidates = new ArrayList<Candidate>();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();

                // skip header
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                Iterator<Cell> cellsInRow = currentRow.iterator();

                Candidate candidate = new Candidate();
                String cvFileName = "";
                int cellIdx = 0;
                while (cellsInRow.hasNext()) {
                    Cell currentCell = cellsInRow.next();

                    switch (cellIdx) {
                        case 0:
                            candidate.setFullName(currentCell.getStringCellValue());
                            break;

                        case 1:
                            candidate.setEmail(currentCell.getStringCellValue());
                            break;

                        case 2:
                            candidate.setPhone(currentCell.getStringCellValue());
                            break;

                        case 3:
                            candidate.setSex(currentCell.getStringCellValue());
                            break;

                        case 4:
                            candidate.setAddress(currentCell.getStringCellValue());
                            break;

                        case 5:
                            candidate.setBirthDay(currentCell.getDateCellValue());
                            break;

                        case 6:
                            candidate.setExperience(currentCell.getStringCellValue());
                            break;

                        case 7:
                            candidate.setIntroducer(currentCell.getStringCellValue());
                            break;

                        case 8:
                            candidate.setSchool(currentCell.getStringCellValue());
                            break;

                        case 9:
                            candidate.setDegree(currentCell.getStringCellValue());
                            break;
                        case 10:
                            candidate.setApplySince(currentCell.getDateCellValue());
                            break;
                        case 11:
                            candidate.setLevel(currentCell.getStringCellValue());
                            break;
                        case 12:
                            candidate.setSkill(currentCell.getStringCellValue());
                            break;
                        case 13:
                            candidate.setJob(currentCell.getStringCellValue());
                            break;
                        case 14:
                            candidate.setRoleName(currentCell.getStringCellValue());
                            break;
                        case 15:
                            candidate.setLanguage(currentCell.getStringCellValue());
                            break;
                        case 16:
                            candidate.setLocation(currentCell.getStringCellValue());
                            break;
                        case 17:
                            candidate.setChannel((int)currentCell.getNumericCellValue());
                            break;
                        case 18:
                            cvFileName = currentCell.getStringCellValue();
                            candidate.setLinkCv(PublicController.cacheFileInfo.get(cvFileName));
                            break;
                        case 19:
                            candidate.setSource(currentCell.getStringCellValue());
                            break;
                        case 20:
                            candidate.setLastCompany(currentCell.getStringCellValue());
                            break;
                        case 21:
                            candidate.setCandidateType(currentCell.getStringCellValue());
                            break;

                        default:
                            break;
                    }

                    cellIdx++;
                }
                if(!candidateService.checkCandidateExits(candidate)){
                    candidate.setStepRts(stepRts);
                    candidate.setJobRtsId(requestId);
                    candidate.setStatus("New");
                    candidate.setCreatedDate(new Date());
                    candidate.setSendDate(new Date());
                    candidate.setRemoveJobRtsIds(new JSONArray("[]").toString());
                    candidates.add(candidate);
                }
            }

            workbook.close();

            return candidates;
        } catch (IOException e) {
            throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
        }
    }
}
