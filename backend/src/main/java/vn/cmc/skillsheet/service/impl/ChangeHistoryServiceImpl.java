package vn.cmc.skillsheet.service.impl;

import java.lang.reflect.Field;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.event.spi.PostUpdateEvent;
import org.springframework.stereotype.Service;

import vn.cmc.skillsheet.entity.Candidate;
import vn.cmc.skillsheet.entity.Certificate;
import vn.cmc.skillsheet.entity.ChangeHistory;
import vn.cmc.skillsheet.entity.Education;
import vn.cmc.skillsheet.entity.Email;
import vn.cmc.skillsheet.entity.Language;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.ProfileCertificate;
import vn.cmc.skillsheet.entity.ProfileSkill;
import vn.cmc.skillsheet.entity.Project;
import vn.cmc.skillsheet.entity.ProjectRole;
import vn.cmc.skillsheet.entity.RequestApproval;
import vn.cmc.skillsheet.entity.School;
import vn.cmc.skillsheet.entity.Skill;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.entity.TemplateProfile;
import vn.cmc.skillsheet.entity.Version;
import vn.cmc.skillsheet.entity.WorkExperience;
import vn.cmc.skillsheet.service.ChangeHistoryService;

@Service
public class ChangeHistoryServiceImpl implements ChangeHistoryService {

    @Override
    public List<ChangeHistory> compareObjDiffForUpdate(PostUpdateEvent event, Object[] oldEntity,
            Object[] newEntity, Object entity, String action, String editor) {
        List<ChangeHistory> odVoL = new ArrayList<>();
        Date date = new Date();
//        String strDateFormat = "dd/MM/yyyy hh:mm:ss a";
//        DateFormat dateFormat = new SimpleDateFormat(strDateFormat);
//        String time = dateFormat.format(date);
        ChangeHistory odVo = new ChangeHistory();
        odVo.setEditor(editor);
        odVo.setTime(date);
        odVo.setCreatedDate(date);
        odVo.setAction(action);
        odVo.setOldValue("");
        odVo.setField("");
        if (entity instanceof School) {
            School s = (School) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "School");
            return changeHistories;

        }
        if (entity instanceof Certificate) {
            Certificate s = (Certificate) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "Certificate");
            return changeHistories;
        }
        if (entity instanceof Candidate) {
            Candidate s = (Candidate) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "Candidate");
            return changeHistories;
        }
        if (entity instanceof Education) {
            Education s = (Education) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "Education");
            return changeHistories;
        }
        if (entity instanceof Email) {
            Email s = (Email) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "Email Setting");
            return changeHistories;
        }
        if (entity instanceof Language) {
            Language s = (Language) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "Language");
            return changeHistories;
        }
        if (entity instanceof Profile) {
            Profile s = (Profile) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "Profile");
            return changeHistories;
        }
        if (entity instanceof ProjectRole) {
            ProjectRole s = (ProjectRole) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "ProjectRole");
            return changeHistories;
        }
        if (entity instanceof RequestApproval) {
            RequestApproval s = (RequestApproval) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "RequestApproval");
            return changeHistories;
        }
        if (entity instanceof Skill) {
            Skill s = (Skill) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "Skill");
            return changeHistories;
        }
        if (entity instanceof Staff) {
            Staff s = (Staff) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "Staff");
            return changeHistories;
        }
        if (entity instanceof TemplateProfile) {
            TemplateProfile s = (TemplateProfile) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "TemplateProfile");
            return changeHistories;
        }
        if (entity instanceof Version) {
            Version s = (Version) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "Version");
            return changeHistories;
        }
        if (entity instanceof ProfileCertificate) {
            ProfileCertificate s = (ProfileCertificate) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "ProfileCertificate");
            return changeHistories;
        }
        if (entity instanceof ProfileSkill) {
            ProfileSkill s = (ProfileSkill) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "ProfileSkill");
            return changeHistories;
        }
        if (entity instanceof Project) {
            Project s = (Project) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "Project");
            return changeHistories;
        }
        if (entity instanceof WorkExperience) {
            WorkExperience s = (WorkExperience) entity;
            List<ChangeHistory> changeHistories = compareObjDiff(odVoL, newEntity, oldEntity,
                    event.getPersister().getPropertyNames(), editor, action, "WorkExperience");
            return changeHistories;
        }
        odVoL.add(odVo);
        return odVoL;
    }

    @Override
    public List<ChangeHistory> compareObjDiffForSave(Object entity, String action, String editor) {
        List<ChangeHistory> odVoL = new ArrayList<>();
        Date date = new Date();
//        String strDateFormat = "dd/MM/yyyy hh:mm:ss a";
//        DateFormat dateFormat = new SimpleDateFormat(strDateFormat);
//        String time = dateFormat.format(date);
        ChangeHistory odVo = new ChangeHistory();
        odVo.setTime(date);
        odVo.setCreatedDate(date);
        odVo.setAction(action);
        odVo.setOldValue("");
        odVo.setField("");
        if (entity instanceof School) {
            odVo.setTable("School");
            School s = (School) entity;
            odVo.setEditor(s.getCreateBy());
            odVo.setNewValue(s.toString());
        }
        if (entity instanceof Certificate) {
            odVo.setTable("Certificate");
            Certificate s = (Certificate) entity;
            odVo.setEditor(s.getCreateBy());
            odVo.setNewValue(s.toString());
        }
        if (entity instanceof Candidate) {
            odVo.setTable("Candidate");
            Candidate s = (Candidate) entity;
            odVo.setEditor(s.getCreateBy());
            odVo.setNewValue(s.toString());
        }
        if (entity instanceof Education) {
            odVo.setTable("Education");
            Education s = (Education) entity;
            odVo.setNewValue(s.toString());
        }
        if (entity instanceof Email) {
            odVo.setTable("Email");
            Email s = (Email) entity;
            odVo.setNewValue(s.toString());
        }
        if (entity instanceof Language) {
            odVo.setTable("Language");
            Language s = (Language) entity;
            odVo.setNewValue(s.toString());
        }
        if (entity instanceof Profile) {
            odVo.setTable("Profile");
            Profile s = (Profile) entity;
            s.setAvatar(null);
            odVo.setNewValue(s.toString());
        }
        if (entity instanceof ProjectRole) {
            odVo.setTable("ProjectRole");
            ProjectRole s = (ProjectRole) entity;
            odVo.setEditor(s.getCreateBy());
            odVo.setNewValue(s.toString());
        }
        if (entity instanceof RequestApproval) {
            odVo.setTable("RequestApproval");
            RequestApproval s = (RequestApproval) entity;
            odVo.setNewValue(s.toString());
        }
        if (entity instanceof Skill) {
            odVo.setTable("Skill");
            Skill s = (Skill) entity;
            odVo.setEditor(s.getCreateBy());
            odVo.setNewValue(s.toString());
        }
        if (entity instanceof Staff) {
            odVo.setTable("Staff");
            Staff s = (Staff) entity;
            odVo.setNewValue(s.toString());
        }
//        if (entity instanceof TemplateProfile) {
//            odVo.setTable("TemplateProfile");
//            TemplateProfile s = (TemplateProfile) entity;
//            s.setFile(null);
//            odVo.setNewValue(s.toString());
//        }
        if (entity instanceof Version) {
            odVo.setTable("Version");
            Version s = (Version) entity;
            odVo.setNewValue(s.toString());
        }
        if (entity instanceof ProfileCertificate) {
            odVo.setTable("ProfileCertificate");
            ProfileCertificate s = (ProfileCertificate) entity;
            odVo.setNewValue(s.toString());
        }
        if (entity instanceof ProfileSkill) {
            odVo.setTable("ProfileSkill");
            ProfileSkill s = (ProfileSkill) entity;
            odVo.setNewValue(s.toString());
        }
        if (entity instanceof Project) {
            odVo.setTable("Project");
            Project s = (Project) entity;
            odVo.setNewValue(s.toString());
        }
        if (entity instanceof WorkExperience) {
            odVo.setTable("WorkExperience");
            WorkExperience s = (WorkExperience) entity;
            odVo.setNewValue(s.toString());
        }
        odVoL.add(odVo);

        return odVoL;
    }

    @Override
    public List<ChangeHistory> compareObjDiffForDelete(Object entity, String action,
            String editor) {
        List<ChangeHistory> odVoL = new ArrayList<>();
        Date date = new Date();
//        String strDateFormat = "dd/MM/yyyy hh:mm:ss a";
//        DateFormat dateFormat = new SimpleDateFormat(strDateFormat);
//        String time = dateFormat.format(date);
        ChangeHistory odVo = new ChangeHistory();
        odVo.setEditor(editor);
        odVo.setTime(date);
        odVo.setCreatedDate(date);

        odVo.setAction(action);
        odVo.setNewValue("");
        odVo.setField("");
        if (entity instanceof School) {
            odVo.setTable("School");
            School s = (School) entity;
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof Certificate) {
            odVo.setTable("Certificate");
            Certificate s = (Certificate) entity;
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof Candidate) {
            odVo.setTable("Candidate");
            Candidate s = (Candidate) entity;
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof Education) {
            odVo.setTable("Education");
            Education s = (Education) entity;
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof Email) {
            odVo.setTable("Email");
            Email s = (Email) entity;
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof Language) {
            odVo.setTable("Language");
            Language s = (Language) entity;
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof Profile) {
            odVo.setTable("Profile");
            Profile s = (Profile) entity;
            s.setAvatar(null);
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof ProjectRole) {
            odVo.setTable("ProjectRole");
            ProjectRole s = (ProjectRole) entity;
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof RequestApproval) {
            odVo.setTable("RequestApproval");
            RequestApproval s = (RequestApproval) entity;
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof Skill) {
            odVo.setTable("Skill");
            Skill s = (Skill) entity;
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof Staff) {
            odVo.setTable("Staff");
            Staff s = (Staff) entity;
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof TemplateProfile) {
            odVo.setTable("TemplateProfile");
            TemplateProfile s = (TemplateProfile) entity;
            s.setFile(null);
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof Version) {
            odVo.setTable("Version");
            Version s = (Version) entity;
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof ProfileCertificate) {
            odVo.setTable("ProfileCertificate");
            ProfileCertificate s = (ProfileCertificate) entity;
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof ProfileSkill) {
            odVo.setTable("ProfileSkill");
            ProfileSkill s = (ProfileSkill) entity;
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof Project) {
            odVo.setTable("Project");
            Project s = (Project) entity;
            odVo.setOldValue(s.toString());
        }
        if (entity instanceof WorkExperience) {
            odVo.setTable("WorkExperience");
            WorkExperience s = (WorkExperience) entity;
            odVo.setOldValue(s.toString());
        }
        odVoL.add(odVo);

        return odVoL;
    }

    private List<ChangeHistory> compareObjDiff(List<ChangeHistory> odVoL1, Object[] currentState,
            Object[] previousState, String[] propertyNames, String editor, String action,
            String tableName) {
        Date date = new Date();
//        String strDateFormat = "dd/MM/yyyy hh:mm:ss a";
//        DateFormat dateFormat = new SimpleDateFormat(strDateFormat);
//        String time = dateFormat.format(date);
        ChangeHistory odVo = new ChangeHistory();
        odVo.setTable(tableName);
        odVo.setEditor(editor);
        odVo.setTime(date);
        odVo.setCreatedDate(date);
        odVo.setAction(action);
        odVo.setField("");
        try {
        	for (int i = 0; i < propertyNames.length; i++) {
                if (null != previousState[i] && null != currentState[i]
                        && !previousState[i].equals(currentState[i])
                        && !"createdDate".equals(propertyNames[i])
                        && !"updatedDate".equals(propertyNames[i])
                        && !"avatar".equals(propertyNames[i])
                        && !"file".equals(propertyNames[i])) {
                    if (null != odVo.getOldValue()) {
                        if (i == propertyNames.length) {
                            odVo.setOldValue(odVo.getOldValue() + "\"" + propertyNames[i] + "\":" + "\""
                                    + previousState[i].toString() + "\"");
                            odVo.setNewValue(odVo.getNewValue() + "\"" + propertyNames[i] + "\":" + "\""
                                    + currentState[i].toString() + "\"");
                        } else {
                            odVo.setOldValue(odVo.getOldValue() + "\"" + propertyNames[i] + "\":" + "\""
                                    + previousState[i].toString() + "\"" + ",");
                            odVo.setNewValue(odVo.getNewValue() + "\"" + propertyNames[i] + "\":" + "\""
                                    + currentState[i].toString() + "\"" + ",");
                        }
                    } else {
                        if (i == propertyNames.length) {
                            odVo.setOldValue("\"" + propertyNames[i] + "\":" + "\""
                                    + previousState[i].toString() + "\"");
                            odVo.setNewValue("\"" + propertyNames[i] + "\":" + "\""
                                    + currentState[i].toString() + "\"");
                        } else {
                            odVo.setOldValue("\"" + propertyNames[i] + "\":" + "\""
                                    + previousState[i].toString() + "\"" + ",");
                            odVo.setNewValue("\"" + propertyNames[i] + "\":" + "\""
                                    + currentState[i].toString() + "\"" + ",");
                        }
                    }
                }
            }
		} catch (Exception e) {
			e.printStackTrace();
		}
        
        odVo.setOldValue("{" + odVo.getOldValue() + "}");
        odVo.setNewValue("{" + odVo.getNewValue() + "}");
        odVoL1.add(odVo);
        return odVoL1;
    }

}
