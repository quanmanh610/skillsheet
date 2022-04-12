package vn.cmc.skillsheet.service.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.apache.poi.util.Units;
import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTable.XWPFBorderType;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.json.JSONArray;
import org.openxmlformats.schemas.drawingml.x2006.main.CTGraphicalObject;
import org.openxmlformats.schemas.drawingml.x2006.wordprocessingDrawing.CTAnchor;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTDrawing;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTHMerge;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTTcPr;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STMerge;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSON;

import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.TemplateProfile;
import vn.cmc.skillsheet.entity.WorkExperience;
import vn.cmc.skillsheet.exception.FileStorageException;
import vn.cmc.skillsheet.repository.TemplateProfileRepository;
import vn.cmc.skillsheet.service.DowloadProfileService;
import vn.cmc.skillsheet.vo.ProjectSkill;


public class DowloadProfileServiceImpl implements DowloadProfileService {

    @Autowired
    protected TemplateProfileRepository templateProfileRepository;

    @Override
    public TemplateProfile storeFile(MultipartFile file, String createBy) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            if (fileName.contains("..")) {
                throw new FileStorageException(
                        "Sorry! Filename contains invalid path sequence " + fileName);
            }

            TemplateProfile templateProfile = new TemplateProfile(fileName, file.getContentType(),
                    file.getBytes());
            templateProfile.setCreatedDate(new Date());
            templateProfile.setEditor(createBy);

            return templateProfileRepository.save(templateProfile);
        } catch (IOException ex) {
            throw new FileStorageException(
                    "Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    @Override
    public TemplateProfile getFile(int fileId) {
        Optional<TemplateProfile> result = templateProfileRepository.findById(fileId);
    	if (!result.isPresent()) {
    		throw new IllegalArgumentException("Cannot find template profile: " + fileId);
    	}
    	else {
    		return result.get();
    	}
    }

    @SuppressWarnings("resource")
    @Override
    public TemplateProfile writeProfileToWord(TemplateProfile templateProfile,
            Optional<Profile> profile, ArrayList<String> introList,
            ArrayList<String> introContentList, ArrayList<String> summaryList) throws Exception {

        XWPFDocument doc = null;
        if (null != templateProfile) {
            doc = new XWPFDocument(new ByteArrayInputStream(templateProfile.getFile()));
        } else {
            doc = new XWPFDocument();
        }

        // #### CURRICULUM_VITAE #### START
        XWPFParagraph CURRICULUM_VITAE = doc.createParagraph();
        CURRICULUM_VITAE.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun CURRICULUM_VITAE_RUN = CURRICULUM_VITAE.createRun();
        CURRICULUM_VITAE_RUN.setBold(true);
        CURRICULUM_VITAE_RUN.setText("CURRICULUM VITAE");
        CURRICULUM_VITAE_RUN.setFontFamily("Tahoma");
        CURRICULUM_VITAE_RUN.setFontSize(16);
        CURRICULUM_VITAE_RUN.setTextPosition(100);
        // #### CURRICULUM_VITAE #### END

        // #### PERSONAL_DETAILS #### START
        XWPFParagraph PERSONAL_DETAILS = doc.createParagraph();
        PERSONAL_DETAILS.setAlignment(ParagraphAlignment.LEFT);
        XWPFRun PERSONAL_DETAILS_RUN = PERSONAL_DETAILS.createRun();
        PERSONAL_DETAILS_RUN.setText("PERSONAL DETAILS");
        PERSONAL_DETAILS_RUN.setBold(true);
        PERSONAL_DETAILS_RUN.setFontFamily("Tahoma");
        PERSONAL_DETAILS_RUN.setFontSize(10);
        PERSONAL_DETAILS_RUN.addBreak();

        XWPFTable PERSONAL_DETAILS_TABLE = doc.createTable(1, 3);
        PERSONAL_DETAILS_TABLE.setWidth("100%");

        PERSONAL_DETAILS_TABLE.setInsideHBorder(XWPFBorderType.NONE, 4, 0, "EBE4EC");
        PERSONAL_DETAILS_TABLE.setInsideVBorder(XWPFBorderType.NONE, 4, 0, "EBE4EC");
        PERSONAL_DETAILS_TABLE.setTopBorder(XWPFBorderType.NONE, 4, 0, "EBE4EC");
        PERSONAL_DETAILS_TABLE.setBottomBorder(XWPFBorderType.NONE, 4, 0, "EBE4EC");
        PERSONAL_DETAILS_TABLE.setLeftBorder(XWPFBorderType.NONE, 4, 0, "EBE4EC");
        PERSONAL_DETAILS_TABLE.setRightBorder(XWPFBorderType.NONE, 4, 0, "EBE4EC");

        XWPFParagraph PERSONAL_DETAILS_TABLE_P1 = PERSONAL_DETAILS_TABLE.getRow(0).getCell(0)
                .getParagraphs().get(0);
        XWPFRun PERSONAL_DETAILS_TABLE_P1_RUN = PERSONAL_DETAILS_TABLE_P1.createRun();
        PERSONAL_DETAILS_TABLE_P1_RUN.setText(introList.get(0));
        PERSONAL_DETAILS_TABLE_P1_RUN.addBreak();
        PERSONAL_DETAILS_TABLE_P1_RUN.setText(introList.get(1));
        PERSONAL_DETAILS_TABLE_P1_RUN.addBreak();
        PERSONAL_DETAILS_TABLE_P1_RUN.setText(introList.get(2));
        PERSONAL_DETAILS_TABLE_P1_RUN.addBreak();
        PERSONAL_DETAILS_TABLE_P1_RUN.setText(introList.get(3));
        PERSONAL_DETAILS_TABLE_P1_RUN.addBreak();
        PERSONAL_DETAILS_TABLE_P1_RUN.setText(introList.get(4));
        PERSONAL_DETAILS_TABLE_P1_RUN.setFontSize(10);
        PERSONAL_DETAILS_TABLE_P1_RUN.setFontFamily("Tahoma");

        XWPFParagraph PERSONAL_DETAILS_TABLE_P2 = PERSONAL_DETAILS_TABLE.getRow(0).getCell(1)
                .getParagraphs().get(0);
        XWPFRun PERSONAL_DETAILS_TABLE_P2_RUN = PERSONAL_DETAILS_TABLE_P2.createRun();
        PERSONAL_DETAILS_TABLE_P2_RUN.setText(introContentList.get(0));
        PERSONAL_DETAILS_TABLE_P2_RUN.addBreak();
        PERSONAL_DETAILS_TABLE_P2_RUN.setBold(true);
        PERSONAL_DETAILS_TABLE_P2_RUN.setFontSize(10);
        PERSONAL_DETAILS_TABLE_P2_RUN.setFontFamily("Tahoma");

        XWPFParagraph PERSONAL_DETAILS_TABLE_P3 = PERSONAL_DETAILS_TABLE.getRow(0).getCell(1)
                .getParagraphs().get(0);
        XWPFRun PERSONAL_DETAILS_TABLE_P3_RUN = PERSONAL_DETAILS_TABLE_P3.createRun();
        PERSONAL_DETAILS_TABLE_P3_RUN.setText(introContentList.get(1));
        PERSONAL_DETAILS_TABLE_P3_RUN.addBreak();
        PERSONAL_DETAILS_TABLE_P3_RUN.setText(introContentList.get(2));
        PERSONAL_DETAILS_TABLE_P3_RUN.addBreak();
        PERSONAL_DETAILS_TABLE_P3_RUN.setText(introContentList.get(3));
        PERSONAL_DETAILS_TABLE_P3_RUN.addBreak();
        PERSONAL_DETAILS_TABLE_P3_RUN.setText(introContentList.get(4));
        PERSONAL_DETAILS_TABLE_P3_RUN.setFontSize(10);
        PERSONAL_DETAILS_TABLE_P3_RUN.setFontFamily("Tahoma");

        XWPFParagraph par = PERSONAL_DETAILS_TABLE.getRow(0).getCell(2).getParagraphs().get(0);
        par.setAlignment(ParagraphAlignment.LEFT);
        par.setSpacingBefore(10);
        XWPFRun run = par.createRun();
        run.addPicture(new ByteArrayInputStream(profile.get().getAvatar()),
                XWPFDocument.PICTURE_TYPE_JPEG, "avatar.JPG", Units.toEMU(70), Units.toEMU(70));

        CTDrawing drawing = run.getCTR().getDrawingArray(0);
        CTGraphicalObject graphicalobject = drawing.getInlineArray(0).getGraphic();
        CTAnchor anchor = getAnchorWithGraphic(graphicalobject, "avatar.JPG", Units.toEMU(70),
                Units.toEMU(70), Units.toEMU(100), Units.toEMU(0));
        drawing.setAnchorArray(new CTAnchor[] { anchor });
        drawing.removeInline(0);

        // #### PERSONAL_DETAILS #### START

        // #### BREAK #### START
        XWPFParagraph BREAK = doc.createParagraph();
        XWPFRun BREAK_RUN = BREAK.createRun();
        BREAK_RUN.addBreak();
        // #### BREAK #### END

        // #### OBJECTIVE #### START
        XWPFParagraph OBJECTIVE_TABLE_P1 = doc.createParagraph();
        setParagraphShading(OBJECTIVE_TABLE_P1, "EBE4EC");
        OBJECTIVE_TABLE_P1.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun OBJECTIVE_TABLE_P1_RUN = OBJECTIVE_TABLE_P1.createRun();
        OBJECTIVE_TABLE_P1_RUN.setText("OBJECTIVE");
        OBJECTIVE_TABLE_P1_RUN.setBold(true);
        OBJECTIVE_TABLE_P1_RUN.setFontFamily("Tahoma");
        OBJECTIVE_TABLE_P1_RUN.setFontSize(12);

        // #### BREAK #### START
        XWPFParagraph BREAK1 = doc.createParagraph();
        XWPFRun BREAK_RUN1 = BREAK1.createRun();
        BREAK_RUN1.addBreak();
        // #### BREAK #### END

        XWPFParagraph OBJECTIVE_TABLE_P2 = doc.createParagraph();
        OBJECTIVE_TABLE_P2.setAlignment(ParagraphAlignment.BOTH);
        XWPFRun OBJECTIVE_TABLE_P2_RUN = OBJECTIVE_TABLE_P2.createRun();
        OBJECTIVE_TABLE_P2_RUN.setText(profile.get().getObjective());
        OBJECTIVE_TABLE_P2_RUN.setFontFamily("Tahoma");
        OBJECTIVE_TABLE_P2_RUN.setFontSize(10);
        // #### OBJECTIVE #### END

        // #### BREAK #### START
        XWPFParagraph BREAK2 = doc.createParagraph();
        XWPFRun BREAK_RUN2 = BREAK2.createRun();
        BREAK_RUN2.addBreak();
        // #### BREAK #### END

        // #### PROFESSIONAL_SUMMARY #### START
        XWPFParagraph PROFESSIONAL_SUMMARY_TABLE_P1 = doc.createParagraph();
        PROFESSIONAL_SUMMARY_TABLE_P1.setAlignment(ParagraphAlignment.CENTER);
        setParagraphShading(PROFESSIONAL_SUMMARY_TABLE_P1, "EBE4EC");
        XWPFRun PROFESSIONAL_SUMMARY_TABLE_P1_RUN = PROFESSIONAL_SUMMARY_TABLE_P1.createRun();
        PROFESSIONAL_SUMMARY_TABLE_P1_RUN.setText("PROFESSIONAL SUMMARY");
        PROFESSIONAL_SUMMARY_TABLE_P1_RUN.setBold(true);
        PROFESSIONAL_SUMMARY_TABLE_P1_RUN.setFontFamily("Tahoma");
        PROFESSIONAL_SUMMARY_TABLE_P1_RUN.setFontSize(12);

        // #### BREAK #### START
        XWPFParagraph BREAK3 = doc.createParagraph();
        XWPFRun BREAK_RUN3 = BREAK3.createRun();
        BREAK_RUN3.addBreak();
        // #### BREAK #### END

        XWPFParagraph PROFESSIONAL_SUMMARY_TABLE_P2 = doc.createParagraph();
        PROFESSIONAL_SUMMARY_TABLE_P2.setAlignment(ParagraphAlignment.LEFT);
        XWPFRun PROFESSIONAL_SUMMARY_TABLE_P2_RUN = PROFESSIONAL_SUMMARY_TABLE_P2.createRun();
        for (int i = 1; i < summaryList.size(); i++) {
            PROFESSIONAL_SUMMARY_TABLE_P2_RUN
                    .setText("• " + summaryList.get(i).replaceAll("<li>", ""));
            PROFESSIONAL_SUMMARY_TABLE_P2_RUN.addBreak();
            PROFESSIONAL_SUMMARY_TABLE_P2_RUN.setFontFamily("Tahoma");
            PROFESSIONAL_SUMMARY_TABLE_P2_RUN.setFontSize(10);
        }

        // #### PROFESSIONAL_SUMMARY #### END

        // #### BREAK #### START
        XWPFParagraph BREAK4 = doc.createParagraph();
        XWPFRun BREAK_RUN4 = BREAK4.createRun();
        BREAK_RUN4.addBreak();
        // #### BREAK #### END

        // #### PROFESSIONAL_INTERESTING #### START
        XWPFParagraph PROFESSIONAL_INTERESTING_P = doc.createParagraph();
        setParagraphShading(PROFESSIONAL_INTERESTING_P, "EBE4EC");
        PROFESSIONAL_INTERESTING_P.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun PROFESSIONAL_INTERESTING_P_RUN = PROFESSIONAL_INTERESTING_P.createRun();
        PROFESSIONAL_INTERESTING_P_RUN.setText("PERSONAL INTERESTING");
        PROFESSIONAL_INTERESTING_P_RUN.setBold(true);
        PROFESSIONAL_INTERESTING_P_RUN.setFontFamily("Tahoma");
        PROFESSIONAL_INTERESTING_P_RUN.setFontSize(12);

        // #### BREAK #### START
        XWPFParagraph BREAK5 = doc.createParagraph();
        XWPFRun BREAK_RUN5 = BREAK5.createRun();
        BREAK_RUN5.addBreak();
        // #### BREAK #### END

        XWPFParagraph PROFESSIONAL_INTERESTING_TABLE_P2 = doc.createParagraph();
        ;
        PROFESSIONAL_INTERESTING_TABLE_P2.setAlignment(ParagraphAlignment.BOTH);
        XWPFRun PROFESSIONAL_INTERESTING_TABLE_P2_RUN = PROFESSIONAL_INTERESTING_TABLE_P2
                .createRun();
        PROFESSIONAL_INTERESTING_TABLE_P2_RUN.setText(profile.get().getPersionalInteresting());
        PROFESSIONAL_INTERESTING_TABLE_P2_RUN.setFontFamily("Tahoma");
        PROFESSIONAL_INTERESTING_TABLE_P2_RUN.setFontSize(10);
        // #### PROFESSIONAL_INTERESTING #### END

        // #### BREAK #### START
        XWPFParagraph BREAK6 = doc.createParagraph();
        XWPFRun BREAK_RUN6 = BREAK6.createRun();
        BREAK_RUN6.addBreak();
        // #### BREAK #### END

        // #### EDUCATIONS #### START
        XWPFParagraph EDUCATIONS_P = doc.createParagraph();
        setParagraphShading(EDUCATIONS_P, "EBE4EC");
        EDUCATIONS_P.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun EDUCATIONS_P_RUN = EDUCATIONS_P.createRun();
        EDUCATIONS_P_RUN.setText("EDUCATIONS");
        EDUCATIONS_P_RUN.setBold(true);
        EDUCATIONS_P_RUN.setFontFamily("Tahoma");
        EDUCATIONS_P_RUN.setFontSize(12);

        // #### BREAK #### START
        XWPFParagraph BREAK7 = doc.createParagraph();
        XWPFRun BREAK_RUN7 = BREAK7.createRun();
        BREAK_RUN7.addBreak();
        // #### BREAK #### END

        XWPFTable EDUCATIONS_T = doc.createTable(profile.get().getEducations().size(), 2);
        EDUCATIONS_T.setWidth("100%");

        EDUCATIONS_T.setInsideHBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        EDUCATIONS_T.setInsideVBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        EDUCATIONS_T.setTopBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        EDUCATIONS_T.setBottomBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        EDUCATIONS_T.setLeftBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        EDUCATIONS_T.setRightBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        List<XWPFTableRow> EDUCATIONS_T_LIST_ROW = EDUCATIONS_T.getRows();

        for (int i = 0; i < EDUCATIONS_T_LIST_ROW.size(); i++) {

            XWPFParagraph EDUCATIONS_T_P = EDUCATIONS_T_LIST_ROW.get(i).getCell(0).getParagraphs()
                    .get(0);
            EDUCATIONS_T_P.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun EDUCATIONS_T_P_RUN = EDUCATIONS_T_P.createRun();
            EDUCATIONS_T_P_RUN
                    .setText("From: " + profile.get().getEducations().get(i).getFromMonth());
            EDUCATIONS_T_P_RUN.addBreak();
            EDUCATIONS_T_P_RUN.setText("To: " + profile.get().getEducations().get(i).getToMonth());
            EDUCATIONS_T_P_RUN.setFontFamily("Arial");
            EDUCATIONS_T_P_RUN.setFontSize(10);

            XWPFParagraph EDUCATIONS_T_P_2 = EDUCATIONS_T_LIST_ROW.get(i).getCell(1).getParagraphs()
                    .get(0);
            EDUCATIONS_T_P_2.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun EDUCATIONS_T_P_2_RUN = EDUCATIONS_T_P_2.createRun();
            EDUCATIONS_T_P_2_RUN
                    .setText(profile.get().getEducations().get(i).getSchool().getName());
            EDUCATIONS_T_P_2_RUN.addBreak();
            EDUCATIONS_T_P_2_RUN.setBold(true);
            EDUCATIONS_T_P_2_RUN.setFontFamily("Arial");
            EDUCATIONS_T_P_2_RUN.setFontSize(10);

            XWPFParagraph EDUCATIONS_T_P_3 = EDUCATIONS_T_LIST_ROW.get(i).getCell(1).getParagraphs()
                    .get(0);
            EDUCATIONS_T_P_3.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun EDUCATIONS_T_P_3_RUN = EDUCATIONS_T_P_3.createRun();
            EDUCATIONS_T_P_3_RUN.setText(profile.get().getEducations().get(i).getSubject());
            EDUCATIONS_T_P_3_RUN.addBreak();
            EDUCATIONS_T_P_3_RUN.setItalic(true);
            EDUCATIONS_T_P_3_RUN.setFontFamily("Times New Roman");
            EDUCATIONS_T_P_3_RUN.setFontSize(10);

            XWPFParagraph EDUCATIONS_T_P_4 = EDUCATIONS_T_LIST_ROW.get(i).getCell(1).getParagraphs()
                    .get(0);
            EDUCATIONS_T_P_4.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun EDUCATIONS_T_P_4_RUN = EDUCATIONS_T_P_4.createRun();
            EDUCATIONS_T_P_4_RUN.setText("  • " + profile.get().getEducations().get(i).getGrade());
            EDUCATIONS_T_P_4_RUN.addBreak();
            EDUCATIONS_T_P_4_RUN
                    .setText("  • " + profile.get().getEducations().get(i).getQualification());
            EDUCATIONS_T_P_4_RUN.addBreak();
            EDUCATIONS_T_P_4_RUN
                    .setText("  • " + profile.get().getEducations().get(i).getAchievement());
            EDUCATIONS_T_P_4_RUN.setFontFamily("Arial");
            EDUCATIONS_T_P_4_RUN.setFontSize(10);

        }
        // #### EDUCATIONS #### END

        // #### BREAK #### START
        XWPFParagraph BREAK8 = doc.createParagraph();
        XWPFRun BREAK_RUN8 = BREAK8.createRun();
        BREAK_RUN8.addBreak();
        // #### BREAK #### END

        // #### WORK_EXPERIENCE #### START
        XWPFParagraph WORK_EXPERIENCE_P = doc.createParagraph();
        setParagraphShading(WORK_EXPERIENCE_P, "EBE4EC");
        WORK_EXPERIENCE_P.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun WORK_EXPERIENCE_P_RUN = WORK_EXPERIENCE_P.createRun();
        WORK_EXPERIENCE_P_RUN.setText("WORK EXPERIENCE");
        WORK_EXPERIENCE_P_RUN.setBold(true);
        WORK_EXPERIENCE_P_RUN.setFontFamily("Tahoma");
        WORK_EXPERIENCE_P_RUN.setFontSize(12);

        // #### BREAK #### START
        XWPFParagraph BREAK9 = doc.createParagraph();
        XWPFRun BREAK_RUN9 = BREAK9.createRun();
        BREAK_RUN9.addBreak();
        // #### BREAK #### END

        XWPFTable WORK_EXPERIENCE_T = doc.createTable(profile.get().getWorkExperiences().size(), 2);
        WORK_EXPERIENCE_T.setWidth("100%");

        WORK_EXPERIENCE_T.setInsideHBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        WORK_EXPERIENCE_T.setInsideVBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        WORK_EXPERIENCE_T.setTopBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        WORK_EXPERIENCE_T.setBottomBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        WORK_EXPERIENCE_T.setLeftBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        WORK_EXPERIENCE_T.setRightBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        List<XWPFTableRow> WORK_EXPERIENCE_T_LIST_ROW = WORK_EXPERIENCE_T.getRows();

        for (int i = 0; i < WORK_EXPERIENCE_T_LIST_ROW.size(); i++) {

            XWPFParagraph WORK_EXPERIENCE_T_P = WORK_EXPERIENCE_T_LIST_ROW.get(i).getCell(0)
                    .getParagraphs().get(0);
            WORK_EXPERIENCE_T_P.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun WORK_EXPERIENCE_T_P_RUN = WORK_EXPERIENCE_T_P.createRun();
            WORK_EXPERIENCE_T_P_RUN
                    .setText("From: " + profile.get().getWorkExperiences().get(i).getFromMonth());
            WORK_EXPERIENCE_T_P_RUN.addBreak();
            WORK_EXPERIENCE_T_P_RUN
                    .setText("To: " + profile.get().getWorkExperiences().get(i).getToMonth());
            WORK_EXPERIENCE_T_P_RUN.setFontFamily("Arial");
            WORK_EXPERIENCE_T_P_RUN.setFontSize(10);

            XWPFParagraph WORK_EXPERIENCE_T_P_2 = WORK_EXPERIENCE_T_LIST_ROW.get(i).getCell(1)
                    .getParagraphs().get(0);
            WORK_EXPERIENCE_T_P_2.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun WORK_EXPERIENCE_T_P_2_RUN = WORK_EXPERIENCE_T_P_2.createRun();
            WORK_EXPERIENCE_T_P_2_RUN
                    .setText("Company: " + profile.get().getWorkExperiences().get(i).getCompany());
            WORK_EXPERIENCE_T_P_2_RUN.addBreak();
            WORK_EXPERIENCE_T_P_2_RUN.setBold(true);
            WORK_EXPERIENCE_T_P_2_RUN.setFontFamily("Arial");
            WORK_EXPERIENCE_T_P_2_RUN.setFontSize(10);

            XWPFParagraph WORK_EXPERIENCE_T_P_3 = WORK_EXPERIENCE_T_LIST_ROW.get(i).getCell(1)
                    .getParagraphs().get(0);
            WORK_EXPERIENCE_T_P_3.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun WORK_EXPERIENCE_T_P_3_RUN = WORK_EXPERIENCE_T_P_3.createRun();
            WORK_EXPERIENCE_T_P_3_RUN.setText(
                    "Work as a " + profile.get().getWorkExperiences().get(i).getPosition());
            WORK_EXPERIENCE_T_P_3_RUN.addBreak();
            WORK_EXPERIENCE_T_P_3_RUN.setItalic(true);
            WORK_EXPERIENCE_T_P_3_RUN.setFontFamily("Times New Roman");
            WORK_EXPERIENCE_T_P_3_RUN.setFontSize(10);

            XWPFParagraph WORK_EXPERIENCE_T_P_4 = WORK_EXPERIENCE_T_LIST_ROW.get(i).getCell(1)
                    .getParagraphs().get(0);
            WORK_EXPERIENCE_T_P_4.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun WORK_EXPERIENCE_T_P_4_RUN = WORK_EXPERIENCE_T_P_4.createRun();
            WORK_EXPERIENCE_T_P_4_RUN
                    .setText("  • " + profile.get().getWorkExperiences().get(i).getDescription());
            WORK_EXPERIENCE_T_P_4_RUN.addBreak();
            WORK_EXPERIENCE_T_P_4_RUN.setFontFamily("Arial");
            WORK_EXPERIENCE_T_P_4_RUN.setFontSize(10);

        }
        // #### WORK_EXPERIENCE #### END

        // #### BREAK #### START
        XWPFParagraph BREAK10 = doc.createParagraph();
        XWPFRun BREAK_RUN10 = BREAK10.createRun();
        BREAK_RUN10.addBreak();
        // #### BREAK #### END

        // #### SKILLS #### START
        XWPFParagraph SKILLS_P = doc.createParagraph();
        setParagraphShading(SKILLS_P, "EBE4EC");
        SKILLS_P.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun SKILLS_P_RUN = SKILLS_P.createRun();
        SKILLS_P_RUN.setText("TECHNOLOGY AND SOFTWARE DEVELOPMENT SKILLS");
        SKILLS_P_RUN.setBold(true);
        SKILLS_P_RUN.setFontFamily("Tahoma");
        SKILLS_P_RUN.setFontSize(12);

        // #### BREAK #### START
        XWPFParagraph BREAK11 = doc.createParagraph();
        XWPFRun BREAK_RUN11 = BREAK11.createRun();
        BREAK_RUN11.addBreak();
        // #### BREAK #### END

        XWPFTable SKILLS_T = doc.createTable(profile.get().getProfileSkills().size() + 2, 2);
        SKILLS_T.setWidth("100%");

        mergeCellHorizontally(SKILLS_T, 0, 0, 1);

        SKILLS_T.setInsideHBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        SKILLS_T.setInsideVBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        SKILLS_T.setTopBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        SKILLS_T.setBottomBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        SKILLS_T.setLeftBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        SKILLS_T.setRightBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        List<XWPFTableRow> SKILLS_T_LIST_ROW = SKILLS_T.getRows();

        XWPFParagraph SKILLS_T_P_POINT = SKILLS_T_LIST_ROW.get(0).getCell(0).getParagraphs().get(0);
        SKILLS_T_P_POINT.setAlignment(ParagraphAlignment.LEFT);
        XWPFRun SKILLS_T_P_POINT_RUN = SKILLS_T_P_POINT.createRun();
        SKILLS_T_P_POINT_RUN.setText("Level: ");
        SKILLS_T_P_POINT_RUN.setFontFamily("Arial");
        SKILLS_T_P_POINT_RUN.setFontSize(10);
        SKILLS_T_P_POINT_RUN.setBold(true);

        XWPFParagraph SKILLS_T_P_POINT1 = SKILLS_T_LIST_ROW.get(0).getCell(0).getParagraphs()
                .get(0);
        SKILLS_T_P_POINT1.setAlignment(ParagraphAlignment.LEFT);
        XWPFRun SKILLS_T_P_POINT1_RUN = SKILLS_T_P_POINT1.createRun();
        SKILLS_T_P_POINT1_RUN.setText(
                "1-4 Aware (Basic, need to practice more); 5-7 Knowledgeable (Intermediate, can use it at work); 8-10 Proficient (Advanced, very good to use it at work)");
        SKILLS_T_P_POINT1_RUN.setFontFamily("Arial");
        SKILLS_T_P_POINT1_RUN.setFontSize(10);

        XWPFParagraph SKILLS_T_P_HEAD = SKILLS_T_LIST_ROW.get(1).getCell(0).getParagraphs().get(0);
        SKILLS_T_P_HEAD.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun SKILLS_T_P_HEAD_RUN = SKILLS_T_P_HEAD.createRun();
        SKILLS_T_P_HEAD_RUN.setText("Competencies");
        SKILLS_T_P_HEAD_RUN.setFontFamily("Arial");
        SKILLS_T_P_HEAD_RUN.setFontSize(11);
        SKILLS_T_P_HEAD_RUN.setBold(true);

        XWPFParagraph SKILLS_T_P_HEAD2 = SKILLS_T_LIST_ROW.get(1).getCell(1).getParagraphs().get(0);
        SKILLS_T_P_HEAD2.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun SKILLS_T_P_HEAD2_RUN = SKILLS_T_P_HEAD2.createRun();
        SKILLS_T_P_HEAD2_RUN.setText("Level");
        SKILLS_T_P_HEAD2_RUN.setFontFamily("Arial");
        SKILLS_T_P_HEAD2_RUN.setFontSize(11);
        SKILLS_T_P_HEAD2_RUN.setBold(true);

        for (int i = 2; i < SKILLS_T_LIST_ROW.size(); i++) {

            XWPFParagraph SKILLS_T_P = SKILLS_T_LIST_ROW.get(i).getCell(0).getParagraphs().get(0);
            SKILLS_T_P.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun SKILLS_T_P_RUN = SKILLS_T_P.createRun();
            SKILLS_T_P_RUN
                    .setText(profile.get().getProfileSkills().get(i - 2).getSkill().getName());
            SKILLS_T_P_RUN.addBreak();
            SKILLS_T_P_RUN.setFontFamily("Arial");
            SKILLS_T_P_RUN.setFontSize(10);

            XWPFParagraph SKILLS_T_P_4 = SKILLS_T_LIST_ROW.get(i).getCell(1).getParagraphs().get(0);
            SKILLS_T_P_4.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun SKILLS_T_P_4_RUN = SKILLS_T_P_4.createRun();
            SKILLS_T_P_4_RUN.setText(profile.get().getProfileSkills().get(i - 2).getLevel() + " "
                    + profile.get().getProfileSkills().get(i - 2).getYearOfExperiences()
                    + " years experiences");
            SKILLS_T_P_4_RUN.addBreak();
            SKILLS_T_P_4_RUN.setFontFamily("Arial");
            SKILLS_T_P_4_RUN.setFontSize(10);

        }
        // #### SKILLS #### END

        // #### BREAK #### START
        XWPFParagraph BREAK12 = doc.createParagraph();
        XWPFRun BREAK_RUN12 = BREAK12.createRun();
        BREAK_RUN12.addBreak();
        // #### BREAK #### END

        // #### LANGUAGES #### START
        XWPFParagraph LANGUAGES_P = doc.createParagraph();
        setParagraphShading(LANGUAGES_P, "EBE4EC");
        LANGUAGES_P.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun LANGUAGES_P_RUN = LANGUAGES_P.createRun();
        LANGUAGES_P_RUN.setText("LANGUAGES");
        LANGUAGES_P_RUN.setBold(true);
        LANGUAGES_P_RUN.setFontFamily("Tahoma");
        LANGUAGES_P_RUN.setFontSize(12);

        // #### BREAK #### START
        XWPFParagraph BREAK13 = doc.createParagraph();
        XWPFRun BREAK_RUN13 = BREAK13.createRun();
        BREAK_RUN13.addBreak();
        // #### BREAK #### END

        XWPFTable LANGUAGES_T = doc.createTable(profile.get().getLanguages().size() + 1, 3);
        LANGUAGES_T.setWidth("100%");

        LANGUAGES_T.setInsideHBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        LANGUAGES_T.setInsideVBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        LANGUAGES_T.setTopBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        LANGUAGES_T.setBottomBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        LANGUAGES_T.setLeftBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        LANGUAGES_T.setRightBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
        List<XWPFTableRow> LANGUAGES_T_LIST_ROW = LANGUAGES_T.getRows();

        XWPFParagraph LANGUAGES_T_P_HEAD = LANGUAGES_T_LIST_ROW.get(0).getCell(0).getParagraphs()
                .get(0);
        LANGUAGES_T_P_HEAD.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun LANGUAGES_T_P_HEAD_RUN = LANGUAGES_T_P_HEAD.createRun();
        LANGUAGES_T_P_HEAD_RUN.setText("Language");
        LANGUAGES_T_P_HEAD_RUN.setFontFamily("Arial");
        LANGUAGES_T_P_HEAD_RUN.setFontSize(11);
        LANGUAGES_T_P_HEAD_RUN.setBold(true);

        XWPFParagraph LANGUAGES_T_P_HEAD2 = LANGUAGES_T_LIST_ROW.get(0).getCell(1).getParagraphs()
                .get(0);
        LANGUAGES_T_P_HEAD2.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun LANGUAGES_T_P_HEAD2_RUN = LANGUAGES_T_P_HEAD2.createRun();
        LANGUAGES_T_P_HEAD2_RUN.setText("Level");
        LANGUAGES_T_P_HEAD2_RUN.setFontFamily("Arial");
        LANGUAGES_T_P_HEAD2_RUN.setFontSize(11);
        LANGUAGES_T_P_HEAD2_RUN.setBold(true);

        XWPFParagraph LANGUAGES_T_P_HEAD3 = LANGUAGES_T_LIST_ROW.get(0).getCell(2).getParagraphs()
                .get(0);
        LANGUAGES_T_P_HEAD3.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun LANGUAGES_T_P_HEAD3_RUN = LANGUAGES_T_P_HEAD3.createRun();
        LANGUAGES_T_P_HEAD3_RUN.setText("Note");
        LANGUAGES_T_P_HEAD3_RUN.setFontFamily("Arial");
        LANGUAGES_T_P_HEAD3_RUN.setFontSize(11);
        LANGUAGES_T_P_HEAD3_RUN.setBold(true);

        for (int i = 1; i < LANGUAGES_T_LIST_ROW.size(); i++) {

            XWPFParagraph LANGUAGES_T_P = LANGUAGES_T_LIST_ROW.get(i).getCell(0).getParagraphs()
                    .get(0);
            LANGUAGES_T_P.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun LANGUAGES_T_P_RUN = LANGUAGES_T_P.createRun();
            LANGUAGES_T_P_RUN.setText(profile.get().getLanguages().get(i - 1).getName());
            LANGUAGES_T_P_RUN.addBreak();
            LANGUAGES_T_P_RUN.setFontFamily("Arial");
            LANGUAGES_T_P_RUN.setFontSize(10);

            XWPFParagraph LANGUAGES_T_P_2 = LANGUAGES_T_LIST_ROW.get(i).getCell(1).getParagraphs()
                    .get(0);
            LANGUAGES_T_P_2.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun LANGUAGES_T_P_2_RUN = LANGUAGES_T_P_2.createRun();
            LANGUAGES_T_P_2_RUN.setText(profile.get().getLanguages().get(i - 1).getLevel());
            LANGUAGES_T_P_2_RUN.addBreak();
            LANGUAGES_T_P_2_RUN.setFontFamily("Arial");
            LANGUAGES_T_P_2_RUN.setFontSize(10);

            XWPFParagraph LANGUAGES_T_P_3 = LANGUAGES_T_LIST_ROW.get(i).getCell(2).getParagraphs()
                    .get(0);
            LANGUAGES_T_P_3.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun LANGUAGES_T_P_3_RUN = LANGUAGES_T_P_3.createRun();
            LANGUAGES_T_P_3_RUN.setText(profile.get().getLanguages().get(i - 1).getNote());
            LANGUAGES_T_P_3_RUN.addBreak();
            LANGUAGES_T_P_3_RUN.setFontFamily("Arial");
            LANGUAGES_T_P_3_RUN.setFontSize(10);

        }
        // #### LANGUAGES #### END

        // #### BREAK #### START
        XWPFParagraph BREAK14 = doc.createParagraph();
        XWPFRun BREAK_RUN14 = BREAK14.createRun();
        BREAK_RUN14.addBreak();
        // #### BREAK #### END

        // #### PROJECT_LIST #### START
        XWPFParagraph PROJECT_LIST_P = doc.createParagraph();
        setParagraphShading(PROJECT_LIST_P, "EBE4EC");
        PROJECT_LIST_P.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun PROJECT_LIST_P_RUN = PROJECT_LIST_P.createRun();
        PROJECT_LIST_P_RUN.setText("PROJECT LIST");
        PROJECT_LIST_P_RUN.setBold(true);
        PROJECT_LIST_P_RUN.setFontFamily("Tahoma");
        PROJECT_LIST_P_RUN.setFontSize(12);

        // // #### BREAK #### START
        // XWPFParagraph BREAK15 = doc.createParagraph();
        // XWPFRun BREAK_RUN15 = BREAK15.createRun();
        // BREAK_RUN15.addBreak();
        // // #### BREAK #### END

        for (int j = 0; j < profile.get().getProjects().size(); j++) {

            JSONArray arraySkills = new JSONArray(
                    profile.get().getProjects().get(j).getArraySkillNames());

            List<ProjectSkill> projectSkillList = new ArrayList<>();

            for (int k = 0; k < arraySkills.length(); k++) {
                Object obj = arraySkills.get(k);
                ProjectSkill pS = JSON.parseObject(obj.toString(), ProjectSkill.class);
                projectSkillList.add(pS);
            }

            // #### BREAK #### START
            XWPFParagraph BREAK16 = doc.createParagraph();
            XWPFRun BREAK_RUN16 = BREAK16.createRun();
            BREAK_RUN16.addBreak();
            // #### BREAK #### END
            XWPFParagraph PROJECT_NAME_P = doc.createParagraph();
            PROJECT_NAME_P.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun PROJECT_NAME_P_RUN = PROJECT_NAME_P.createRun();
            PROJECT_NAME_P_RUN.setText(profile.get().getProjects().get(j).getTitle() + " ( "
                    + profile.get().getProjects().get(j).getFromMonth() + "-"
                    + profile.get().getProjects().get(j).getToMonth() + " )");
            PROJECT_NAME_P_RUN.setFontFamily("Arial");
            PROJECT_NAME_P_RUN.setFontSize(10);
            PROJECT_NAME_P_RUN.setBold(true);
            // PROJECT_NAME_P_RUN.setUnderline(UnderlinePatterns.SINGLE);

            XWPFTable PROJECT_LIST_T = doc.createTable(projectSkillList.size() + 4, 2);
            PROJECT_LIST_T.setWidth("100%");

            PROJECT_LIST_T.setInsideHBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
            PROJECT_LIST_T.setInsideVBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
            PROJECT_LIST_T.setTopBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
            PROJECT_LIST_T.setBottomBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
            PROJECT_LIST_T.setLeftBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");
            PROJECT_LIST_T.setRightBorder(XWPFBorderType.SINGLE, 4, 0, "EBE4EC");

            List<XWPFTableRow> PROJECT_LIST_T_LIST_ROW = PROJECT_LIST_T.getRows();

            XWPFParagraph PROJECT_COMPANY_P = PROJECT_LIST_T_LIST_ROW.get(0).getCell(0)
                    .getParagraphs().get(0);
            PROJECT_COMPANY_P.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun PROJECT_COMPANY_P_RUN = PROJECT_COMPANY_P.createRun();
            PROJECT_COMPANY_P_RUN.setText("Company:");
            PROJECT_COMPANY_P_RUN.addBreak();
            PROJECT_COMPANY_P_RUN.setFontFamily("Arial");
            PROJECT_COMPANY_P_RUN.setFontSize(10);

            XWPFParagraph PROJECT_CLIENT_P = PROJECT_LIST_T_LIST_ROW.get(1).getCell(0)
                    .getParagraphs().get(0);
            PROJECT_CLIENT_P.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun PROJECT_CLIENT_P_RUN = PROJECT_CLIENT_P.createRun();
            PROJECT_CLIENT_P_RUN.setText("Client:");
            PROJECT_CLIENT_P_RUN.addBreak();
            PROJECT_CLIENT_P_RUN.setFontFamily("Arial");
            PROJECT_CLIENT_P_RUN.setFontSize(10);

            XWPFParagraph PROJECT_DESCRIPTION_P = PROJECT_LIST_T_LIST_ROW.get(2).getCell(0)
                    .getParagraphs().get(0);
            PROJECT_CLIENT_P.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun PROJECT_DESCRIPTION_P_RUN = PROJECT_DESCRIPTION_P.createRun();
            PROJECT_DESCRIPTION_P_RUN.setText("Project Description:");
            PROJECT_DESCRIPTION_P_RUN.addBreak();
            PROJECT_DESCRIPTION_P_RUN.setFontFamily("Arial");
            PROJECT_DESCRIPTION_P_RUN.setFontSize(10);

            XWPFParagraph PROJECT_RESPONSIBILITIES_P = PROJECT_LIST_T_LIST_ROW.get(3).getCell(0)
                    .getParagraphs().get(0);
            PROJECT_RESPONSIBILITIES_P.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun PROJECT_RESPONSIBILITIES_P_RUN = PROJECT_RESPONSIBILITIES_P.createRun();
            PROJECT_RESPONSIBILITIES_P_RUN.setText("Responsibilities:");
            PROJECT_RESPONSIBILITIES_P_RUN.addBreak();
            PROJECT_RESPONSIBILITIES_P_RUN.setFontFamily("Arial");
            PROJECT_RESPONSIBILITIES_P_RUN.setFontSize(10);

            XWPFParagraph PROJECT_COMPANY_P1 = PROJECT_LIST_T_LIST_ROW.get(0).getCell(1)
                    .getParagraphs().get(0);
            PROJECT_COMPANY_P1.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun PROJECT_COMPANY_P1_RUN = PROJECT_COMPANY_P1.createRun();
            PROJECT_COMPANY_P1_RUN.setText(getCompanyName(profile.get().getWorkExperiences(),
                    profile.get().getProjects().get(j).getFromMonth(),
                    profile.get().getProjects().get(j).getToMonth()));
            PROJECT_COMPANY_P1_RUN.addBreak();
            PROJECT_COMPANY_P1_RUN.setFontFamily("Arial");
            PROJECT_COMPANY_P1_RUN.setFontSize(10);

            XWPFParagraph PROJECT_CLIENT_P2 = PROJECT_LIST_T_LIST_ROW.get(1).getCell(1)
                    .getParagraphs().get(0);
            PROJECT_CLIENT_P2.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun PROJECT_CLIENT_P2_RUN = PROJECT_CLIENT_P2.createRun();
            PROJECT_CLIENT_P2_RUN.setText(profile.get().getProjects().get(j).getClient());
            PROJECT_CLIENT_P2_RUN.addBreak();
            PROJECT_CLIENT_P2_RUN.setFontFamily("Arial");
            PROJECT_CLIENT_P2_RUN.setFontSize(10);

            XWPFParagraph PROJECT_DESCRIPTION_P3 = PROJECT_LIST_T_LIST_ROW.get(2).getCell(1)
                    .getParagraphs().get(0);
            PROJECT_DESCRIPTION_P3.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun PROJECT_DESCRIPTION_P3_RUN = PROJECT_DESCRIPTION_P3.createRun();
            PROJECT_DESCRIPTION_P3_RUN.setText(profile.get().getProjects().get(j).getDescription());
            PROJECT_DESCRIPTION_P3_RUN.addBreak();
            PROJECT_DESCRIPTION_P3_RUN.setFontFamily("Arial");
            PROJECT_DESCRIPTION_P3_RUN.setFontSize(10);

            XWPFParagraph PROJECT_RESPONSIBILITIES_P4 = PROJECT_LIST_T_LIST_ROW.get(3).getCell(1)
                    .getParagraphs().get(0);
            PROJECT_RESPONSIBILITIES_P4.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun PROJECT_RESPONSIBILITIES_P4_RUN = PROJECT_RESPONSIBILITIES_P4.createRun();
            PROJECT_RESPONSIBILITIES_P4_RUN
                    .setText(profile.get().getProjects().get(j).getResponsibilities());
            PROJECT_RESPONSIBILITIES_P4_RUN.addBreak();
            PROJECT_RESPONSIBILITIES_P4_RUN.setFontFamily("Arial");
            PROJECT_RESPONSIBILITIES_P4_RUN.setFontSize(10);

            for (int i = 4; i < projectSkillList.size() + 4; i++) {

                XWPFParagraph PROJECT_SKILL_CATEGORY_P = PROJECT_LIST_T_LIST_ROW.get(i).getCell(0)
                        .getParagraphs().get(0);
                PROJECT_SKILL_CATEGORY_P.setAlignment(ParagraphAlignment.LEFT);
                XWPFRun PROJECT_SKILL_CATEGORY_P_RUN = PROJECT_SKILL_CATEGORY_P.createRun();
                PROJECT_SKILL_CATEGORY_P_RUN
                        .setText(projectSkillList.get(i - 4).getCategory() + ":");
                PROJECT_SKILL_CATEGORY_P_RUN.addBreak();
                PROJECT_SKILL_CATEGORY_P_RUN.setFontFamily("Arial");
                PROJECT_SKILL_CATEGORY_P_RUN.setFontSize(10);

                XWPFParagraph PROJECT_SKILL_NAME_P_RUN = PROJECT_LIST_T_LIST_ROW.get(i).getCell(1)
                        .getParagraphs().get(0);
                PROJECT_SKILL_NAME_P_RUN.setAlignment(ParagraphAlignment.LEFT);
                XWPFRun PROJECT_SKILL_NAME_P_RUN_RUN = PROJECT_SKILL_NAME_P_RUN.createRun();
                for (int k = 0; k < projectSkillList.get(i - 4).getSkills().length; k++) {
                    PROJECT_SKILL_NAME_P_RUN_RUN
                            .setText("- " + projectSkillList.get(i - 4).getSkills()[k]);
                    PROJECT_SKILL_NAME_P_RUN_RUN.addBreak();
                }
                PROJECT_SKILL_NAME_P_RUN_RUN.setFontFamily("Arial");
                PROJECT_SKILL_NAME_P_RUN_RUN.setFontSize(10);

            }
        }
        // #### PROJECT_LIST #### END

        // Save
        ByteArrayOutputStream fos = null;

        fos = new ByteArrayOutputStream();

        doc.write(fos);

        templateProfile.setFile(fos.toByteArray());

        return templateProfile;

    }

    private static void setParagraphShading(XWPFParagraph paragraph, String rgb) {
        if (paragraph.getCTP().getPPr() == null)
            paragraph.getCTP().addNewPPr();
        if (paragraph.getCTP().getPPr().getShd() != null)
            paragraph.getCTP().getPPr().unsetShd();
        paragraph.getCTP().getPPr().addNewShd();
        paragraph.getCTP().getPPr().getShd()
                .setVal(org.openxmlformats.schemas.wordprocessingml.x2006.main.STShd.CLEAR);
        paragraph.getCTP().getPPr().getShd().setColor("auto");
        paragraph.getCTP().getPPr().getShd().setFill(rgb);
    }

    private static void mergeCellsVertically(XWPFTable table, int col, int fromRow, int toRow) {
        for (int rowIndex = fromRow; rowIndex <= toRow; rowIndex++) {
            XWPFTableCell cell = table.getRow(rowIndex).getCell(col);
            if (rowIndex == fromRow) {
                // The first merged cell is set with RESTART merge value
                cell.getCTTc().addNewTcPr().addNewVMerge().setVal(STMerge.RESTART);
            } else {
                // Cells which join (merge) the first one, are set with CONTINUE
                cell.getCTTc().addNewTcPr().addNewVMerge().setVal(STMerge.CONTINUE);
            }
        }
    }

    static void mergeCellHorizontally(XWPFTable table, int row, int fromCol, int toCol) {
        for (int colIndex = fromCol; colIndex <= toCol; colIndex++) {
            XWPFTableCell cell = table.getRow(row).getCell(colIndex);
            CTHMerge hmerge = CTHMerge.Factory.newInstance();
            if (colIndex == fromCol) {
                // The first merged cell is set with RESTART merge value
                hmerge.setVal(STMerge.RESTART);
            } else {
                // Cells which join (merge) the first one, are set with CONTINUE
                hmerge.setVal(STMerge.CONTINUE);
                // and the content should be removed
                for (int i = cell.getParagraphs().size(); i > 0; i--) {
                    cell.removeParagraph(0);
                }
                cell.addParagraph();
            }
            // Try getting the TcPr. Not simply setting an new one every time.
            CTTcPr tcPr = cell.getCTTc().getTcPr();
            if (tcPr != null) {
                tcPr.setHMerge(hmerge);
            } else {
                // only set an new TcPr if there is not one already
                tcPr = CTTcPr.Factory.newInstance();
                tcPr.setHMerge(hmerge);
                cell.getCTTc().setTcPr(tcPr);
            }
        }
    }

    private static CTAnchor getAnchorWithGraphic(CTGraphicalObject graphicalobject,
            String drawingDescr, int width, int height, int left, int top) throws Exception {

        String anchorXML = "<wp:anchor xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" "
                + "simplePos=\"0\" relativeHeight=\"0\" behindDoc=\"1\" locked=\"0\" layoutInCell=\"1\" allowOverlap=\"1\">"
                + "<wp:simplePos x=\"0\" y=\"0\"/>"
                + "<wp:positionH relativeFrom=\"column\"><wp:posOffset>" + left
                + "</wp:posOffset></wp:positionH>"
                + "<wp:positionV relativeFrom=\"paragraph\"><wp:posOffset>" + top
                + "</wp:posOffset></wp:positionV>" + "<wp:extent cx=\"" + width + "\" cy=\""
                + height + "\"/>" + "<wp:effectExtent l=\"0\" t=\"0\" r=\"0\" b=\"0\"/>"
                + "<wp:wrapTight wrapText=\"bothSides\">" + "<wp:wrapPolygon edited=\"0\">"
                + "<wp:start x=\"0\" y=\"0\"/>" + "<wp:lineTo x=\"0\" y=\"21600\"/>"
                + "<wp:lineTo x=\"21600\" y=\"21600\"/>" + "<wp:lineTo x=\"21600\" y=\"0\"/>"
                + "<wp:lineTo x=\"0\" y=\"0\"/>" + "</wp:wrapPolygon>" + "</wp:wrapTight>"
                + "<wp:docPr id=\"1\" name=\"Drawing 0\" descr=\"" + drawingDescr
                + "\"/><wp:cNvGraphicFramePr/>" + "</wp:anchor>";

        CTDrawing drawing = CTDrawing.Factory.parse(anchorXML);
        CTAnchor anchor = drawing.getAnchorArray(0);
        anchor.setGraphic(graphicalobject);
        return anchor;
    }

    private String getCompanyName(List<WorkExperience> workExperiences, String fromMonth,
            String toMonth) throws ParseException {
        String company = "";
        Date fm = new SimpleDateFormat("MMM - yyyy").parse(fromMonth.substring(0, 10));
        Date tm = new SimpleDateFormat("MMM - yyyy").parse(toMonth.substring(0, 10));

        for (int i = 0; i < workExperiences.size(); i++) {
            Date wfm = new SimpleDateFormat("MMM - yyyy")
                    .parse(workExperiences.get(i).getFromMonth().substring(0, 10));
            Date wtm = new SimpleDateFormat("MMM - yyyy")
                    .parse(workExperiences.get(i).getToMonth().substring(0, 10));

            if (fm.after(wfm) && tm.before(wtm)) {
                return company = workExperiences.get(i).getCompany();
            }
        }
        return company;
    }

}